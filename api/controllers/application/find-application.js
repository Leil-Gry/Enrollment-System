module.exports = {


  friendlyName: 'Find application',


  description: '',


  inputs: {

  },


  exits: {

    forbidden: {
      responseType: 'forbidden'
    }

  },


  fn: async function (inputs) {

    let query = {};
    if (this.req.me.isSuperAdmin) {

    } else if (this.req.me.isSchoolAdmin) {
      if (!this.req.me.school) {
        throw 'forbidden';
      }
      query = { school: this.req.me.school };
    } else {
      throw 'forbidden';
    }

    let results = await Application.find(query)
      .populate('school');

    return results;

  }


};
