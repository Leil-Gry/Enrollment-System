module.exports = {


  friendlyName: 'View statistics',


  description: 'Display "statistics" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/statistics',
    },

    // redirect: {
    //   description: 'The requesting user is already logged in.',
    //   responseType: 'redirect'
    // }

  },


  fn: async function () {

    // if (this.req.me) {
    //   throw {redirect: '/'};
    // }

    return {};

  }


};
