parasails.registerPage('login', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: {
      emailAddress: '',
      password: '',
      rememberMe: false,
    },
    // formData: {
    //   emailAddress: '1@a.com',
    //   password: 'abc123',
    //   rememberMe: true,
    // },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // A set of validation rules for our form.
    // > The form will not be submitted if these are invalid.
    formRules: {
      emailAddress: { required: true, isEmail: true },
      password: { required: true },
    },

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
    // await this.vaptchaSet();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    submittedForm: async function() {
      // Redirect to the logged-in dashboard on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;
      localStorage.removeItem('applyForm');
      window.location = '/';
    },

    // vaptchaSet: async function() {
    //   console.log(window.print);
    //   console.log(window.vaptcha);
    //   window.vaptcha({
    //     //配置参数
    //     vid: '5ee90cab1850112466713209', // 验证单元id
    //     type: 'click', // 展现类型 点击式
    //     scene: 1,
    //     container: '#vaptchaContainer',// 按钮容器，可为Element 或者 selector
    //     // eslint-disable-next-line camelcase
    //     // offline_server: 'http://localhost:1338',
    //     offline_server: 'http://localhost:1338/',

    //   },(vaptchaObj) => {
    //     console.log('qqq');
    //     // obj = vaptchaObj; //将VAPTCHA验证实例保存到局部变量中
    //     vaptchaObj.render(); // 调用验证实例 vpObj 的 render 方法加载验证按钮

    //   });
    // }

  }
});
