<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Picture</b-button>
    <b-modal ref="PictureModal" title="Change Batch Picture" size="lg" centered hide-footer>
      <div class="modal-lg">
        <!-- <b-button class="myBtn" @click="openCamera">Add/Edit Image: </b-button> -->
        <!-- <input type="file" accept="image/*" @change="onFileSelected">  -->
        <b-form-file type="file"
                     accept="image/*" 
                     @change="onFileSelected" 
                     v:state="Boolean(file)" 
                     placeholder="Choose an image..."
                     ></b-form-file>
        <p v-if="loaded">Uploading image to database</p>
        <b-progress v-if="loaded"
                    :value="counter" 
                    :max="max" 
                    show-progress 
                    animated 
                    ></b-progress>
        <div style="display: flex; justify-content: center; margin-top: 5%">
        <b-img :src="imageUrl" height="250" width="300" />
        </div>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" :disabled="disabled == 1 ? true : false" variant="outline-primary" @click="onSave">Save Image</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import {db} from '../main'
  import firebase from 'firebase/app';
  import 'firebase/storage';
  import 'firebase/database';

export default {
  name: 'PictureChangeModal',
  data () {
    return {
      batchId: '',
      plantName: '',
      selectedFile: null,
      imageUrl: null,
      loaded: false,
      downloadUrl: null,
      disabled: 1,
      counter: 0,
      max: 3,
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
      
      //Uploads the image to Firebase storage with the batchId and name which will be used as identifiers 
      firebase.storage().ref('batchImages/' + this.batchId + "-" + this.plantName).put(this.selectedFile) 
      .catch((error) => {
        console.log("STORAGE ERROR: " + JSON.stringify(error));
        alert("Storage: " + JSON.stringify(error));
      }).then(
        this.loaded = true, //Show loading bar
        // setTimeout(this.getDownloadURL, 3000), //Get the download url given enough time for it to load
        // setTimeout(this.checkDownloadUrlExists, 3000), //Set a timer to give enough time to retrieve downloadUrl to allow user to continue
        setTimeout(this.progressFinish, 3000),
        this.progressBar()//Start counter on loading bar
        );
      //           firebase.storage().ref().child('batchImages/' + this.batchId + "-" + this.plantName).getDownloadURL().then( (url) => { //Get download url
      //   this.downloadUrl = url;
      // }).catch((error) => {
      //   console.log("DOWNLOAD URL ERROR: " + JSON.stringify(error));
      //   alert(JSON.stringify(error));
      // })
    },
    onSave() {
      this.$refs.PictureModal.hide()
      //Save the downloadUrl to the database to be referenced when loading the images
      //---------- THIS SHOULD PROBABLY DO SOMETHING --------
      // firebase.database().ref(this.batchId).set({
      //   downloadUrl: this.downloadUrl
      // }).catch((error) => {
      //   console.log("DATABASE: " + JSON.stringify(error));
      //   alert("Database: " + JSON.stringify(error));
      // });
    },
    getDownloadURL() {
      //Get the download url from the image that has just been uploaded
      firebase.storage().ref().child('batchImages/' + this.batchId + "-" + this.plantName).getDownloadURL().then( (url) => {
        this.downloadUrl = url; //Set the url so that it can be saved to the database
      }).catch((error) => {
        console.log("getDownloadUrl: " + error);
      }).then( 
        this.checkDownloadUrlExists()
      );
    },
    checkDownloadUrlExists() {
      if(this.downloadUrl != null) {
        console.log("DownloadUrl retrieved, can save to db");
        this.loaded = false; //Hide the loading text
        this.disabled = 0; //Enable the button only when the download url is there
        this.counter = 0;
      } else {
        console.log(this.downloadUrl);
        alert("Something went wrong");
      }
    },
    progressBar() {
      this.counter++
      if(this.counter != 3) {
      setTimeout(this.progressBar, 1000);
      }
    },
    progressFinish() {
      this.loaded = false; //Hide the loading text
      this.disabled = 0; //Enable the button only when the download url is there
      this.counter = 0;
    },
    getImage() {
        firebase.database().ref(this.batchId).once('value').then((snapshot) => {
        let url = snapshot.val().downloadUrl;
        document.querySelector('img').scr = url;
        this.imageUrl = url;
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

.modal-lg { /*Used to overwrite the size of the modal */
    height: 50vh;
}

.b-img {
  align-content: center;
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