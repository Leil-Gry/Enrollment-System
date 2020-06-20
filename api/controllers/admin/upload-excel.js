module.exports = {


  friendlyName: 'upload excel',


  description: 'upload excel',


  exits: {
    success:{
      responseType:'ok',
    },

    notFound: {
      responseType: 'string'
    },

  },


  fn: async function () {
    let splitChar = (require('os').type() === 'Windows_NT') ?
    sails.config.custom.windowsSplitChar :
    sails.config.custom.linuxSplitChar;

    const fs = require('fs');
    let dest;
    const dirname = require('path').resolve(sails.config.paths.public, 'public/excels/');  // .tmp/public/public/excels
    const copyDir = require('path').resolve(sails.config.appPath, 'assets/public/excels/');
    await new Promise((resolve) => {
      let options = {
        dirname: dirname
      };
      this.req.file('excel').upload(options, (err, uploadedFile) => {
        if (err || !uploadedFile || uploadedFile.length <= 0) { throw 'serverError'; }

        let fd = uploadedFile[0].fd;
        let fileName = 'position.xlsx';
        dest = copyDir + splitChar + fileName;

        if(!fs.existsSync(copyDir)){
          fs.mkdirSync(copyDir);
        }

        fs.copyFile(fd, dest, (err) => {
          if (err) { console.log(err); throw 'serverError'; }

          resolve(fd);
        });
      });
    });

    let oldPositionList = await Position.find({
      batch: this.req.currentBatch.id
    });

    const XLSX = require('xlsx');

    var book = XLSX.readFile(dest);
    var sheet1 = book.Sheets[book.SheetNames[0]];
    var range = XLSX.utils.decode_range(sheet1['!ref']);

    let positionList = [];
    for(let i = range.s.r + 1; i <= range.e.r; i++){
      let cell = XLSX.utils.encode_cell({c:0, r:i});
      let name = sheet1[cell].v;
      let isExist = false;
      for (let i = 0; i < oldPositionList.length; i++){
        if(oldPositionList[i].name === name){
          isExist = true;
          break;
        }
      }
      if(isExist) { continue; }

      positionList.push({
        name: sheet1[cell].v,
        batch: this.req.currentBatch.id
      });
    }

    if(positionList.length === 0){
      return 'notFound';
    }

    return await Position.createEach(positionList).fetch();

  }


};
