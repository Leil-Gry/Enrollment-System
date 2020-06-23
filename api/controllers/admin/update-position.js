module.exports = {


  friendlyName: 'update Position',


  description: 'update Position.',

  inputs: {
    newName: {
      type: 'string',
      required: true
    },
    id:{
      type:'number',
      required: true
    }

  },

  exits: {
    success: {
      responseType: 'ok'
    },

    updateErr: {
      responseType: 'string'
    }
  },

  fn: async function (inputs) {
    var update = await Position.updateOne({ id: inputs.id })
      .set({
        name: inputs.newName
      });

    if (!update) {
      throw 'updateErr';
    }

    return 'success';
  }
};
