/**
 * <apply-form>
 * -----------------------------------------------------------------------------
 * Reference: https://bootstrapious.com/p/bootstrap-image-upload
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('applyForm', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'applyForm',
    'imageUrl'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      //…
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div>
    <div class=row >
      <div class="col-6">
        <div class="form-group">
          <label for="school">学校名称</label>
          <input class="form-control" v-model="applyForm.school" disabled>
        </div>
        <div class="form-group">
          <label for="name">姓名</label>
          <input class="form-control"  id="name" v-model.trim="applyForm.name" disabled>
        </div>
        <div class="form-group">
          <label for="name">性别</label>
          <input class="form-control"   v-model.trim="applyForm.sex" disabled>
        </div>
      </div>
      <div class="form-group col-6">
          <div class="image-area mt-4">
            <img id="imageResult" :src="imageUrl" alt="" class="img-fluid rounded shadow-sm mx-auto d-block">
          </div>
      </div>
    </div>
    <div class="form-group">
      <label for="nation">民族</label>
      <input class="form-control"   v-model.trim="applyForm.nation" disabled>
    </div>
    <div class="row">
      <div class="form-group col-6">
        <label for="birthDate">出生年月</label>
        <input class="form-control"   v-model.trim="applyForm.birthDate" disabled>
      </div>
      <div class="form-group col-6">
        <label for="politicalStatus">政治面貌</label>
        <input class="form-control"   v-model.trim="applyForm.politicalStatus" disabled>
      </div>
    </div>
    <div class="form-group">
      <label for="name">身份证号</label>
      <input class="form-control"   v-model.trim="applyForm.IDNumber" disabled>
    </div>
    <div class="row">
      <div class="form-group col-6">
        <label for="education">学历</label>
        <input class="form-control"   v-model.trim="applyForm.education" disabled>
      </div>
      <div class="form-group col-6">
        <label for="major">院（系）专业</label>
        <input class="form-control"   v-model.trim="applyForm.major" disabled>
      </div>
    </div>
    <div class="form-group">
      <label for="name">特长</label>
      <input class="form-control" id="specialty"  v-model.trim="applyForm.specialty" disabled>
    </div>
    <div class="row">
      <div class="form-group col-6">
        <label for="name">健康状况</label>
        <input class="form-control"   v-model.trim="applyForm.healthStatus" disabled>
      </div>
      <div class="form-group col-6">
        <label for="name">既往病史</label>
        <input class="form-control"   v-model.trim="applyForm.pastMedicalHistory" disabled>
      </div>
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label for="name">入学前户籍所在地</label>
    </div>
    <div class="row">
      <div class="form-group col-4">
        <input class="form-control"   v-model.trim="applyForm.domicileProvince" disabled>
      </div>
      <div class="form-group col-4">
        <input class="form-control"   v-model.trim="applyForm.domicileCity" disabled>
      </div>
      <div class="form-group col-4">
        <input class="form-control"   v-model.trim="applyForm.domicileAddr" disabled>
      </div>
    </div>
      <div class="row">
        <div class="form-group col-6">
          <label for="name">联系电话</label>
          <input class="form-control"   v-model.trim="applyForm.phone" disabled>
        </div>
        <div class="form-group col-6">
          <label for="name">电子邮箱</label>
          <input class="form-control"   v-model.trim="applyForm.email" disabled>
        </div>
      </div>
      <div class="form-group">
        <label for="name">家庭通讯地址及电话</label>
        <input class="form-control"   v-model.trim="applyForm.homeAddressAndPhone" disabled>
      </div>
      <div class="form-group">
        <label for="name">服务意向</label>
        <input class="form-control"   v-model.trim="applyForm.intentType" disabled>
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <label for="name">服务意向地区</label>
      </div>
      <div class="row">
        <div class="form-group col-6">
          <input class="form-control"   v-model.trim="applyForm.intention1" disabled>
        </div>
        <div class="form-group col-6">
          <input class="form-control"   v-model.trim="applyForm.intention2" disabled>
        </div>
      </div>
      <div class="row">
        <div class="form-group col-6">
          <label for="name">是否服从分配</label>
          <input class="form-control"   v-model.trim="applyForm.obeyTheAdjustment" disabled>
        </div>
        <div class="form-group col-6">
          <label for="name">是否从事过共青团工作</label>
          <input class="form-control"   v-model.trim="applyForm.workedInTheCYL" disabled>
        </div>
    </div>
    <div class="form-group">
        <label for="name">个人简历</label>
        <textarea class="form-control"  id="resume" rows="5" v-model.trim="applyForm.resume" disabled></textarea>
      <div class="invalid-feedback">个人简历</div>
    </div>
    <div class="form-group">
      <label for="name">志愿服务经历</label>
      <textarea class="form-control"  id="volunteeringExperience" rows="5" v-model.trim="applyForm.volunteeringExperience" disabled></textarea>
      <div class="invalid-feedback">志愿服务经历</div>
    </div>
    <div class="form-group">
      <label for="name">大学期间奖励和处分</label>
      <textarea class="form-control"  id="rewardsAndPunishment " rows="5" v-model="applyForm.rewardsAndPunishment" disabled></textarea>
      <div class="invalid-feedback">大学期间奖励和处分</div>
    </div>
  </div>`,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },
  mounted: async function(){
    //…
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
