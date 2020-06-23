module.exports = {


  friendlyName: 'Get Position List',


  description: 'get position list.',

  inputs: {
    isUnassigned: {
      type: 'boolean',
      required: true
    }
  },

  exits: {

    notFound: {
      responseType: 'string',
      description: 'The position list is not found'
    }

  },

  fn: async function (inputs) {

    let result = await Position.find({
      batch: this.req.currentBatch.id,
    });

    if (!result) {
      return 'notFound';
    }

    let list;
    if(inputs.isUnassigned){
      list = [];
      result.forEach(item => {
        if(!item.application){
          list.push(item);
        }
      });
    } else {
      list = result;
    }


    return list;

  }

};
