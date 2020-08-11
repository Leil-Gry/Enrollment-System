/**
 * Usage
 * sails run set-seed-data
 *
 * May first destroy organizations, products, mappings, devices
 *
 * for production env
 * sails_environment=production sails_hooks__http=false sails_hooks__request=false sails_hooks__response=false sails_hooks__blueprints=false sails_hooks__policies=false sails_hooks__security=false sails_hooks__logger=false sails_hooks__grunt=false sails_hooks__sockets=false sails_hooks__cron=false sails_hooks__mongoat=false sails_hooks__winston=false sails_hooks__views=false node ./node_modules/sails/bin/sails.js run set-seed-data
 * Disable hooks:
 *   http
 *   request
 *   response
 *   blueprints
 *   policies
 *   security
 *   logger
 *   grunt
 *   views
 *   sockets
 *   cron
 *   mongoat
 *   custom-blueprints (auto disabled by disabling blueprints)
 *   winston (optional, for sails.log)
 */

module.exports = {


  friendlyName: 'Set seed data',

  inputs: {
  },


  fn: async function (inputs, exits) {

    // ╦ ╦┌─┐┌─┐┬─┐
    // ║ ║└─┐├┤ ├┬┘
    // ╚═╝└─┘└─┘┴└─
    const users = [{ emailAddress: '1@a.com', fullName: '张三', password: await sails.helpers.passwords.hashPassword('abc123') }];

    let createdUsers = [];
    for (const user of users) {
      let found = await User.find({ emailAddress: user.emailAddress }).limit(1);
      if (!found || found.length <= 0) {
        found = await User.create(user)
          .fetch();
      } else {
        found = found[0];
      }
      createdUsers.push(found);
    }

    return exits.success();

  }


};

