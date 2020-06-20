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

    let query = {
      where: {},
      select: ['id', 'status', 'school', 'order', 'name', 'sex', 'nation', 'politicalStatus', 'education', 'domicileProvince', 'intention1', 'intention2']
    };
    _.assign(query.where, this.req.allParams());
    if (this.req.me.isSuperAdmin) {

    } else if (this.req.me.isSchoolAdmin) {
      if (!this.req.me.school) {
        throw 'forbidden';
      }
      query.where.school = this.req.me.school;
    } else {
      throw 'forbidden';
    }

    let results = await Application.find(query)
      .populate('school');

    return results;

  }


};
