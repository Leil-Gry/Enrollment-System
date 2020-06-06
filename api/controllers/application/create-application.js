module.exports = {


  friendlyName: 'Apply',


  description: 'Create or update the application for the current user',


  inputs: {

  },


  exits: {

    success: {
      description: 'success',
      extendedDescription:``
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

    if (application && application.status !== constants.APPLICATION_STATUS_EDITING) {
      throw 'wrongStatus';
    }

    let data = _.extend(this.req.allParams(), {
      user: this.req.me.id,
      batch: this.req.currentBatch.id
    });
    delete data.status;

    if (application) {
      application = await Application.update({
        id: application.id
      })
        .set(data)
        .fetch();
      application = application[0];
    } else {
      application = await Application.create(data);
    }

    return application;

  }

};
