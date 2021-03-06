module.exports = {


  friendlyName: 'Get statistisc',


  description: 'get apply statistisc.',

  inputs: {

    groupBySchool: {
      type: 'boolean',
      required: true
    }

  },

  fn: async function (inputs) {
    let SQL = {
      groupBySchoolAndEducation: `
        SELECT any_value(s.name) as school, a.education as education, COUNT(education) as num
        FROM application as a,school as s
        WHERE a.school=s.id and a.status>=${constants.APPLICATION_STATUS_CHECKED}
        GROUP BY a.school,education`,
      groupBySchoolAndPoliticalStatus: `
        SELECT any_value(s.name) as school, a.politicalStatus as politicalStatus, COUNT(politicalStatus) as num
        FROM application as a,school as s
        WHERE a.school=s.id and a.status>=${constants.APPLICATION_STATUS_CHECKED}
        GROUP BY a.school,politicalStatus`,
      groupBySchoolAndSex: `
        SELECT any_value(s.name) as school, a.sex as sex, COUNT(sex) as num
        FROM application as a,school as s
        WHERE a.school=s.id and a.status>=${constants.APPLICATION_STATUS_CHECKED}
        GROUP BY a.school,sex`,
      groupByEducation: `
        SELECT any_value(a.status) as status, a.education as education, COUNT(education) as num
        FROM application as a
        WHERE a.status>=${constants.APPLICATION_STATUS_CHECKED}
        GROUP BY education`,
      groupByPoliticalStatus: `
        SELECT any_value(a.status) as status, a.politicalStatus as politicalStatus, COUNT(politicalStatus) as num
        FROM application as a
        WHERE a.status>=${constants.APPLICATION_STATUS_CHECKED}
        GROUP BY politicalStatus`,
      groupBySex: `
        SELECT any_value(a.status) as status, a.sex as sex, COUNT(sex) as num
        FROM application as a
        WHERE a.status>=${constants.APPLICATION_STATUS_CHECKED}
        GROUP BY sex`,
      applyNum: `
        SELECT COUNT(*) as num
        FROM application as a
        WHERE a.status>=${constants.APPLICATION_STATUS_SUBMITTED}`,
      checkedNum: `
        SELECT COUNT(*) as num
        FROM application as a
        WHERE a.status>=${constants.APPLICATION_STATUS_CHECKED}`,
      // admissionNum: `
      //   SELECT COUNT(*) as num
      //   FROM application as a
      //   WHERE a.status=12`
    };

    if(inputs.groupBySchool){
      let rawResult1 = await sails.sendNativeQuery(SQL['groupBySchoolAndEducation']);
      let rawResult2 = await sails.sendNativeQuery(SQL['groupBySchoolAndPoliticalStatus']);
      let rawResult3 = await sails.sendNativeQuery(SQL['groupBySchoolAndSex']);

      let statJSON = {};

      rawResult1.rows.forEach(row => {
        statJSON[row.school] = {};
        statJSON[row.school][row.education] = row.num;
      });
      rawResult2.rows.forEach(row => {
        statJSON[row.school][row.politicalStatus] = row.num;
      });
      rawResult3.rows.forEach(row => {
        statJSON[row.school][row.sex] = row.num;
      });

      let stats = [];
      Object.keys(statJSON).forEach(key => {
        let tmp = {
          school: key,
          eduVD: statJSON[key]['专科'] ? statJSON[key]['专科'] : 0,
          eduBD: statJSON[key]['本科'] ? statJSON[key]['本科'] : 0,
          eduMD: statJSON[key]['硕士研究生'] ? statJSON[key]['硕士研究生'] : 0,
          eduPhD: statJSON[key]['博士研究生'] ? statJSON[key]['博士研究生'] : 0,
          communistPM: statJSON[key]['中共预备党员'] ? statJSON[key]['中共预备党员'] : 0,
          communist: statJSON[key]['中共党员'] ? statJSON[key]['中共党员'] : 0,
          leagueMember: statJSON[key]['共青团员'] ? statJSON[key]['共青团员'] : 0,
          theMasses: statJSON[key]['群众'] ? statJSON[key]['群众'] : 0,
          male: statJSON[key]['男'] ? statJSON[key]['男'] : 0,
          female: statJSON[key]['女'] ? statJSON[key]['女'] : 0,
        };

        stats.push(tmp);
      });

      return stats;
    } else {
      let rawResult1 = await sails.sendNativeQuery(SQL['groupByEducation']);
      let rawResult2 = await sails.sendNativeQuery(SQL['groupByPoliticalStatus']);
      let rawResult3 = await sails.sendNativeQuery(SQL['groupBySex']);
      let rawResult4 = await sails.sendNativeQuery(SQL['applyNum']);
      let rawResult5 = await sails.sendNativeQuery(SQL['checkedNum']);
      // let rawResult5 = await sails.sendNativeQuery(SQL['admissionNum']);

      let applyNum = rawResult4.rows[0].num;
      let checkedNum = rawResult5.rows[0].num;
      // let admissionNum = rawResult5.rows[0].num;
      let itemStats = [];
      let item = {};

      rawResult1.rows.forEach(row => {
        item = {
          item: row.education,
          checkedNum: row.num,
          percent: (row.num / checkedNum * 100).toFixed(1) + '%'
        };
        itemStats.push(item);
      });
      rawResult2.rows.forEach(row => {
        item = {
          item: row.politicalStatus,
          checkedNum: row.num,
          percent: (row.num / checkedNum * 100).toFixed(1) + '%'
        };
        itemStats.push(item);
      });
      rawResult3.rows.forEach(row => {
        item = {
          item: row.sex,
          checkedNum: row.num,
          percent: (row.num / checkedNum * 100).toFixed(1) + '%'
        };
        itemStats.push(item);
      });

      return {
        itemStats,
        applyNum,
        checkedNum
        // admissionNum
      };
    }
  }

};
