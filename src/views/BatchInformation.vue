<template>
  <div>
      <b-container>
      <h4>Batch Number: {{batchId}}</h4>
      <h4>Plant Name: {{plantName}} </h4>
      <b-row>
        <b-col cols="2"><label for="location">Location: {{location}}</label></b-col>
        <b-col cols="10"><location-change-modal></location-change-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="formSize">Size: {{formSize}} </label></b-col>
        <b-col cols="10"><form-size-change-modal></form-size-change-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="quantity">Saleable Quantity: {{quantity}} 
          Growing Quantity: {{growingQuantity}}  Allocated Quantity: {{allocatedQuantity}} </label></b-col> 
        <b-col cols="10"><quantity-change-modal></quantity-change-modal></b-col> 
      </b-row>
      <b-row>
        <b-col cols="2"><label for="price">Price: £  {{computedPrice}}</label></b-col> 
        <b-col cols="10"><price-change-modal></price-change-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="image">Add/Edit Picture: </label></b-col>
        <b-col cols="10"><picture-modal></picture-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="deletion">Delete Batch: </label></b-col> 
        <b-col cols="10"><delete-batch-modal></delete-batch-modal></b-col>
      </b-row>
      <br>
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="10"><b-button @click="saveChanges" style="position: absolute;" 
                                   variant="outline-primary">
                                   Finished Editing</b-button>
        </b-col>
      </b-row>
    </b-container> 
  </div>
</template>

<script>
  import LocationChangeModal from '@/components/LocationChangeModal';
  import FormSizeChangeModal from '@/components/FormSizeChangeModal';
  import QuantityChangeModal from '@/components/QuantityChangeModal';
  import PriceChangeModal from '@/components/PriceChangeModal';
  import PictureModal from '@/components/PictureModal';
  import DeleteBatchModal from '@/components/DeleteBatchModal';

  import {db} from '../main'
  import firebase from 'firebase/app';

export default {
  name: 'BatchInformation',
  data () {
    return {
      plantName: '',
      location: '',
      quantity: '',
      growingQuantity: '',
      allocatedQuantity: '',
      formSize: '',
      batchPrice: '',
      batchId: '',
    }
  },
  components: {
    LocationChangeModal,
    FormSizeChangeModal,
    QuantityChangeModal,
    PriceChangeModal,
    PictureModal,
    DeleteBatchModal,
  },
  methods: {
    displayBatchInformation(selectedBatchInformation) {
      this.plantName = selectedBatchInformation.plantName;
      this.location = selectedBatchInformation.location;
      this.quantity = selectedBatchInformation.quantity;
      this.growingQuantity = selectedBatchInformation.growingQuantity;
      console.log(selectedBatchInformation.growingQuantity);
      this.allocatedQuantity = selectedBatchInformation.allocatedQuantity;
      this.formSize = selectedBatchInformation.formSize;
      this.batchPrice = selectedBatchInformation.batchPrice;
      this.batchId = selectedBatchInformation.batchId;
    },
    saveChanges(){
      if(sessionStorage.getItem('imageSaved')) {
        this.getDownloadUrl();
        this.$router.push('StockTable');
        sessionStorage.removeItem('imageSaved');
      } else {
        sessionStorage.removeItem('newLocation');
        sessionStorage.removeItem('newQuantity');
        sessionStorage.removeItem('newFormSize'); ///----------------------------------------------------THESE WERE CHANGED-------------------------------------------------
        sessionStorage.removeItem('selectedBatchInformation');
        sessionStorage.removeItem('imageSaved');
        this.$router.push('StockTable');
      }
    },
    updateLocation() { //This will change the current displayed location
      if(sessionStorage.hasOwnProperty('newLocation')) { //If new location exists show this value after called
        var newLocation = sessionStorage.getItem('newLocation');
        this.location = newLocation;
      }  
    },
    updateQuantity() { //This will change the current displayed location
      if(sessionStorage.hasOwnProperty('newQuantity')) { //If new location exists show this value after called
        var newQuantity = sessionStorage.getItem('newQuantity');
        this.quantity = newQuantity;
      }  
    },
    updateFormSize() { //This will change the current displayed location
      if(sessionStorage.hasOwnProperty('newFormSize')) { //If new location exists show this value after called
        var newFormSize = sessionStorage.getItem('newFormSize');
        this.formSize = newFormSize;
      }  
    },
    getDownloadUrl() {
      firebase.storage().ref().child('batchImages/' + this.batchId + "-" + this.plantName).getDownloadURL().then( (url) => {
        this.savetoFirebase(url);
      }).catch((error) => {
        console.log("getDownloadUrl: " + error);
      });
    },
    savetoFirebase(url) {
      console.log("Saving to Firebase");
      firebase.database().ref(this.batchId).set({
        downloadUrl: url
      }).catch((error) => {
        alert("Database: " + JSON.stringify(error));
      });
    },
  },
  computed: {
    computedPrice () {
      return (this.batchPrice/100).toFixed(2);
		},
	},
  mounted() {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.displayBatchInformation(selectedBatchInformation);
 
    this.$root.$on('BatchInformation', () => { //Method is called when the location is changed
        this.updateLocation();
        this.updateQuantity();
        this.updateFormSize();
    });
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h4 {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: normal;
  text-align: left;
}

p {
  font-family: Georgia, "Times New Roman", Times, serif;
  text-align: left;
  margin-left: 15%;
  font-size: 18px;
  height: 40px;
  margin-right: 55%;
}

label {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 18px;
    /* text-align: left; */
    float:left;
    white-space: nowrap;
    overflow: hidden;
}

</style>
