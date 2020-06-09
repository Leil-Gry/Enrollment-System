var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
var ImageModule = require('docxtemplater-image-module');
var expressions = require('angular-expressions');
var fs = require('fs');
var path = require('path');
const libre = require('libreoffice-convert');

var merge = require('lodash/merge');
expressions.filters.lower = function(input) {
  // This condition should be used to make sure that if your input is undefined, your output will be undefined as well and will not throw an error
  if (!input) {return input;}
  return input.toLowerCase();
};

function angularParser(tag) {
  if (tag === '.') {
    return {
      get: function(s){ return s;}
    };
  }
  const expr = expressions.compile(
      tag.replace(/(’|‘)/g, '\'').replace(/(“|”)/g, '"')
  );
  return {
    get: function(scope, context) {
      let obj = {};
      const scopeList = context.scopeList;
      const num = context.num;
      for (let i = 0, len = num + 1; i < len; i++) {
        obj = merge(obj, scopeList[i]);
      }
      return expr(scope, obj);
    }
  };
}


module.exports = {


  friendlyName: 'Get application form',


  description: '',


  inputs: {

    id: {
      friendlyName: 'Application id',
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      responseType: 'file'
    },

    notFound: {
      responseType: 'notFound',
      description: 'The application is not found'
    },

    wrongStatus: {
      responseType: 'forbidden',
      description: 'The application is not downloadable for its status'
    },

    templateError: {
      responseType: 'serverError',
      description: 'Error when finding template'
    }

  },


  fn: async function (inputs, exits) {
    let outPDF = (sails.config.environment === 'production');

    let application = await Application.findOne({
      id: inputs.id,
      user: this.req.me.id
    })
      .populate('school');

    if (!application) {
      throw 'notFound';
    }

    if (application.status === constants.APPLICATION_STATUS_EDITING) {
      throw 'wrongStatus';
    }

    let opts = {};
    opts.centered = false;
    opts.getImage = function (tagValue, tagName) {
      return fs.readFileSync(tagValue);
    };
    opts.getSize = function(img, tagValue, tagName) {
      return [98, 130];  // [148, 196];
    };
    var imageModule = new ImageModule(opts);

    let fileName = '两项计划报名登记表.' + (outPDF ? 'pdf' : 'docx');

    var content = fs.readFileSync(path.resolve(sails.config.appPath, 'assets/templates/form-template.docx'), 'binary');

    var zip = new PizZip(content);
    var doc;
    try {
      // doc = new Docxtemplater(zip, { parser:angularParser });
      doc = new Docxtemplater()
                .attachModule(imageModule)
                .loadZip(zip)
                .setOptions({ parser: angularParser });
    } catch(error) {
      errorHandler(error);
    }

    application.edu = application.education;
    application.pastMH = application.pastMedicalHistory;
    application.doP = application.domicileProvince;
    application.photo = application.photo ? sails.config.appPath + `/assets/public/avatars/${application.photo}` : undefined;
    application.oby = application.obeyTheAdjustment ? '■' : '□';
    application.obn = application.obeyTheAdjustment ? '□' : '■';
    application.wiy = application.workedInTheCYL ? '■' : '□';
    application.win = application.workedInTheCYL ? '□' : '■';
    doc.setData(application);

    try {
      doc.render();
    } catch (error) {
      errorHandler(error);
    }

    var buf = doc.getZip().generate({type: 'nodebuffer', compression: 'DEFLATE'});
    if (outPDF){
      buf = await new Promise((resolve, reject) => {
        libre.convert(buf, 'pdf', undefined, (err, result) => {
          if (err) {
            return reject(Error(`Error converting file: ${err}`));
          }

          return resolve(result);
        });
      });
    }

    return exits.success({
      fileName,
      buf
    });

  }

};

// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
function replaceErrors(key, value) {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce((error, key) => {
      error[key] = value[key];
      return error;
    }, {});
  }
  return value;
}

function errorHandler(error) {
  console.log(JSON.stringify({error: error}, replaceErrors));

  if (error.properties && error.properties.errors instanceof Array) {
    const errorMessages = error.properties.errors.map((error) => {
      return error.properties.explanation;
    }).join('\n');
    console.log('errorMessages', errorMessages);
    // errorMessages is a humanly readable message looking like this :
    // 'The tag beginning with "foobar" is unopened'
  }
  throw error;
}
