module.exports = {


  friendlyName: 'Update status of an application by school admin',


  inputs: {

    id: {
      friendlyName: 'Application id',
      type: 'string',
      required: true
    },

    status: {
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
    },

    wrongStatus: {
      responseType: 'forbidden'
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

    if (inputs.status === constants.APPLICATION_STATUS_CHECKED) {
      if (application.status !== constants.APPLICATION_STATUS_SUBMITTED) {
        throw 'wrongStatus';
      }
    } else if (inputs.status === constants.APPLICATION_STATUS_EDITING) {
      if (application.status !== constants.APPLICATION_STATUS_SUBMITTED) {
        throw 'wrongStatus';
      }
    } else {
      throw 'wrongStatus';
    }

    application = await Application.update({
      id: application.id
    })
      .set({
        status: inputs.status
      });

    return;

  }

};
