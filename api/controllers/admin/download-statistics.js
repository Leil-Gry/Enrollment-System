module.exports = {


  friendlyName: 'download-statistics',


  description: 'download-statistics.',

  inputs: {},

  exits: {

    success:{
      responseType: 'file'
    },

    notFound: {
      responseType: 'string'
    },

  },

  fn: async function (inputs, exits) {
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
        GROUP BY a.school,sex`
    };

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

    if(!statJSON) { return 'notFound'; }

    let fileName;
    if (this.req.me.isSuperAdmin) {
      fileName = '两项计划报名信息统计表.xlsx';
    } else {
      throw 'forbidden';
    }

    const XLSX = require('xlsx');

    class WorkBook {
      /**
           * @param {Object} data Excel表格源数据，格式如下：
           * {
           *      Sheet1: [
           *          ['姓名', '学号', '籍贯'],
           *          ['lxz', '10131911', 'hunan']
           *      ]
           * }
           */
      constructor(srcData) {
        this.srcData = srcData;
        this.workbook = {};
        this.workbook.SheetNames = [];
        this.workbook.Sheets = {};

        for(let item in srcData) {
          this.workbook.SheetNames.push(item);
          this.addSheet(item, srcData[item]);
        }
      }

      /**
           * 往Excel文件添加一个表格
           * @param {string} sheetName 表格名
           * @param {object} sheet 表格数据
           * @returns void
           */
      addSheet(sheetName, sheet) {
        this.workbook['Sheets'][sheetName] = {};
        let row = sheet.length;
        let col = sheet[0].length;
        let to = '';

        for(let i=0; i<row; i++) {
          for(let j=0; j<col; j++) {
            let key = this.ten2twentysix(j+1) + (i+1);
            this.workbook['Sheets'][sheetName][key] = {'v': sheet[i][j]};
            to = key;
          }
        }
        this.workbook['Sheets'][sheetName]['!ref'] = 'A1:' + to;
      }


      /**
           * 10进制转26进制
           * @param {number} num 正整数
           * @returns string
           */
      ten2twentysix(num) {
        let str = '';
        while(num) {
          let rest = num % 26;
          num = (num-rest) / 26;
          if(!rest){
            rest = 26;
            num--;
          }
          str += String.fromCharCode(rest + 64);
        }

        let twentysixNumber = '';
        let len = str.length;
        for(let i=len-1; i>=0; i--) {
          twentysixNumber += str[i];
        }

        return twentysixNumber;
      }

      /**
           * 将数据写入Excel
           * @param {string} filename 文件路径
           */
      writeFile(filename) {
        XLSX.writeFile(this.workbook, filename);
      }

      writeFileToBuf() {
        return XLSX.write(this.workbook, { type: 'buffer' });
      }
    }

    let srcData = {
      Sheet1: [[
        '学校', '专科', '本科', '硕士', '博士', '党员', '预备党员', '团员', '群众', '男', '女'
      ]]
    };
    Object.keys(statJSON).forEach(key => {
      let tmp = [
        key,
        statJSON[key]['专科'] ? statJSON[key]['专科'] : 0,
        statJSON[key]['本科'] ? statJSON[key]['本科'] : 0,
        statJSON[key]['硕士研究生'] ? statJSON[key]['硕士研究生'] : 0,
        statJSON[key]['博士研究生'] ? statJSON[key]['博士研究生'] : 0,
        statJSON[key]['中共预备党员'] ? statJSON[key]['中共预备党员'] : 0,
        statJSON[key]['中共党员'] ? statJSON[key]['中共党员'] : 0,
        statJSON[key]['共青团员'] ? statJSON[key]['共青团员'] : 0,
        statJSON[key]['群众'] ? statJSON[key]['群众'] : 0,
        statJSON[key]['男'] ? statJSON[key]['男'] : 0,
        statJSON[key]['女'] ? statJSON[key]['女'] : 0
      ];

      srcData.Sheet1.push(tmp);
    });

    const buf = (new WorkBook(srcData)).writeFileToBuf();

    return exits.success({
      fileName,
      buf
    });
  }
};
