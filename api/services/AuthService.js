
const url = require('url');

module.exports = {

  sendConfirmEmail: function (to, token) {

    var verifyUrl = url.resolve(sails.config.custom.baseUrl,'/email/confirm')+'?token='+encodeURIComponent(token);

    // nodemailer-sendcloud-transport
    var email = {
      // to: to, //values.email,
      from: 'no-reply@notice.zjgqt.org',
      fromname: '两项计划',
      template_invoke_name: 'confirm_template',
      // resp_email_id: true,
      substitution_vars: JSON.stringify({
        to: [to],
        sub: {
          "%url%": [verifyUrl]
        }
      })
    };

    return new Promise((resolve, reject) => {
      MailerService.sendMail(email, (err, res) => {
        if (err) {
          return reject(err);
        } else {
          var json = JSON.parse(res);  // res is string not json
          // console.log(JSON.stringify(res, null, 4))
          if (json.message === 'error') {
            return reject(json.errors);
          } else {
            return resolve(json);
          }
        }
      });
    });
  },

  sendPasswordResetEmail: function (to, token) {

    var resetUrl = url.resolve(sails.config.custom.baseUrl,'/password/new')+'?token='+encodeURIComponent(token);

    var email = {
      // to: to, //values.email,
      from: 'no-reply@notice.zjgqt.org',
      fromname: '两项计划',
      template_invoke_name: 'reset_template',
      // resp_email_id: true,
      substitution_vars: JSON.stringify({
        to: [to],
        sub: {
          "%resetUrl%": [resetUrl]
        }
      })
    };

    return new Promise((resolve, reject) => {
      MailerService.sendMail(email, (err, res) => {
        if (err) {
          return reject(err);
        } else {
          var json = JSON.parse(res);  // res is string not json
          // console.log(JSON.stringify(res, null, 4))
          if (json.message === 'error') {
            return reject(json.errors);
          } else {
            return resolve(json);
          }
        }
      });
    });
  }

};
