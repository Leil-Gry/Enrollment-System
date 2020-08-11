parasails.registerPage('statistics', {
  data: {
    stats: [
      // {
      //   school: 'zju',
      //   eduVD: 1,
      //   eduBD: 2,
      //   eduMD: 3,
      //   eduPhD: 4,
      //   westernStudentsNum: 5,
      //   communistNum: 6,
      //   leagueMemberNum: 7,
      //   maleNum: 8,
      //   femaleNum: 9,
      //   add: 10,
      //   sum: 11
      // }
    ],
  },

  beforeMount: async function() {
    this.getStats();
  },

  methods: {
    getStats: async function (){
      this.stats = await Cloud.getStats.with({groupBySchool: true});
      console.log(this.stats );
    },

    downloadStats: async function() {
      if(!this.stats.length){
        ShowTip('无可导出记录','danger');
        return;
      }

      let url = `/api/v1/admin/statistics/download`;
      window.location.href = url;
    }
  }
});
