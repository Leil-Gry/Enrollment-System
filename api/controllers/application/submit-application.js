module.exports = {


  friendlyName: 'Submit the application of the current user',


  inputs: {

  },


  exits: {

    success: {
      description: 'success',
      extendedDescription:``
    },

    notFound: {
      responseType: 'notFound'
    },

    wrongStatus: {
      responseType: 'forbidden'
    }

  },


  fn: async function (inputs) {

    let application = await Application.findOne({
      user: this.req.me.id,
      batch: this.req.currentBatch.id
    });

    if (!application) {
      throw 'notFound';
    }

    if (application.status !== constants.APPLICATION_STATUS_EDITING) {
      throw 'wrongStatus';
    }


    application = await Application.update({
      id: application.id
    })
      .set({
        status: constants.APPLICATION_STATUS_SUBMITTED
      });

    return;

  }

};
