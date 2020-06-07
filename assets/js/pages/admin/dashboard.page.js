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

    photo: '',
    imageUrl:'',
    applyID: '',
    applyName: '',
    applyOrder: null,
    waitCheck:false,
    orderInput:false,
    applyNum:200,
    admitNum:200,

    queryData: {
      school: '',
      nation: '',
      intentType: '',
      politicalStatus: '',
      obeyTheAdjustment: ''
    },

    statistics:[],

    schools:[],
    nations: [],
    intentions: [],
    politics: constants.POLITICS,
    education: constants.EDUCATION,
    intentTypes: constants.INTENTTYPES,
    ifObeyTheAdjustment: constants.IFOBEYTHEADJUSTMENT,
    statusList: constants.APPLICATION_STATUS_INFO,
    statusChecked:constants.APPLICATION_STATUS_CHECKED,
    statusEditing:constants.APPLICATION_STATUS_EDITING,
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
    this.schools   = await Cloud.findSchool.with();
    this.nations   = await Cloud.findNation.with();
    this.intentions = await Cloud.findIntention.with();
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
    getApplyList: async function() {
      this.applyList = await Cloud.findApplication.with();
    },

    getApplyDetail: async function(id) {
      let form = await Cloud.findOneApplication.with(id);
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

    checkApply: async function(status) {
      await Cloud.updateSchoolApplicationStatus.with({id: this.applyID, status:status});
      this.getApplyList();
    },

    getImageUrl: function(fd) {
      return '/public/avatars/' + fd; // TODO: constants
    },

    showInput: async function(data) {
      this.orderInput = true;
      this.applyID = data.id;
      this.applyName = data.name;
    },

    setOrder: async function() {
      this.orderInput = false;
      if(!isNonNegativeInteger(this.applyOrder)){
        ShowTip('请输入一个>=0的数字！','danger');
        return;
      }
      await Cloud.setOrder.with({id:this.applyID,order:parseInt(this.applyOrder)});
      this.getApplyList();
    },

    searchApply: async function() {
      // this.applyList = await Cloud.criteriaFindApplication.with({query: this.queryData});
    },

    getStatistics: async function() {
      this.statistics =  [
        {
          item:'专科',
          applyNum: 20,
          percent:'20%'
        },
        {
          item:'专科',
          applyNum: 20,
          percent:'20%'
        },
        {
          item:'专科',
          applyNum: 20,
          percent:'20%'
        },
        {
          item:'专科',
          applyNum: 20,
          percent:'20%'
        },
        {
          item:'专科',
          applyNum: 20,
          percent:'20%'
        },
        {
          item:'专科',
          applyNum: 20,
          percent:'20%'
        },
      ];
    },

    drag (event) {
      var drag = document.getElementById('shrinkFloating');
      var ev = event || window.event;
      event.stopPropagation();
      var disX = ev.clientX - drag.offsetLeft;
      var disY = ev.clientY - drag.offsetTop;
      document.onmousemove = function(event) {
        var ev = event || window.event;
        drag.style.left = ev.clientX - disX + 'px';
        drag.style.top = ev.clientY - disY + 'px';
        drag.style.cursor = 'move';
      };
    },


    validateNumber: async function() {
      if(!isNonNegativeInteger(this.applyOrder)){
        ShowTip('请输入一个>=0的数字！','danger');
      }
    },

  }
});
