module.exports = {


  friendlyName: 'distribute position',


  description: 'distribute position.',

  inputs: {
    applId: {
      type: 'number',
      required: true
    },

    newPostName: {
      type: 'string'
    },
  },

  exits: {
    success: {
      responseType: 'ok',
    },

    notAdmitted: {
      responseType: 'string',
    },

    notFound: {
      responseType: 'notFound',
    },

    updateErr: {
      responseType: 'notFound',
    }
  },

  fn: async function (inputs) {

    let appl = await Application.findOne({ id: inputs.applId });
    if (!appl) { throw 'notFound'; }

    if ( appl.status !== constants.APPLICATION_STATUS_ADMITTED) {
      return 'notAdmitted';
    }

    let fd;
    let post;
    if (!inputs.newPostName) {
      fd = await Application.updateOne({ id: inputs.applId })
        .set({ position: null });
      if (!fd) { throw 'updateErr'; }
    } else {
      post = await Position.findOne({ name: inputs.newPostName, batch: this.req.currentBatch.id });
      if (!post) { throw 'notFound'; }
    }

    if (appl.position) {
      fd = await Position.updateOne({ id: appl.position })
        .set({ application: null });
      if (!fd) { throw 'updateErr'; }
    }

    if (!inputs.newPostName) { return 'success'; }

    fd = await Application.updateOne({ id: inputs.applId })
      .set({ position: post.id });
    if (!fd) { throw 'updateErr'; }

    fd = await Position.updateOne({ id: post.id })
      .set({ application: inputs.applId });
    if (!fd) { throw 'updateErr'; }

    return 'success';
  }
};
