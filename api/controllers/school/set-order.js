module.exports = {


  friendlyName: 'Set order of an application for recommendation by school admin',


  inputs: {

    id: {
      friendlyName: 'Application id',
      type: 'string',
      required: true
    },

    order: {
      type: 'number',
      required: true
    }

  },


  exits: {

    success: {
      description: 'success',
      extendedDescription:``
    },

    forbidden: {
      responseType: 'forbidden'
    },

    notFound: {
      responseType: 'notFound'
    }

  },


  fn: async function (inputs) {

    if (!this.req.me.isSchoolAdmin || !this.req.me.school) {
      throw 'forbidden';
    }

    let application = await Application.findOne({
      id: inputs.id
    });

    if (!application || application.school !== this.req.me.school) {
      throw 'notFound';
    }

    application = await Application.update({
      id: application.id
    })
      .set({
        order: inputs.order
      });

    return;

  }

};
