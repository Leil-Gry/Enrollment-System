module.exports = {


  friendlyName: 'View email not confirmed',


  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/email-not-confirmed'
    },

    redirect: {
      responseType: 'redirect'
    }

  },


  fn: async function () {

    if (!this.req.me) {
      throw { redirect: '/login' };
    }

    // Respond with view.
    return {};

  }


};
