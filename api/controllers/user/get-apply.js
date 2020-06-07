module.exports = {

  friendlyName: 'GetApply',

  description: 'Get the apply.',

  exits: {

    notFound: {
      responseType: 'notFound',
      description: 'The application is not found'
    }

  },


  fn: async function () {

    let application = await Application.findOne({
      user: this.req.me.id
    });

    if (!application) {
      throw 'notFound';
    }

    return application;
  }
};
