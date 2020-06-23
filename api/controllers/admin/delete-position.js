module.exports = {


  friendlyName: 'delete Position',


  description: 'delete Position.',

  //这个用来传值
  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok',
    },

    deleteErr: {
      responseType: 'notFound',
    }
  },

  fn: async function (inputs) {

    await Application.updateOne({ position: inputs.id })
      .set({
        position: null
      });

    let deletePosition = await Position.destroyOne({ id: inputs.id });
    if (!deletePosition) {
      throw 'deleteErr';
    }

    return 'success';
  }
};
