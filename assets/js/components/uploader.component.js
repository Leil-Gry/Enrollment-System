/**
 * <uploader>
 * -----------------------------------------------------------------------------
 * Reference: https://bootstrapious.com/p/bootstrap-image-upload
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('uploader', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'syncing',
    'photo',
<<<<<<< HEAD
    'canUpload'
=======
    'uploadPhoto'
>>>>>>> 2b1d9814caeaf0c7876cb8732803ead859467d2d
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
    <div class="row py-4">
      <div class="col-lg-6 mx-auto">
        <div class="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
<<<<<<< HEAD
          <input id="upload" type="file" @change="readURL" class="form-control border-0" v-if="canUpload">
=======
          <input id="upload" type="file" @change="readURL" class="form-control border-0" v-if="uploadPhoto">
>>>>>>> 2b1d9814caeaf0c7876cb8732803ead859467d2d
          <input id="upload" @change="readURL" class="form-control border-0" v-else>
          <label id="upload-label" for="upload" class="font-weight-light text-muted">上传照片</label>
          <div class="input-group-append">
            <label for="upload" class="btn btn-light m-0 rounded-pill px-4"> <i class="fa fa-cloud-upload mr-2 text-muted"></i><small class="text-uppercase font-weight-bold text-muted">上传照片</small></label>
          </div>
        </div>
        <!--<p class="font-italic text-white text-center">The image uploaded will be rendered inside the box below.</p>
        <div class="image-area mt-4"><img id="imageResult" :src="#" alt="" class="img-fluid rounded shadow-sm mx-auto d-block"></div>-->
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
<<<<<<< HEAD
=======
    console.log(sessionStorage.getItem('uploadPhoto'));
>>>>>>> 2b1d9814caeaf0c7876cb8732803ead859467d2d
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    readURL: async function(event) {
      if (event && event.target && event.target.files && event.target.files[0]) {
        // var reader = new FileReader();

        // reader.onload = function (e) {
        //   $('#imageResult').attr('src', e.target.result);
        // };
        // reader.readAsDataURL(event.target.files[0]);
        let fd;
        try {
          fd = await Cloud.uploadPhoto.with({id: 1, photo:event.target.files[0]});
        } catch (e) {
          console.log(e);
          // TODO: show toast
        }

        if (fd) {
          this.$emit('update:photo', fd);
        }

      }
    }

  }
});
