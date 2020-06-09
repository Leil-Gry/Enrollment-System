module.exports = {


  friendlyName: 'Update status of an application by web admin',


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

    if (!this.req.me.isSuperAdmin) {
      throw 'forbidden';
    }

    let application = await Application.findOne({
      id: inputs.id
    });

    if (!application) {
      throw 'notFound';
    }

    if (inputs.status === constants.APPLICATION_STATUS_EXAMED) {
      if (application.status !== constants.APPLICATION_STATUS_RECOMMENDED) {
        throw 'wrongStatus';
      }
    } else if (inputs.status === constants.APPLICATION_STATUS_ADMITTED) {
      if (application.status !== constants.APPLICATION_STATUS_EXAMED) {
        throw 'wrongStatus';
      }
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
