parasails.registerPage('schoolDashboard', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,
    applyList:[],
    applyForm: '',

<<<<<<< HEAD
    photo: '',
    imageUrl:'',
    applyID: '',
    waitCheck:false,

    statusList: constants.APPLICATION_STATUS_INFO,
    statusChecked:constants.APPLICATION_STATUS_CHECKED,
    statusEditing:constants.APPLICATION_STATUS_EDITING,
=======
    statusList: constants.APPLICATION_STATUS_INFO,
>>>>>>> 24102df86342eb3c36c9a509697fae13fbca1d47
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
<<<<<<< HEAD
      this.applyList = await Cloud.findApplication.with();
      // console.log(this.applyList)
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
        this.imageUrl = this.getImageUrl(this.photo);
        this.waitCheck = form.status===constants.APPLICATION_STATUS_SUBMITTED?true:false;
      }
    },

    checkApply: async function(status) {
      await Cloud.updateApplicationStatus.with({id: this.applyID, status:status});
      this.getApplyList();
      // console.log(this.applyList)
    },

    getImageUrl: function(fd) {
      return '/public/avatars/' + fd; // TODO: constants
=======
      this.applyList = [
        {
          id:1,
          name:'gry',
          applyTime:'2020',
          status:2
        },
        {
          id:2,
          name:'gry',
          applyTime:'2020',
          status:3
        },
        {
          id:1,
          name:'gry',
          applyTime:'2020',
          status:4
        },
        {
          id:1,
          name:'gry',
          applyTime:'2020',
          status:11
        },
      ];
    },

    applyDetail: async function(applyID) {
      this.applyForm = {
        name:'gry',
        sex:'male',
        nation:'汉族',
        birthDate:'1997.9',
        politicalStatus:'团员',
        IDNumber:'11',
        education:'11',
        major:'11',
        specialty:'11',
        healthStatus:'11',
        domicileProvince:'11',
        pastMedicalHistory:'11',
        domicileCity:'11',
        domicileAddr:'11',
        phone:'11',
        email:'11',
        homeAddressAndPhone:'11',
        intention1:'330300',
        intention2:'330322',
        obeyTheAdjustment:true,
        workedInTheCYL:true,
        resume:'11',
        volunteeringExperience:'11',
        rewardsAndPunishment:'11',
        school:'11'
      };
>>>>>>> 24102df86342eb3c36c9a509697fae13fbca1d47
    },

  }
});
