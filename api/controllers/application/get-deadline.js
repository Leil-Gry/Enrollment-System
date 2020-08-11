module.exports = {


  friendlyName: 'Get deadline',


  description: 'Get application deadline.',


  exits: {

    notFound: {
      responseType: 'notFound'
    }

  },


  fn: async function () {

    if (!this.req.currentBatch.applyUntil) {
      throw 'notFound';
    }

    function add0(m){return m<10?'0'+m:m; }
    function format (timestamp) {
      let datetime = new Date(timestamp);
      let y = datetime.getFullYear();
      let m = datetime.getMonth()+1;
      let d = datetime.getDate();
      let h = datetime.getHours();
      let mm = datetime.getMinutes();
      let s = datetime.getSeconds();
      return y + '年' + add0(m) +'月'+ add0(d) + '日' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }
    let applyUntil = format(this.req.currentBatch.applyUntil);
    let checkUntil = format(this.req.currentBatch.checkUntil);

    return {
      applyUntil,
      checkUntil
    };

  }


};
