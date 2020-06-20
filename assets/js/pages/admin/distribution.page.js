parasails.registerPage('distribution', {
  data: {
    posts:[],
  },

  beforeMount: async function() {
    this.getPosts();
  },

  methods: {
    getPosts: async function() {
      this.posts = await Cloud.getPositionList.with();
    },

    uploadExcel: async function(event) {
      if (event && event.target && event.target.files && event.target.files[0]){
        let excel = event.target.files[0];
        if(excel.name.slice(-5) !== '.xlsx' && excel.name.slice(-5) !== '.xls'){
          ShowTip('只接受xlsx或xls格式文件','danger');
          return;
        }
        let fd = await Cloud.uploadExcel.with({ excel: excel });
        if(fd === 'notFound'){
          ShowTip('无新岗位','danger');
          return;
        }
        ShowTip('上传成功','success');
        return;
      }
      ShowTip('上传失败','danger');
    }

  }
});
