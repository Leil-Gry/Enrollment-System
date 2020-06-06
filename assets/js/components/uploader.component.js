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
    'canUpload'
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
          <input id="upload" type="file" @change="readURL" class="form-control border-0" v-if="canUpload">
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
        const settings = {
          file: event.target.files[0],
          maxWidth: 148,
          maxHeight: 196
        };
        const resizedimage = await this.resizeImage(settings);

        let fd;
        try {
          fd = await Cloud.uploadPhoto.with({id: 1, photo: resizedimage});
        } catch (e) {
          console.log(e);
          // TODO: show toast
        }

        if (fd) {
          this.$emit('update:photo', fd);
        }
      }
    },

    resizeImage: async function (settings) {
      var file = settings.file;
      var maxWidth = settings.maxWidth;
      var maxHeight = settings.maxHeight;
      var reader = new FileReader();
      var image = new Image();
      var canvas = document.createElement('canvas');

      // var dataURItoBlob = function (dataURI) {
      //   var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
      //         atob(dataURI.split(',')[1]) :
      //         unescape(dataURI.split(',')[1]);
      //   var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      //   var max = bytes.length;
      //   var ia = new Uint8Array(max);
      //   for (var i = 0; i < max; i++)
      //   {ia[i] = bytes.charCodeAt(i);}
      //   return new Blob([ia], { type: mime });
      // };

      var dataURItoFile = function (dataURI) {
        var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
              atob(dataURI.split(',')[1]) :
              unescape(dataURI.split(',')[1]);
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var max = bytes.length;
        var ia = new Uint8Array(max);
        for (var i = 0; i < max; i++)
        {ia[i] = bytes.charCodeAt(i);}
        return new File([ia], file.name, { type: mime });
      };

      var resize = function () {
        var width = image.width;
        var height = image.height;
        var aspectRatio = width / height;
        if (aspectRatio > maxWidth / maxHeight) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        // return dataURItoBlob(dataUrl);
        return dataURItoFile(dataUrl);
      };

      return new Promise(((ok, no) => {
        if (!file.type.match(/image.*/)) {
          no(new Error('Not an image'));
          return;
        }
        reader.onload = function (readerEvent) {
          image.onload = function () { return ok(resize()); };
          image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
      }));
    }
  }
});
