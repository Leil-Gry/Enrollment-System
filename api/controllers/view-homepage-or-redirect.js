module.exports = {


  friendlyName: 'View homepage or redirect',


  description: 'Display or redirect to the appropriate homepage, depending on login status.',


  exits: {

    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/homepage'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    },

  },


  fn: async function () {

    if (this.req.me) {
      if (this.req.me.isSuperAdmin) {
        throw { redirect: '/admin/dashboard' };
      } else if (this.req.me.isSchoolAdmin) {
        throw { redirect: '/school/dashboard' };
      } else {
        throw { redirect: '/user/apply' };
      }
    } else {
      throw { redirect: '/login' };
    }

    // return {};

  }


};
