function loadV2Script() {
  self = window;
  if (typeof window.vaptcha === 'function') {
    //如果已经加载就直接放回
    return Promise.resolve();
  } else {
    return new Promise(resolve => {
      var script = document.createElement('script');
      script.src = 'https://v.vaptcha.com/v3.js';
      script.async = true;
      script.onload = script.onreadystatechange = function() {
        if (
          !this.readyState ||
          this.readyState == 'loaded' ||
          this.readyState == 'complete'
        ) {
          resolve();
          script.onload = script.onreadystatechange = null;
        }
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }
}

function optionsMerge (target, source) {
  Object.keys(source).map((val, i) => {
    target[val] = target[val] ? target[val] : source[val];
  });
}

parasails.registerComponent('vaptcha', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'syncing',
    'vid',
    'type',
    'scene',
    'offline_server',
    'vpStyle',  // "style" is a reserved attribute and cannot be used as component prop.
    'color',
    'lang'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      vaptcha: null
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div ref="vaptcha">
    <div class="vaptcha-init-main">
      <div class="vaptcha-init-loading">
        <a href="https://www.vaptcha.com/" target="_blank">
          <img src="https://cdn.vaptcha.com/vaptcha-loading.gif">
        </a>
        <span class="vaptcha-text">VAPTCHA启动中...</span>
      </div>
    </div>
  </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },
  mounted: async function(){
    // const config = Object.assign({
    //   // vid: '5eee08f72fd1114faf06854a',
    //   vid: '5ee73be818501124667130e3',
    //   container: this.$refs.vaptcha,
    //   type: 'click', // 显示类型 点击式
    //   scene: 0, // 场景值 默认0
    //   offline_server: 'aa', //离线模式服务端地址，若尚未配置离线模式，请填写任意地址即可。
    //   syncing:this.syncing,
    // }, this.$props); // TODO: vpStyle -> style
    const config ={
      // vid: '5eee08f72fd1114faf06854a',
      // vid: '5ee73be818501124667130e3',
      vid: '5ee90cab1850112466713209',
      container: this.$refs.vaptcha,
      type: 'click', // 显示类型 点击式
      scene: 0, // 场景值 默认0
      offline_server: 'aa', //离线模式服务端地址，若尚未配置离线模式，请填写任意地址即可。
      syncing:this.syncing,
    }; // TODO: vpStyle -> style

    // this.$vaptcha && optionsMerge(config, this.$vaptcha.options);
    loadV2Script().then(() => {
      window.vaptcha(config).then(obj => {
        obj.render();
        obj.listen('pass', () => {
          let token = obj.getToken();
          this.$emit('input', token);
        });
        this.vaptcha = obj;
      });
    });
  },
  destroyed() {
    const { vaptcha } = this;
    vaptcha && vaptcha.destroy();
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {


  }
});
