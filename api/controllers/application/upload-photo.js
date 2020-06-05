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
    const dirname = require('path').resolve(sails.config.appPath, sails.config.custom.avatarLocation);
    let fd = await new Promise((resolve) => {
      let options = {
        dirname: dirname
      };
      this.req.file('photo').upload(options,(err, uploadedFile)=>{
        if (err || !uploadedFile || uploadedFile.length <= 0) { throw 'serverError'; }
        resolve(uploadedFile[0].fd);
      });
    });

    // Remove old photo
    if (application.photo) {
      let picAddress = dirname + splitChar + application.photo;
      if (fs.existsSync(picAddress)) {
        fs.unlinkSync(picAddress);
      }
    }

    let picName = _.last(_.split(fd, splitChar));
    await Application.updateOne({ id: inputs.id }).set({ photo: picName });

    return picName;

  }


};
