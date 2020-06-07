parasails.registerPage('adminDashboard', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,
    applyList:[],
    applyForm: '',

    photo: '',
    imageUrl:'',
    applyID: '',
    applyName: '',
    applyOrder: null,
    waitCheck:false,
    orderInput:false,

    queryData: {
      school: '',
      nation: '',
      intentType: '',
      politicalStatus: '',
      obeyTheAdjustment: ''
    },

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
      console.log(this.queryData);
      return;
    },


    validateNumber: async function() {
      if(!isNonNegativeInteger(this.applyOrder)){
        ShowTip('请输入一个>=0的数字！','danger');
      }
    },

  }
});
