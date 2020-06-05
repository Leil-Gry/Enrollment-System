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
    showPhoto: false,

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
      intention1:'',
      intention2:'',
      obeyTheAdjustment:true,
      workedInTheCYL:true,
      resume:'',
      volunteeringExperience:'',
      rewardsAndPunishment:'',
      school:'杭州电子科技大学'
    },
    formTitle:'',
    status:Number,
    disabledForm: false,
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
    allApplyStatus: constants.APPLICATION_STATUS,
    ifWorkedInTheCYL: IFWORKEDINTHECYL,
    ifObeyTheAdjustment: IFOBEYTHEADJUSTMENT,
    politics: POLITICS,
    education: EDUCATION,
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
      intention1: { required: true },
      intention2: { required: true,differentWith: 'intention1'},
      homeAddressAndPhone: { required: true }
    },
  },

  watch: {
    photo: function(v) {
      if (v) {
        this.showImg = true;
        setTimeout(() => {
          this.imageUrl = '/public/avatars/' + this.photo; // TODO: constants
        }, 2000);  // WHY ?
        // Vue.nextTick(() => {
        //   this.imageUrl = '/public/avatars/' + this.photo;
        // });

      }
    }
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

    this.schools = JSON.parse(await Cloud.findSchool.with());
    this.nations = JSON.parse(await Cloud.findNation.with());
    this.province = JSON.parse(await Cloud.findProvince.with());
    this.cities = JSON.parse(await Cloud.findCity.with());
    this.intention = JSON.parse(await Cloud.findIntention.with());
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
    this.statusControl();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function() {
      this.saveForm();
      // if(this.isEmailVerificationRequired) {
      //   // If email confirmation is enabled, show the success message.
      this.cloudSuccess = true;
      // }
      // else {
      //   // Otherwise, redirect to the logged-in dashboard.
      //   // > (Note that we re-enable the syncing state here.  This is on purpose--
      //   // > to make sure the spinner stays there until the page navigation finishes.)
      //   this.syncing = true;
      //   window.location = '/';
      // }
    },

    getApplyForm: async function() {
      let form = await Cloud.getApply.with();
      if(form) {
        this.showPhoto = true;
        this.formData = form;
        this.getCityRegion(form.domicileProvince,form.domicileCity,form.domicileAddr);
      } else {
        this.showPhoto = false;
        let localForm = JSON.parse(localStorage.getItem('applyForm'));
        this.formData = localForm?localForm:this.formData;
        if(localForm){
          this.getCityRegion(localForm.domicileProvince,localForm.domicileCity,localForm.domicileAddr);
        }
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

    saveForm: async function() {
      localStorage.setItem('applyForm',JSON.stringify(this.formData));
      this.ShowTip('保存成功', 'success');
    },

    submitApply: async function() {
      this.saveForm();
      await Cloud.createApply.with(this.formData);
      this.cloudSuccess = true;
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
      console.log(this.formData.domicileCity);
      let city = this.formData.domicileCity;
      this.regions = this.cityRegions[city];
    },

    statusControl: async function() {
      // let apply = await Cloud.getApply.with()
      // console.log(apply)
      // this.status = apply.status
      this.status = 1;
      this.formTitle = FORMTITLE[this.status];
      if(this.status === constants.APPLICATION_STATUS_EDITING){
        this.disabledForm = false;
      } else {
        this.disabledForm = true;
      }
    },

    ShowTip(tip, type) {
      var $tip = $('#tip');
      if ($tip.length === 0) {
      // 设置样式，也可以定义在css文件中
        $tip = $('<span id="tip" style="width:50%;position:fixed;top:50px;left: 50%;z-index:9999;height: 50px;padding: 0 20px;line-height: 50px;"></span>');
        $('body').append($tip);
      }
      $tip.stop(true).prop('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(200).delay(2000).fadeOut(200);
    }


  }
});
