parasails.registerPage('statistics', {
  data: {
    list: [
      {
        school: 'zju',
        eduVD: 1,
        eduBD: 2,
        eduMD: 3,
        eduPhD: 4,
        westernStudentsNum: 5,
        communistNum: 6,
        leagueMemberNum: 7,
        maleNum: 8,
        femaleNum: 9,
        add: 10,
        sum: 11
      },
      {
        school: 'hdu',
        eduVD: 1,
        eduBD: 2,
        eduMD: 3,
        eduPhD: 4,
        westernStudentsNum: 5,
        communistNum: 6,
        leagueMemberNum: 7,
        maleNum: 8,
        femaleNum: 9,
        add: 10,
        sum: 11
      }
    ],
  },

  methods: {
    test: async function (){
      // console.log(await Cloud);
    }
  }
});
