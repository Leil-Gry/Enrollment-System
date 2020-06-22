module.exports = {


  friendlyName: 'download-application',


  description: 'download-application.',

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

    let query = {
      where: {},
      // select: ['id', 'status', 'school', 'order', 'name', 'sex', 'nation', 'politicalStatus', 'education', 'domicileProvince', 'intention1', 'intention2']
    };
    _.assign(query.where, this.req.allParams());
    query['where']['status'] = { '>': 1 };

    let fileName;
    if (this.req.me.isSuperAdmin) {
      fileName = '两项计划报名信息.xlsx';
    } else if (this.req.me.isSchoolAdmin) {
      if (!this.req.me.school) {
        throw 'forbidden';
      }
      query.where.school = this.req.me.school;
      let school = await School.findOne({ id: this.req.me.school });
      fileName = school.name + '-两项计划报名信息.xlsx';
    } else {
      throw 'forbidden';
    }

    let results = await Application.find(query)
      .populate('school');

    if(!results) { return 'notFound'; }

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
    }

    let srcData = {
      Sheet1: [[
        '姓名', '性别', '民族', '出生年月', '政治面貌', '身份证号', '学历',
        '院（系）专业', '兴趣特长', '健康状况', '既往病史', '户籍省', '户籍市',
        '户籍区', '联系电话', '电子邮箱', '家庭通讯地址及电话', '服务意向',
        '服务意向地区1', '服务意向地区2', '是否服从调剂', '是否从事过共青团工作',
        '个人简历', '志愿服务经历', '大学期间的奖励和处分', '提交时间', '学校'
      ]]
    };

    results.forEach(item => {
      item.obeyTheAdjustment = item.obeyTheAdjustment ? '服从调剂' : '不服从调剂';
      item.workedInTheCYL = item.workedInTheCYL ? '从事过共青团工作' : '没从事过共青团工作';
      let reg = new RegExp('\n','g');
      item.resume = item.resume.replace(reg, ' ');
      item.volunteeringExperience = item.volunteeringExperience.replace(reg, ' ');
      item.rewardsAndPunishment = item.rewardsAndPunishment.replace(reg, ' ');
      item.submitAt = new Date(item.submitAt).toLocaleString();
      srcData.Sheet1.push([
        item.name, item.sex, item.nation, item.birthDate, item.politicalStatus,
        item.IDNumber, item.education, item.major, item.specialty, item.healthStatus,
        item.pastMedicalHistory, item.domicileProvince, item.domicileCity, item.domicileAddr,
        item.phone, item.email, item.homeAddressAndPhone, item.intentType, item.intention1,
        item.intention2, item.obeyTheAdjustment, item.workedInTheCYL, item.resume,
        item.volunteeringExperience, item.rewardsAndPunishment, item.submitAt, item.school.name
      ]);
    });

    let workbook = new WorkBook(srcData);

    const buf = XLSX.write(workbook.workbook, { type: 'buffer' });

    return exits.success({
      fileName,
      buf
    });


  }

};
