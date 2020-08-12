parasails.registerPage('userApply', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,


    // Server error state for the form
    cloudError: '',

    photoFile: '',  // can be used to check if photo has been uploaded/changed on local
    showImg: false,  // must use v-if, otherwise getting photo file returns 404
    imageUrl: '',    // could be url to photo on the server, or dataUrl to local base64 image from uploader
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

    applyID: null,  // 可用于判断是否已保存到服务器
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
      birthDate: {
        required: true,
        maxLength:10,
        custom : input => {
          return /^(19|20)[0-9]{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])$/.test(input);
        }
      },
      politicalStatus: { required: true },
      IDNumber: {
        required: true,
        custom: input => {
          return /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(input);
        }
      },
      education: { required: true },
      major: { required: true },
      specialty: { required: true,maxLength:40 },
      healthStatus: { required: true,maxLength:40 },
      pastMedicalHistory: { required: true,maxLength:40 },
      domicileProvince: { required: true },
      domicileCity: { required: true },
      // domicileAddr: { required: true },
      phone: { required: true,maxLength:20 },
      email: { required: true,isEmail:true },
      intentType: { required: true },
      intention1: { required: true },
      intention2: { required: true, differentWith: 'intention1' },
      homeAddressAndPhone: { required: true },
      resume: { maxLength: 1000 },
      volunteeringExperience: { maxLength: 1000 },
      rewardsAndPunishment: { maxLength: 1000 },
    },

    deadline: ''
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
    this.getDeadline();
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
    getImageUrl: function(fd) { return constants.IMAGE_SAVE_DIR + fd; },

    uploadPhoto: async function() {
      const resizedimage = this.$refs.uploader.getImage();

      let photo;
      try {
        photo = await Cloud.uploadPhoto.with({id: this.applyID, photo: resizedimage});
      } catch (e) {
        console.log(e);// TODO: show toast
        ShowTip('图片上传失败','danger');
      }

      this.formData.photo = photo;
      this.imageUrl = this.getImageUrl(photo);
      this.showImg = true;
      this.photoFile = null;
    },

    updateApply: async function(showTip=true) {
      this.formData.domicileAddr = this.formData.domicileAddr ? this.formData.domicileAddr : '无';
      this.formData.resume = this.formData.resume ? this.formData.resume : '无';
      this.formData.pastMedicalHistory = this.formData.pastMedicalHistory ? this.formData.pastMedicalHistory : '无';
      this.formData.rewardsAndPunishment = this.formData.rewardsAndPunishment ? this.formData.rewardsAndPunishment : '无';
      this.formData.volunteeringExperience = this.formData.volunteeringExperience ? this.formData.volunteeringExperience : '无';

      this.saveForm();

      var valid = await this.$refs.form.validate();

      // custom validation involve 'this'
      if (!this.intentTypes.includes(this.formData.intentType)) {
        this.formErrors.intentType = 'required';
        valid = false;
      }
      if (!this.intention.find(i => i.name === this.formData.intention1)) {
        this.formErrors.intention1 = 'required';
        valid = false;
      }
      if (!this.intention.find(i => i.name === this.formData.intention2)) {
        this.formErrors.intention2 = 'required';
        valid = false;
      }

      if (!valid) {
        ShowTip('请检查填写的信息','danger');
        return;
      }

      delete this.formData['id'];
      let formData = await Cloud.createApplication.with(this.formData);
      this.applyID = formData.id;

      if (this.photoFile && this.$refs.uploader) {
        await this.uploadPhoto();
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
      let form = await Cloud.getApply.with();
      if(form !== 'notFound') {
        this.applyID = form.id;
        this.formData = form;

        if (form.photo) {
          this.imageUrl = this.getImageUrl(form.photo);
          this.showImg = true;
        }
        this.getCityRegion(form.domicileProvince,form.domicileCity,form.domicileAddr);
        this.disabledForm = (form.status > 1);
        this.showSubmitBtn = !this.disabledForm;

        this.status = form.status;
      } else {
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
      // TODO: save photoFile
      localStorage.setItem('applyForm',JSON.stringify(this.formData));
      // $('select').blur();
    },

    // 用户点击后，进行输入校验。校验成功跳出提示弹窗。
    submitCheck: async function() {
      this.saveForm();

      if (!this.applyID) {
        ShowTip('还未保存，请点击保存！','danger');
        return;
      }

      if (this.photoFile) {
        ShowTip('照片还未保存，请点击保存！','danger');
        return;
      }

      if(!this.imageUrl) {
        ShowTip('请先上传照片！','danger');
        return;
      }
      this.showConfirmModel = await this.$refs.form.validate();
    },

    // 用户确认提交，数据发送到服务端
    submitApply: async function() {
      // await this.updateApply(false);
      let err = false;
      try{
        await Cloud.submitApplication.with(this.formData);
      } catch (e) {
        if (e.responseInfo &&
            e.responseInfo.body &&
            e.responseInfo.body.code &&
            e.responseInfo.body.code === 'E_DEADLINE') {
          err = true;
          ShowTip('已过报名截止时间！','danger');
        } else {
          throw e;
        }
      }
      if(!err) { ShowTip('提交成功！','success'); }
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

    genBirthAndSaveForm: async function () {
      let reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      let tmp = this.formData.IDNumber;
      if (!reg.test(tmp)) {
        ShowTip('身份证号码格式错误！请修改','danger');
        return;
      }
      this.formData.birthDate = tmp.substring(6, 10) + '/' + tmp.substring(10, 12) + '/' + tmp.substring(12, 14);

      this.saveForm();
    },
    getDeadline: async function () {
      let fb = await Cloud.getDeadline.with();
      this.deadline = fb.applyUntil;
      // .replace(/:\d{1,2}$/,' ')
    }
  }
});
