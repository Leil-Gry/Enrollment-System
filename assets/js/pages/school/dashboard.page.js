parasails.registerPage('schoolDashboard', {
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
    waitCheck:false,

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
  },
  watch: {
    photo: function(v) {
      if (v) {
        setTimeout(() => {
          this.imageUrl = '/public/avatars/' + this.photo; // TODO: constants
        }, 2000);  // WHY ?
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
        console.log(form);
        this.applyID = form.id;
        this.imageUrl = this.getImageUrl(this.photo);
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

  }
});
