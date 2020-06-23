parasails.registerPage('adminDashboard', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,
    enlarge:false,
    applyList:[],
    applyForm: '',
    selectedPost:'',
    posts:[],

    photo: '',
    imageUrl:'',
    applyID: '',
    applyName: '',
    waitCheck:false,

    queryData: {
      school: '',
      nation: '',
      post: '',
      intentType: '',
      politicalStatus: '',
      obeyTheAdjustment: ''
    },

    stats: {},

    isRecommended:false,
    isExamed:false,
    schools:[],
    nations: [],
    intentions: [],
    politics: constants.POLITICS,
    education: constants.EDUCATION,
    intentTypes: constants.INTENTTYPES,
    ifObeyTheAdjustment: constants.IFOBEYTHEADJUSTMENT,
    statusList: constants.APPLICATION_STATUS_INFO,
    // Server error state for the form
    cloudError: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    //…
    this.getApplyList();
    this.schools    = await Cloud.findSchool.with();
    this.nations    = await Cloud.findNation.with();
    this.intentions = await Cloud.findIntention.with();
    this.getStatistics();
    this.getPosts();
  },
  watch: {
    photo: function(v) {
      if (v) {
        // setTimeout(() => {
        this.imageUrl = '/public/avatars/' + this.photo; // TODO: constants
        // }, 2000);  // WHY ?
        // Vue.nextTick(() => {
        //   this.imageUrl = '/public/avatars/' + this.photo;
        // });

      }
    },
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    getApplyList: async function(data) {
      this.applyList = await Cloud.findApplication.with(data);
    },

    getPosts: async function() {
      // this.posts = await Cloud.findPosts.with();
      this.posts = [
        {
          name:'岗位1'
        },
        {
          name:'岗位2'
        },
        {
          name:'岗位3'
        }
      ];
    },

    distribute: async function(id) {
      // this.posts = await Cloud.findPosts.with();
      console.log($('#selectedPost').val());
      // await Cloud.distribute.with({id:id,post:('#selectedPost').val()});
    },

    getApplyDetail: async function(id) {
      let form = await Cloud.findOneApplication.with(id);
      this.isRecommended = form.status === constants.APPLICATION_STATUS_RECOMMENDED?true:false;
      this.isExamed = form.status === constants.APPLICATION_STATUS_EXAMED?true:false;
      if(form) {
        this.applyForm = form;
        this.applyForm.school = form.school.name;
        this.applyForm.obeyTheAdjustment = constants.ADJUSTMENT[form.obeyTheAdjustment];
        this.applyForm.workedInTheCYL = constants.WORKEDINTHECYL[form.workedInTheCYL];
        this.photo = form.photo;
        this.applyID = form.id;
        this.waitCheck = form.status===constants.APPLICATION_STATUS_SUBMITTED?true:false;
      }
    },

    changeStatus: async function(status) {
      await Cloud.updateApplicationStatus.with({id: this.applyID, status:status});
      this.getApplyList();
    },

    getImageUrl: function(fd) {
      return '/public/avatars/' + fd; // TODO: constants
    },

    searchApply: async function() {
      console.log(this.queryData);
      let query = {};
      Object.keys(this.queryData).forEach(key =>{
        if(this.queryData[key] !== ''){
          query[key]=this.queryData[key];
        }
      });
      this.getApplyList(query);
    },

    searchReset: async function () {
      this.queryData = {
        school: '',
        nation: '',
        intentType: '',
        politicalStatus: '',
        obeyTheAdjustment: ''
      };
      this.getApplyList();
    },

    getStatistics: async function() {
      this.stats = await Cloud.getStats.with({groupBySchool: false});
    },

    examedPass: async function() {
      this.changeStatus(constants.APPLICATION_STATUS_EXAMED);
    },

    admit: async function() {
      this.changeStatus(constants.APPLICATION_STATUS_ADMITTED);
    },

    drag (id,event) {
      var drag = document.getElementById(id);
      var ev = event || window.event;
      var disX = ev.clientX - drag.offsetLeft;
      var disY = ev.clientY - drag.offsetTop;
      document.onmousemove = function(event) {
        var ev = event || window.event;
        drag.style.left = ev.clientX - disX + 'px';
        drag.style.top = ev.clientY - disY + 'px';
        drag.style.cursor = 'move';
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        drag.style.cursor = 'default';
      };
    },


  }
});
