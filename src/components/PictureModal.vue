<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Picture</b-button>
    <b-modal ref="PictureModal" title="Change Batch Picture" size="lg" centered hide-footer>
      <div class="modal__content">
        <!-- <b-button class="myBtn" @click="openCamera">Add/Edit Image: </b-button> -->
        <input type="file" accept="image/*" @change="onFileSelected">
        <button @click="onUpload">Upload</button>
        <button @click="test">Test</button><br>
        <img :src="imageUrl" height="200">
        <img :src="imageUrl2" height="200">
      </div>

      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="hideModal">Save Changes</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {db} from '../main'
  import firebase from 'firebase/app';
	import 'firebase/storage';

export default {
  name: 'PictureChangeModal',
  data () {
    return {
      batchId: '',
      plantName: '',
      selectedFile: null,
      imageUrl : null,
      imageUrl2 : null,
      images: [],
    }
  },
  methods: {
    showModal() {
      this.$refs.PictureModal.show()
    },
    hideModal() {
      this.$refs.PictureModal.hide()
    },
    onFileSelected(event) {
      const files = event.target.files;
      let fileName = files[0].name;
      if (fileName.lastIndexOf('.') <= 0 ) {
        return alert("Please add valid file");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.selectedFile = files[0];
    },
    onUpload() {
      //Upload the image to Firebase storage with the batchId and name which will be used as identifiers
      firebase.storage().ref('batchImages/' + this.batchId + "-" + this.plantName).put(this.selectedFile);
      console.log("Uploading Image");
    },
    test() {
      let storageRef = firebase.storage().ref() 
      //Get the download url from Firebase storage relating to the image ID and then display the image
      storageRef.child('batchImages/' + this.batchId + "-" + this.plantName).getDownloadURL().then( (url) => {
        document.querySelector('img').scr = url;
        this.imageUrl2 = url;
        console.log("Image Loaded");
      });
    }
  },
  mounted() {
    let selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.batchId = selectedBatchInformation.batchId;
    this.plantName = selectedBatchInformation.plantName;
  }
}
</script>

<style scoped>
/* .btn {
  margin-left: 10%;
  text-align: right;
} */
.modal {
    display: none;
    position: fixed;
}
.modal.open {
   display: block;
}
.myBtn {
  margin-left: 0px;
}


/* .modal-body {
  max-width: 150vh;
}

.modal-dialog {
  width: 40% !important;
  height: 80% !important;
}
 
.modal-content {
    /* 80% of window height */

</style>