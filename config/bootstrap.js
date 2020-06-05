/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // Import dependencies
  var path = require('path');
  var fs = require('fs');

  // Load JSON data
  global.jsonData = global.jsonData || {};
  global.jsonData.schools = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/json/schools.json')).toString().replace(/\t|\n| +/g, ''));
  global.jsonData.nations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/json/nations.json')).toString());
  global.jsonData.province = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/json/province.json')).toString());
  global.jsonData.city = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/json/city.json')).toString());
  global.jsonData.intention = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/json/intention.json')).toString());


  // This bootstrap version indicates what version of fake data we're dealing with here.
  var HARD_CODED_DATA_VERSION = 0;

  // This path indicates where to store/look for the JSON file that tracks the "last run bootstrap info"
  // locally on this development computer (if we happen to be on a development computer).
  var bootstrapLastRunInfoPath = path.resolve(sails.config.appPath, '.tmp/bootstrap-version.json');

  // Whether or not to continue doing the stuff in this file (i.e. wiping and regenerating data)
  // depends on some factors:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // If the hard-coded data version has been incremented, or we're being forced
  // (i.e. `--drop` or `--environment=test` was set), then run the meat of this
  // bootstrap script to wipe all existing data and rebuild hard-coded data.
  if (sails.config.models.migrate !== 'drop' && sails.config.environment !== 'test') {
    // If this is _actually_ a production environment (real or simulated), or we have
    // `migrate: safe` enabled, then prevent accidentally removing all data!
    if (process.env.NODE_ENV==='production' || sails.config.models.migrate === 'safe') {
      sails.log('Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "'+sails.config.environment+'" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...');
      return;
    }//•

    // Compare bootstrap version from code base to the version that was last run
    var lastRunBootstrapInfo = await sails.helpers.fs.readJson(bootstrapLastRunInfoPath)
    .tolerate('doesNotExist');// (it's ok if the file doesn't exist yet-- just keep going.)

    if (lastRunBootstrapInfo && lastRunBootstrapInfo.lastRunVersion === HARD_CODED_DATA_VERSION) {
      sails.log('Skipping v'+HARD_CODED_DATA_VERSION+' bootstrap script...  (because it\'s already been run)');
      sails.log('(last run on this computer: @ '+(new Date(lastRunBootstrapInfo.lastRunAt))+')');
      return;
    }//•

    sails.log('Running v'+HARD_CODED_DATA_VERSION+' bootstrap script...  ('+(lastRunBootstrapInfo ? 'before this, the last time the bootstrap ran on this computer was for v'+lastRunBootstrapInfo.lastRunVersion+' @ '+(new Date(lastRunBootstrapInfo.lastRunAt)) : 'looks like this is the first time the bootstrap has run on this computer')+')');
  }
  else {
    sails.log('Running bootstrap script because it was forced...  (either `--drop` or `--environment=test` was used)');
  }

  // Since the hard-coded data version has been incremented, and we're running in
  // a "throwaway data" environment, delete all records from all models.
  for (let identity in sails.models) {
    await sails.models[identity].destroy({});
  }//∞

  // By convention, this is a good place to set up fake data during development.
  await Batch.createEach([{
    name: '2020'
  }]);
  // await School.createEach([{
  //   name: '杭州电子科技大学'
  // }]);
  await User.createEach([
    { emailAddress: 'admin@example.com', fullName: 'Web admin', isSuperAdmin: true, password: await sails.helpers.passwords.hashPassword('abc123') },
    // { emailAddress: 'admin@hdu.com', fullName: 'Hdu admin', isSchoolAdmin: true, school: 1, password: await sails.helpers.passwords.hashPassword('abc123') },
    { emailAddress: '1@a.com', fullName: '张三', password: await sails.helpers.passwords.hashPassword('abc123') },
    { emailAddress: '2@a.com', fullName: '李四', password: await sails.helpers.passwords.hashPassword('abc123') },
  ]);
  for (let school of global.jsonData.schools) {
    let created = await School.createEach([{
      name: school.name
    }]).fetch();
    await User.create({
      emailAddress: school.name + '@zjstudent.com',
      password: await sails.helpers.passwords.hashPassword('zj123456'),
      isSchoolAdmin: true,
      school: created.id,
      fullName: school.name + '管理员'
    });
  }
  await Application.createEach([{
    // status: constants.APPLICATION_STATUS_SUBMITTED,
    user: 2,
    batch: 1,
    school: 1,
    name: '张三',
    sex: '男',
    nation: '汉族',
    birthDate: '1997.9',
    politicalStatus: '共青团员',
    IDNumber: '330400199001010000',
    education: '本科',
    major: '计算机科学与技术',
    specialty: '长跑、篮球、绘画',
    healthStatus: '健康',
    domicileProvince: '浙江省',
    domicileCity: '杭州市',
    domicileAddr: '江干区',
    pastMedicalHistory: '无',
    phone: '13900001111',
    email: '120987666@qq.com',
    homeAddressAndPhone: '杭州市杭州经济开发区白杨街道2号大街1158号',
    intentType: '水利',
    intention1: '温州市',
    intention2: '洞头县',
    obeyTheAdjustment: true,
    workedInTheCYL: false,
    resume: '我是来自05班的xxx。性格活泼开朗，处事沉着、果断，能够顾全大局。今日我很荣幸地站在那里表达自我由来已久的愿望：“我要竞选学生会主席。”我在那里郑重承诺：“我将尽全力完成学校领导和同学们交给我的任务，使学生会成为一个现代化的进取团体，成为学校的得力助手和同学们信赖的组织。',
    volunteeringExperience: `1、2009年9月——2010年1月\n获得院一等奖学金、社会活动进取分子等荣誉，顺利高分经过英语四级考试和计算机一级B考试。担任系学生会学习部干事，配合开展过第四届英语本事竞赛和“立德杯”辩论赛，取得了优异的成绩。\n2、2010年2月——2011年7月获得院一等奖学金、“我爱记单词团体一等奖、“衿信杯”征文比赛优秀奖、英文读后感二等奖、社会活动进取分子等荣誉，高分经过英语六级考试。担任系学生会学习部干事，参加过入党进取分子培训，理解了党的教育，学习方面和思想方面均取得了优异的成绩。`,
    rewardsAndPunishment: '无'
  }]);

  // Save new bootstrap version
  await sails.helpers.fs.writeJson.with({
    destination: bootstrapLastRunInfoPath,
    json: {
      lastRunVersion: HARD_CODED_DATA_VERSION,
      lastRunAt: Date.now()
    },
    force: true
  })
  .tolerate((err)=>{
    sails.log.warn('For some reason, could not write bootstrap version .json file.  This could be a result of a problem with your configured paths, or, if you are in production, a limitation of your hosting provider related to `pwd`.  As a workaround, try updating app.js to explicitly pass in `appPath: __dirname` instead of relying on `chdir`.  Current sails.config.appPath: `'+sails.config.appPath+'`.  Full error details: '+err.stack+'\n\n(Proceeding anyway this time...)');
  });

};
