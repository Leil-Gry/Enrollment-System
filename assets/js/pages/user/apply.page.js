parasails.registerPage('userApply', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,


    // Server error state for the form
    cloudError: '',

    photo: '',
    showImg: false,  // must use v-if, otherwise getting photo file returns 404
    imageUrl: '',
    canUpload: false,

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
    photo: function(v) {
      if (v) {
        this.showImg = true;
        setTimeout(() => {
          this.imageUrl = this.getImageUrl(this.photo);
        }, 2000);  // WHY ?
        // Vue.nextTick(() => {
        //   this.imageUrl = '/public/avatars/' + this.photo;
        // });

      }
    },
  },

  // computed: {

  //   imageUrl() {
  //     return this.photo ? '/public/avatars/' + this.photo : ''; // TODO: constants
  //   }

  // },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    this.schools   = await Cloud.findSchool.with();
    this.nations   = await Cloud.findNation.with();
    this.province  = await Cloud.findProvince.with();
    this.cities    = await Cloud.findCity.with();
    this.intention = await Cloud.findIntention.with();
<<<<<<< HEAD
    await this.getApplyForm();
    if (this.status === 1) {
      window.onbeforeunload = function(e){
        e = window.event||e;
        e.returnValue=('确定离开当前页面吗？');
      };
    }
=======
    this.getApplyForm();
>>>>>>> 60a8c5aadbbb651df339be48e3982e2dfa6e479a
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

    createApply: async function() {
      this.saveForm();
      this.formData = await Cloud.createApplication.with();
      ShowTip('保存成功！','success');
      this.cloudSuccess = true;
    },

    getApplyForm: async function() {
      let form = await Cloud.getApply.with();
      if(form) {
        this.formData = form;
        this.showSubmitBtn = false;
        this.photo = form.photo;
        this.imageUrl = this.getImageUrl(this.photo);
        this.getCityRegion(form.domicileProvince,form.domicileCity,form.domicileAddr);
        this.disabledForm = form.status > 1?true:false;
        if(!this.disabledForm) {
          this.canUpload = true;
          this.showSubmitBtn = true;
        }
      } else {
        this.canUpload = false;
        let localForm = JSON.parse(localStorage.getItem('applyForm'));
        this.formData = localForm?localForm:this.formData;
        if(localForm){
          this.getCityRegion(localForm.domicileProvince,localForm.domicileCity,localForm.domicileAddr);
        }
      }
      this.status = form.status;
      this.statusControl();
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
      this.$refs.form.submitApply().then((res) => {
        this.showConfirmModel = res;
      });
    },

    // 用户确认提交，数据发送到服务端
    submitApply: async function() {
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

    judge: async function () {
      if(this.disabledForm) {
        ShowTip('报名表已不能修改！', 'danger');
      } else if(!this.canUpload) {
        ShowTip('保存报名表后才能上传图片！', 'danger');
      }
    }
  }
});
