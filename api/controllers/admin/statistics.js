module.exports = {


  friendlyName: 'Statistisc',


  description: 'get apply statistisc.',

  fn: async function () {
    var statistisc = await Application.count({
      'education':'本科'
    }).populate('school');
    return statistisc;
  }

};
