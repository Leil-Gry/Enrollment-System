parasails.registerPage('login', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    token: '',

    loginBtnDisabled: true,
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

  },
  watch: {
    token: function(v) {
      if(v) {
        if(v){
          this.loginBtnDisabled = false;
        }
      }
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // submittedForm: async function() {
    //   // Redirect to the logged-in dashboard on success.
    //   // > (Note that we re-enable the syncing state here.  This is on purpose--
    //   // > to make sure the spinner stays there until the page navigation finishes.)
    //   this.syncing = true;
    //   localStorage.removeItem('applyForm');
    //   // window.location = '/';
    //   console.log(this.token);
    // },

    handleLogin: async function() {
      var valid = await this.$refs.loginForm.validate();
      this.syncing = true;
      if (!valid) {return;}
      if(!this.token) {
        ShowTip('请先进行人机验证！','danger');
        return;
      }
      this.syncing = false;
      this.formData.token = this.token;
      await Cloud.login.with(this.formData).then((res) => {
        console.log(res);
      });
      localStorage.removeItem('applyForm');
      // window.location = '/';
    }

  }
});
