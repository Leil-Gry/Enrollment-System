parasails.registerPage('schoolDashboard', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,
    applyList:[],
    applyForm: '',

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
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    getApplyList: async function() {
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
    },

  }
});
