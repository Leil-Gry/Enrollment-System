parasails.registerPage('distribution', {
  data: {
    posts:[],
    activeUpdateForm: false,
    activeDeleteConfirm: false,
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
      // TODO: 完善API细节
      await Cloud.deletePosition.with({ id: this.deletePositionId });
      this.deletePositionId = '';
      this.activeDeleteConfirm = false;
    },

    updatePosition: async function() {
      await Cloud.updatePosition.with({ id: this.currentPositionId, newName: this.newPositionName }); // TODO: 完成这个API，完善边缘逻辑，如错误提示等
      this.activeUpdateForm = false; // 关闭弹窗
    },

    showUpdateForm: async function(position) {
      // TODO: position中有 id name application  这里做判断，如果新修改名和旧一致则不修改 ，弹窗报告  等， js里用 === 代表等于 !== 代表不等于
      this.currentPositionId = position.Id;
      this.newPositionName = position.name;
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
