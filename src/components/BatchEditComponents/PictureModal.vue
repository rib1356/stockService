<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary" v-if="visible">
              Change Picture</b-button>
    <b-modal ref="PictureModal" title="Change Batch Picture" size="lg" centered hide-footer no-close-on-backdrop>
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
        <b-btn class="mt-3" :disabled="disabled == 1 ? true : false" variant="outline-primary" @click="saveChanges">Save Image</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import {db} from '../../main'
  import firebase from 'firebase/app';
  import 'firebase/storage';
  import 'firebase/database';

export default {
  name: 'PictureModal',
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
      visible: true,
      loadFromSelected: true,
    }
  },
  methods: {
    showModal() {
      this.$refs.PictureModal.show()
    },
    hideModal() {
      this.$refs.PictureModal.hide();
    },
    saveChanges() {
      if(this.loadFromSelected) {
        this.$refs.PictureModal.hide(); //If the user has added an image to a previous batch go back to the batchInformation
        sessionStorage.setItem('imageSaved', true);
      } else {
        this.$router.push('StockTable'); //Else they have added it from a new batch so go straight to the stockTable
      }
    },
    onFileSelected(event) {
      const files = event.target.files; 
      let fileName = files[0].name; 
      if (fileName.lastIndexOf('.') <= 0 ) { //Checks that the file is valid
        return alert("Please add valid file");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.selectedFile = files[0];
      this.getBatchInformation();
      //Uploads the image to Firebase storage with the batchId and name which will be used as identifiers 
      firebase.storage().ref('batchImages/' + this.batchId + "-" + this.plantName).put(this.selectedFile) 
      .catch((error) => {
        console.log("STORAGE ERROR: " + JSON.stringify(error));
        alert("Storage: " + JSON.stringify(error));
      }).then(
        this.loaded = true, //Show loading bar
        setTimeout(this.progressFinish, 3000), //Once the progress bar has finished call this method and enable buttons etc
        this.progressBar(),//Start counter on loading bar
        this.updateImageStatus(),
      );
    },
    progressBar() {
      this.counter++
      if(this.counter != 3) { //Increase the counter every second for 3 seconds
      setTimeout(this.progressBar, 1000);
      }
    },
    progressFinish() {
      this.loaded = false; //Hide the loading text
      this.disabled = 0;  //Enable the button only when the download url is there
      this.counter = 0;
    },
    getBatchInformation() {
      //Check where to load the batchId and PlantName based upon where the user is adding an image
      if(sessionStorage.getItem('selectedBatchInformation') != null)
      {
        console.log("Information loaded from selected batch")
        let selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
        this.batchId = selectedBatchInformation.batchId;
        this.plantName = selectedBatchInformation.plantName;
      } else if (sessionStorage.getItem('newBatchInformation') != null) {
        console.log("Information loaded from a new batch")
        this.loadFromSelected = false;
        let newBatchInformation = JSON.parse(sessionStorage.getItem('newBatchInformation'));
        this.batchId = newBatchInformation.Id;
        this.plantName = newBatchInformation.Name;
      } else {
        //do nothing
      }
    },
    updateImageStatus() {
      this.axios.put("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId, {
        "Id": this.batchId,
        "ImageExists": true,
        "Quantity": -1,
        "Active": true,
        "DateStamp": null
      })
			.then((response) => {
          console.log(response);
			})
			.catch((error) => {
				alert(error);
			});
    },
    checkButton() { //Hide or show the button
      if(sessionStorage.getItem('selectedBatchInformation') == null) {
        this.visible = false;
      }
    }
  },
  mounted() {
    this.checkButton();
  },
  beforeCreate() {
    this.$root.$on('PictureModal', () => {
      this.showModal();   
    });
  }
}
</script>

<style scoped>

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
    height: 60vh;
}

.b-img {
  align-content: center;
}

@media only screen and (max-width : 725px) {

.modal-lg { /*Used to overwrite the size of the modal */
    height: 75vh;
}

}

</style>