parasails.registerPage('distribution', {
  data: {
    posts:[],
    activeUpdateForm: false,
    activeDeleteConfirm: false,
    oldPositionName:'',
    newPositionName: '',
    currentPositionId: '',
    deletePositionId: ''
  },

  beforeMount: async function() {
    this.getPosts();
  },

  methods: {
    showDeleteForm: async function(positionId) {
      this.deletePositionId = positionId;
      this.activeDeleteConfirm = true;
    },

    deletePosition: async function() {
      await Cloud.deletePosition.with({ id: this.deletePositionId });
      this.deletePositionId = '';
      this.activeDeleteConfirm = false;
      window.history.go(0);
    },

    updatePosition: async function() {
      if (this.oldPositionName === this.newPositionName) {
        // ShowTip('当前输入的岗位名称相同！','danger');
        return;
      }

      await Cloud.updatePosition.with({ id: this.currentPositionId, newName: this.newPositionName }); // TODO: 完成这个API，完善边缘逻辑，如错误提示等
      this.activeUpdateForm = false; // 关闭弹窗
      ShowTip('修改成功！','success');
      setTimeout(() => {
        window.history.go(0);
      }, 500);
    },

    showUpdateForm: async function(position) {
      this.currentPositionId = position.id;
      this.newPositionName = position.name;
      this.oldPositionName = position.name;
      this.activeUpdateForm = true;
    },

    getPosts: async function() {
      this.posts = await Cloud.getPositionList.with({ isUnassigned: false });
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
        window.history.go(0);
        return;
      }
    }
  }
});
