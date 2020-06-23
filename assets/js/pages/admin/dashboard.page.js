parasails.registerPage('adminDashboard', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,
    enlarge: false,
    applyList:[],
    applyForm: '',
    selectedPost:'',
    positionList:[],

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
    this.getPositions();
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

    getPositions: async function() {
      // this.posts = await Cloud.findPosts.with();
      this.positionList = await Cloud.getPositionList.with({isUnassigned:true});
    },

    downloadAppl: async function() {
      if(!this.applyList.length){
        ShowTip('无可导出记录','danger');
        return;
      }
      let query = '';
      let hasQuery = false;
      Object.keys(this.queryData).forEach(key =>{
        if(this.queryData[key] !== ''){
          if(!hasQuery){
            hasQuery = true;
            query += '?' + key + '=' + this.queryData[key];
            return;
          }
          query += '&' + key + '=' + this.queryData[key];

        }
      });
      // console.log(await Cloud.downloadApplication.with({  }));
      let url = `/api/v1/admin/application/download` + (hasQuery ? query : '');
      window.location.href = url;
    },

    distribute: async function(id) {
      let choosedPosition = $('#selectedPost').val();
      if (!choosedPosition) {
        await Cloud.deletePosition.with({id:id});
      } else {
        await Cloud.updatePosition.with({position:$('#selectedPost').val()});
      }
      // await Cloud.distribute.with({id:id,post:('#selectedPost').val()});
    },

    getApplyDetail: async function(id) {
      let form = await Cloud.findOneApplication.with(id);
      this.isRecommended = (form.status === constants.APPLICATION_STATUS_RECOMMENDED);
      this.isExamed = (form.status === constants.APPLICATION_STATUS_EXAMED);
      if(form) {
        this.applyForm = form;
        this.applyForm.school = form.school.name;
        this.applyForm.obeyTheAdjustment = constants.ADJUSTMENT[form.obeyTheAdjustment];
        this.applyForm.workedInTheCYL = constants.WORKEDINTHECYL[form.workedInTheCYL];
        this.photo = form.photo;
        this.applyID = form.id;
        this.waitCheck = (form.status === constants.APPLICATION_STATUS_SUBMITTED);
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
