module.exports = {


  friendlyName: 'Find one application',


  description: '',


  inputs: {

    id: {
      friendlyName: 'Application id',
      type: 'string',
      required: true
    }

  },


  exits: {

    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    }

  },


  fn: async function (inputs) {

    let application = await Application.findOne({ id: inputs.id})
      .populate('school');

    if (!application) {
      throw 'notFound';
    }

    if (this.req.me.isSuperAdmin) {

    } else if (this.req.me.isSchoolAdmin) {
      if (!this.req.me.school) {
        throw 'forbidden';
      }
      if (!application.school || application.school.id !== this.req.me.school) {
        throw 'forbidden';
      }
    } else {
      throw 'forbidden';
    }

    return application;

  }


};
