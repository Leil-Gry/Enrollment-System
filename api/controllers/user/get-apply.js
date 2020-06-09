module.exports = {

  friendlyName: 'GetApply',

  description: 'Get the apply.',

  exits: {

    notFound: {
      responseType: 'string',
      description: 'The application is not found'
    }

  },


  fn: async function () {

    let application = await Application.findOne({
      user: this.req.me.id
    });

    if (!application) {
      return 'notFound';
    }

    return application;
  }
};
