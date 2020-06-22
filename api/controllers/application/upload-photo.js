module.exports = {


  friendlyName: 'Upload avatar',


  description: '',


  inputs: {

    id: {
      friendlyName: 'Application id',
      type: 'number',
      required: true
    }

  },


  exits: {

    success:{
      responseType:'ok',
    },

    notFound: {
      responseType: 'notFound'
    },

    serverError: {
      responseType: 'serverError'
    }

  },


  fn: async function (inputs) {

    const os = require('os');
    let splitChar = '';
    if(os.type() === 'Windows_NT'){
      splitChar = sails.config.custom.windowsSplitChar;
    }
    else{
      splitChar = sails.config.custom.linuxSplitChar;
    }

    let application = await Application.findOne({
      id: inputs.id,
      user: this.req.me.id
    });

    if (!application) {
      throw 'notFound';
    }

    const fs = require('fs');
    let picName;
    const dirname = require('path').resolve(sails.config.paths.public, 'public/avatars/');  // .tmp/public/public/avatars
    const rootDir = require('path').resolve(sails.config.appPath, 'assets/public/');
    const copyDir = rootDir + splitChar + 'avatars/';

    if(!fs.existsSync(rootDir)){
      fs.mkdirSync(rootDir);
    }

    if(!fs.existsSync(copyDir)){
      fs.mkdirSync(copyDir);
    }

    let fd = await new Promise((resolve) => {
      let options = {
        dirname: dirname
      };
      this.req.file('photo').upload(options, (err, uploadedFile)=>{
        if (err || !uploadedFile || uploadedFile.length <= 0) { throw 'serverError'; }

        let fd = uploadedFile[0].fd;
        picName = _.last(_.split(fd, splitChar));
        fs.copyFile(fd, `${copyDir}/${picName}`, (err) => {
          if (err) { throw 'serverError'; }

          resolve(fd);
        });
      });
    });

    // Remove old photo
    if (application.photo) {
      let picAddress = dirname + splitChar + application.photo;
      if (fs.existsSync(picAddress)) {
        fs.unlinkSync(picAddress);
      }
      picAddress = copyDir + splitChar + application.photo;
      if (fs.existsSync(picAddress)) {
        fs.unlinkSync(picAddress);
      }
    }

    // let picName = _.last(_.split(fd, splitChar));
    await Application.updateOne({ id: inputs.id }).set({ photo: picName });

    return picName;

  }


};
