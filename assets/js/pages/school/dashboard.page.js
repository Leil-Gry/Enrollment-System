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
    applyName: '',
    applyOrder: null,
    waitCheck:false,
    orderInput:false,

    statusList: constants.APPLICATION_STATUS_INFO,
    statusChecked:constants.APPLICATION_STATUS_CHECKED,
    statusUnChecked:constants.APPLICATION_STATUS_UNCHECKED,
    statusEditing:constants.APPLICATION_STATUS_EDITING,
    // Server error state for the form
    cloudError: '',
    deadline: ''
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
    this.getDeadline();
    this.getApplyList();
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
    downloadAppl: async function() {
      if(!this.applyList.length){
        ShowTip('无可导出记录','danger');
        return;
      }

      let url = `/api/v1/admin/application/download`;
      window.location.href = url;
    },
    getApplyList: async function() {
      // const data = { status: 2 }; // only show submitted
      this.applyList = await Cloud.findApplication.with();  // with(data)
      // For frontend development
      // this.applyList = [
      //   {
      //     id: 1,
      //     status: 2,
      //     order: 0,
      //     name: "张三",
      //     sex: "女",
      //     nation: "汉族",
      //     politicalStatus: "共青团员",
      //     domicileProvince: "浙江省",
      //     education: "本科",
      //     intention1: "衢州市",
      //     intention2: "磐安县",
      //     school: {id: 7, name: "杭州电子科技大学"},
      //   },
      //   {
      //     id: 2,
      //     status: 2,
      //     order: 0,
      //     name: "李四",
      //     sex: "女",
      //     nation: "汉族",
      //     politicalStatus: "共青团员",
      //     domicileProvince: "浙江省",
      //     education: "本科",
      //     intention1: "温州市",
      //     intention2: "磐安县",
      //     school: {id: 7, name: "杭州电子科技大学"},
      //   }
      // ];
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
        this.waitCheck = form.status === constants.APPLICATION_STATUS_SUBMITTED ? true : false;
      }
    },

    checkApply: async function(status) {
      try{
        await Cloud.updateSchoolApplicationStatus.with({id: this.applyID, status:status});
      } catch(e) {
        ShowTip('已过审核截止时间！','danger');
      }
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

    getDeadline: async function () {
      let fb = await Cloud.getDeadline.with();
      this.deadline = fb.checkUntil;
      // .replace(/:\d{1,2}$/,' ')
    }

  }
});
