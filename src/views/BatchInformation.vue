<template>
  <div>
      <b-container>
      <h4>Batch Number: {{batchId}}</h4>
      <h4>Plant Name: {{plantName}} </h4>
      <h4>Batch Date: {{batchDate}}</h4>
      <b-row>
        <b-col cols="2"><label for="location">Location: {{location}}</label></b-col>
        <b-col cols="10"><location-change-modal></location-change-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="formSize">Size: {{formSize}} </label></b-col>
        <b-col cols="10"><form-size-change-modal></form-size-change-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <label for="quantity">Saleable Quantity: {{quantity}} </label>
          <label>Growing Quantity: {{growingQuantity}}</label>
          <label>Allocated Quantity: {{allocatedQuantity}}</label>
        </b-col> 
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
        <b-col cols="2"><label for="deletion">Update Batch Date: </label></b-col> 
        <b-col cols="10"><b-button variant="outline-primary" size="sm" style="position: absolute;" @click="updateDate">Update Date</b-button></b-col>
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
  import LocationChangeModal from '@/components/BatchEditComponents/LocationChangeModal';
  import FormSizeChangeModal from '@/components/BatchEditComponents/FormSizeChangeModal';
  import QuantityChangeModal from '@/components/BatchEditComponents/QuantityChangeModal';
  import PriceChangeModal from '@/components/BatchEditComponents/PriceChangeModal';
  import PictureModal from '@/components/BatchEditComponents/PictureModal';
  import DeleteBatchModal from '@/components/BatchEditComponents/DeleteBatchModal.vue';
  import moment from 'moment';
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
      batchDate: '',
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
      this.allocatedQuantity = selectedBatchInformation.allocatedQuantity;
      this.formSize = selectedBatchInformation.formSize;
      this.batchPrice = selectedBatchInformation.batchPrice;
      this.batchDate = this.convertDate(selectedBatchInformation.dateStamp);
      this.batchId = selectedBatchInformation.batchId;
    },
    convertDate(dateString){ //Will change the date from "yyyy-MM-dd" to = "dd/MM/yyyy"
      var p = dateString.split(/\D/g);
      return [p[2],p[1],p[0] ].join("/");
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
    updateDate() {
      // console.log(moment(new Date));
      this.axios.put("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId, {
        "Id": this.batchId,
        "Quantity": -1,
        "Active": true,
        "DateStamp": moment(new Date)
      })
			.then((response) => {
          console.log(response);
          alert("Date has been updated");
			})
			.catch((error) => {
				alert(error);
			});
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
