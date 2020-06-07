parasails.registerPage('userApply', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,


    // Server error state for the form
    cloudError: '',

    photoFile: '',
    showImg: false,  // must use v-if, otherwise getting photo file returns 404
    imageUrl: '',
    // canUpload: false,

    formData:{
      name:'',
      sex:'男',
      nation:'',
      birthDate:'',
      politicalStatus:'',
      IDNumber:'',
      education:'',
      major:'',
      specialty:'',
      healthStatus:'',
      domicileProvince:'',
      pastMedicalHistory:'',
      domicileCity:'',
      domicileAddr:'',
      phone:'',
      email:'',
      homeAddressAndPhone:'',
      intentType:'',
      intention1:'',
      intention2:'',
      obeyTheAdjustment:true,
      workedInTheCYL:true,
      resume:'',
      volunteeringExperience:'',
      rewardsAndPunishment:'',
      school:''
    },

    applyID: null,
    formTitle:'',
    showDownload: false,
    school: '',
    schools: [],
    intention: [],
    nations: [],
    province:[],
    cityRegions:'',
    cities:[],
    regions: [],
    city: [],

    status:Number,
    allApplyStatus: constants.APPLICATION_STATUS,
    statusInfo:constants.APPLICATION_STATUS_INFO,

    intentTypes: constants.INTENTTYPES,
    ifWorkedInTheCYL: constants.IFWORKEDINTHECYL,
    ifObeyTheAdjustment: constants.IFOBEYTHEADJUSTMENT,
    politics: constants.POLITICS,
    education: constants.EDUCATION,

    showConfirmModel:false,
    showSubmitBtn:false,
    disabledForm: false,
    saveSuccess: false,
    submitSuccess:false,

    formErrors: { /* … */ },

    // A set of validation rules for our form.
    // > The form will not be submitted if these are invalid.
    formRules: {
      school: { required: true },
      name: { required: true },
      sex: { required: true },
      nation: { required: true },
      birthDate: { required: true,maxLength:10 },
      politicalStatus: { required: true },
      IDNumber: { required: true },
      education: { required: true },
      major: { required: true },
      specialty: { required: true,maxLength:40 },
      healthStatus: { required: true,maxLength:40 },
      pastMedicalHistory: { required: true,maxLength:40 },
      domicileProvince: { required: true },
      domicileCity: { required: true },
      domicileAddr: { required: true },
      phone: { required: true,maxLength:20 },
      email: { required: true,isEmail:true },
      intentType: { required: true },
      intention1: { required: true },
      intention2: { required: true,differentWith: 'intention1'},
      homeAddressAndPhone: { required: true }
    }
  },

  watch: {
    // photo: function(v) {
    //   if (v) {
    //     this.showImg = true;
    //     setTimeout(() => {
    //       this.imageUrl = this.getImageUrl(this.photo);
    //     }, 1000);  // WHY ?
    //     // Vue.nextTick(() => {
    //     //   this.imageUrl = '/public/avatars/' + this.photo;
    //     // });

    //   }
    // }
    photoFile: function(v) {
      if (v) {
        this.showImg = true;
        this.imageUrl = v;
      }
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    this.schools   = await Cloud.findSchool.with();
    this.nations   = await Cloud.findNation.with();
    this.province  = await Cloud.findProvince.with(); //TODO:province.json完善
    this.cities    = await Cloud.findCity.with();
    this.intention = await Cloud.findIntention.with();
    this.getApplyForm();
  },
  mounted: async function() {
    let dateMonthConfig = {
      format: 'yyyy-mm',//显示格式
      todayHighlight: 1,//今天高亮
      minView: 3,//设置只显示到月份
      autoclose: 1,//选择后自动关闭
    };
    $('.birthDate').datetimepicker(dateMonthConfig);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    getImageUrl: function(fd) {
      return '/public/avatars/' + fd; // TODO: constants
    },

    updateApply: async function(showTip=true) {
      if (!this.formData.pastMedicalHistory) {this.formData.pastMedicalHistory = '无';}
      if (!this.formData.resume) {this.formData.resume = '无';}
      if (!this.formData.volunteeringExperience) {this.formData.volunteeringExperience = '无';}
      if (!this.formData.rewardsAndPunishment) {this.formData.rewardsAndPunishment = '无';}

      this.saveForm();

      var valid = await this.$refs.form.validate();
      if (!valid) {return;}

      let formData = await Cloud.createApplication.with(this.formData);
      this.applyID = formData.id;

      if(this.photoFile) {
        const resizedimage = this.$refs.uploader.getImage();

        try {
          await Cloud.uploadPhoto.with({id: this.applyID, photo: resizedimage});
        } catch (e) {
          console.log(e);// TODO: show toast
        }
      }

      // NOTE: upload photo will update it to application record on the server
      // this.formData = await Cloud.createApplication.with(this.formData);
      // this.saveForm();
      // this.photo = this.formData.photo;
      if (showTip) {
        ShowTip('保存成功！','success');
        this.showSubmitBtn = true;
      }
      this.cloudSuccess = true;
    },

    getApplyForm: async function() {
      let form;
      try{
        form = await Cloud.getApply.with();
      }catch(e){}

      if(form) {
        this.applyID = form.id;
        this.formData = form;
        this.showSubmitBtn = false;
        if (form.photo) {
          this.imageUrl = this.getImageUrl(form.photo);
          this.showImg = true;
        }
        this.getCityRegion(form.domicileProvince,form.domicileCity,form.domicileAddr);
        this.disabledForm = form.status > 1;
        if(!this.disabledForm) {
          // this.canUpload = true;
          this.showSubmitBtn = true;
        }
        this.status = form.status;
      } else {
        // this.canUpload = false;
        let localForm = JSON.parse(localStorage.getItem('applyForm'));
        if(localForm){
          this.formData = localForm;
          this.getCityRegion(localForm.domicileProvince,localForm.domicileCity,localForm.domicileAddr);
        }
        this.status = constants.APPLICATION_STATUS_EDITING;
      }

      this.statusControl();

      if (this.status === 1) {
        window.onbeforeunload = function(e){
          e = window.event||e;
          e.returnValue=('确定离开当前页面吗？');
        };
      } else {
        window.onbeforeunload = '';
      }
    },

    getCityRegion: async function(province,city,region) {
      if(province) {
        this.getCities();
        this.formData.domicileCity = city;
        this.getRegions();
        this.formData.domicileAddr = region;
      }
    },

    // 保存报表到本地
    saveForm: async function() {
      localStorage.setItem('applyForm',JSON.stringify(this.formData));
      $('select').blur();
    },

    // 用户点击后，进行输入校验。校验成功跳出提示弹窗。
    submitCheck: async function() {
      this.saveForm();
      if(!this.imageUrl) {
        ShowTip('请先上传照片！','danger');
        return;
      }
      this.showConfirmModel = await this.$refs.form.validate();
    },

    // 用户确认提交，数据发送到服务端
    submitApply: async function() {
      this.updateApply(false);
      await Cloud.submitApplication.with(this.formData);
      ShowTip('提交成功！','success');
      this.getApplyForm();
      this.showConfirmModel = false;
    },

    download: async function() {
      // await Cloud.download.with({ id: this.formData.id });
      let url = `/api/v1/application/${this.formData.id}/download`;
      window.location.href = url;
    },


    getCities: async function() {
      this.city = [];
      this.regions = [];
      this.formData.domicileCity = '';
      this.formData.domicileAddr = '';
      this.cityRegions = [];
      let province = this.formData.domicileProvince;
      this.cityRegions = this.cities[province];
      for (var item in this.cityRegions){
        this.city[this.city.length] = item;
      }
    },

    getRegions: async function() {
      this.regions = [];
      this.formData.domicileAddr = '';
      let city = this.formData.domicileCity;
      this.regions = this.cityRegions[city];
      if(!this.regions){
        this.formData.domicileAddr = ' ';
      }
    },

    statusControl: async function() {
      this.formTitle = this.statusInfo[this.status];
      if(this.status === constants.APPLICATION_STATUS_EDITING){
        this.disabledForm = false;
      } else {
        this.disabledForm = true;
      }
    },

    // judge: async function () {
    //   if(!this.canUpload) {
    //     ShowTip('保存报名表后才能上传图片！', 'danger');
    //   }
    // }
  }
});
