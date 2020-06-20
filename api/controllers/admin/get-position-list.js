module.exports = {


  friendlyName: 'Get Position List',


  description: 'get position list.',

  exits: {

    notFound: {
      responseType: 'string',
      description: 'The position list is not found'
    }

  },

  fn: async function () {

    let result = await Position.find({
      batch: this.req.currentBatch.id
    });

    if (!result) {
      return 'notFound';
    }

    return result;

  }

};
