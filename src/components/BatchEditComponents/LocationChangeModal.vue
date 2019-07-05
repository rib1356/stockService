<template>
  <div>
    <b-button @click="showLocationModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Location</b-button>
    <b-modal ref="locationModal" title="Change Batch Location" size="lg" centered hide-footer>
      <b-alert :show="newBatchNeeded" >This will change saleable quantity and will create a new batch when a location is chosen</b-alert>
      <!-- Div for the modal body -->
      <div class="block">
        <!-- Form validation -->
        <label>Allocated Qty: {{allocatedQuantity}} </label><br>
        <label>Growing Qty: {{growingQuantity}}</label><br>
        <label for="quantity">Saleable Qty:</label>
        <input  v-validate="'required|numeric|min_value:1'" 
                name="quantity"
                id="quantity" 
                v-model="quantity" 
                class="form-control" 
                placeholder="Edit Quantity"
                type="number"
                pattern="[0-9]*"
                inputmode="numeric"
                :disabled="formSizeChanged == 1 ? true : false"
                @keyup="validationCheck">
        <p class="text-danger" v-if="errors.has('quantity')">{{ errors.first('quantity') }}</p>
      </div>
      <div > 
        <b-container>
          <b-row>
            <b-col> 
              <p>Main Location</p>
              <b-form-group class="modal__content">
                <b-form-radio-group id="mainLocationButtons"
                                    class="myRadioButton"
                                    v-model="selectedMainLocation"
                                    buttons
                                    button-variant="outline-primary"
                                    :options="mainLocations"
                                    stacked
                                    name="radioMainLoc"
                                    @input="getSelectedSubLocations"
                                    > <p>{{status}}</p>
                </b-form-radio-group>
              </b-form-group>
            </b-col>
            <b-col>
              <p>Sub Location</p>
              <b-form-group class="modal__content">
                <b-form-radio-group id="subLocationButtons"
                                    v-model="selectedSubLocation"
                                    class="myRadioButton"
                                    buttons
                                    button-variant="outline-primary"
                                    :options="subLocations"
                                    stacked
                                    name="radioSubLoc"
                                    @input="validationCheck"
                                    >
                </b-form-radio-group>
              </b-form-group>  
            </b-col>   
          </b-row>
        </b-container>
      </div>
      <!-- class="modal-footer" Adds a footer but own css could be used? -->
      <div class="modal__footer">
        <b-btn class="mt-3" variant="outline-danger" @click="hideLocationModal">Cancel</b-btn>
        <b-btn class="mt-3" :disabled="disabled == 1 ? true : false" variant="outline-primary" @click="showConfirmModal">Continue</b-btn>
      </div>
    </b-modal>
    <!-- A new modal is created to allow the user to confirm their changes -->
    <div>
      <b-modal ref="locationConfirmModal" title="Confirm Location Change" size="lg" centered hide-footer>
        <div class="modal-lg">
        <p >Are the changes to location Correct?</p>
        <p>Old Location: {{oldLocation}}</p>
        <p v-if="newBatchNeeded">Creating a new batch at {{selectedMainLocation}}{{selectedSubLocation}}
           where Quantity = {{quantity}}</p>
        <p v-else>New Location: {{selectedMainLocation}}{{selectedSubLocation}} </p>
      </div>
      <div class="modal__footer">
        <b-btn class="mt-3" variant="outline-danger" @click="showLocationModal">Back</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="SaveLocation">Save Changes</b-btn>
      </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import DeleteBatchModal from '@/components/BatchEditComponents/DeleteBatchModal';
import moment from 'moment';
export default {
  name: 'LocationChangeModal',
  data () {
    return {
      selectedMainLocation: '',
      selectedSubLocation: '',
      originalQuantity: '',
      quantity: '',
      oldLocation: '',
      mainLocations: [],
      subLocations: [],
      batchId: '',
      Sku: '',
      name: '',
      formSize: '',
      disabled: 1,
      status: '',
      newBatchNeeded: false,
      formSizeChanged: false,
      growingQuantity: '',
      allocatedQuantity: '',
      wholesalePrice: '',
    }
  },
  components: {
    DeleteBatchModal,
  },
  methods: {
    showLocationModal () {
      this.$refs.locationModal.show();
      this.retrieveMainLocationData();
    },
    hideLocationModal () {
      this.$refs.locationModal.hide();
      this.mainLocations = []; //Reset main location array so it doesnt become repopulated
    },
    showConfirmModal () {
      this.$refs.locationConfirmModal.show();
    },
    SaveLocation () {
      var newLocation = this.selectedMainLocation + this.selectedSubLocation;
      var newQuantity = this.originalQuantity - this.quantity;
      if(this.newBatchNeeded){ //If a new batch needs to be created because the quantities are different
        this.createNewBatch(newLocation); //Create a duplicate batch with a new quantity 
        this.editCurrentBatchQuantity(newQuantity); //Update the quantity of the original batch
      } else { //Change the location of the batch
        this.saveDbLocation(newLocation);
        sessionStorage.setItem("newLocation", newLocation); //Save the new location to session storage
        this.$root.$emit('BatchInformation'); //Call the update location method to change the visible location of that batch
      }
      this.$refs.locationConfirmModal.hide();
    },
    retrieveMainLocationData () { //Get all main locations within the database
      this.status = "Retrieving main locations";
      this.axios.get('https://ahillslocationservice.azurewebsites.net/api/locations/main')
        .then((response) => {
          this.transformMainLocationData(response.data);
      })
        .catch((error) => {
          alert(error);
      });
    },
    transformMainLocationData(data) { //Transform the incoming data so it can be displayed as radio buttons
      this.status = '';
      //If main locations arent null it means that they exist
      //load values from session storage and populate array, this means that the locations wont be called
      if(sessionStorage.getItem('mainLocations') != null) {
        console.log("Mainlocations exist");
        this.mainLocations = JSON.parse(sessionStorage.getItem('mainLocations'));
      }
      else if(this.mainLocations.length <= 0) //If array doesnt already have data format data show on radio buttons
      {
        for(var i = 0; i < data.length; i++){
          this.mainLocations.push({ //Create an array of objects
            "text": data[i], //Data coming in is string so just assign values in object
            "value": data[i]
          });
        }
        sessionStorage.setItem('mainLocations', JSON.stringify(this.mainLocations));
        console.log("locations loaded from db and saved to session")
      } else {
        //Do nothing
      }
    },
    getSelectedSubLocations() { //When a main location is pressed query the server for the sub locations under that main location
      this.disabled = 1; //Disable continue button so a false location cant be selected
      this.selectedSubLocation = ''; //Reset the selected sub location so it can be chosen again
      this.axios.get('https://ahillslocationservice.azurewebsites.net/api/locations?main=' + this.selectedMainLocation)
        .then((response) => {
          this.transformSubLocationData(response.data);
      })
        .catch((error) => {
          alert(error);
      });
    },
    transformSubLocationData(data) { //Transform the incoming data so it can be displayed as radio buttons
        //Check if active === true before displaying all the values
        this.subLocations = [];
        for(var i = 0; i < data.length; i++){
          this.subLocations.push({
            "text": data[i].SubLocation,
            "value": data[i].SubLocation
          });
        }
    },
    saveDbLocation(newLocation) { //Save the new location of the batch in the database
      let data = { "Id": this.batchId, "Location": newLocation, "Quantity": -1, "Active": true , "DateStamp": null};
      this.axios.put("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId, data)
			  .then((response) => {
          console.log(response);
			  })
			.catch((error) => {
				alert(error);
			});
    },
    createNewBatch(newLocation) { //Create a new batch with the new location and quantity
      var form;
      if(this.formSize == ""){ //If the form size has manually been entered use that one when creating a new batch
        form = this.manualFormSize;
      } else {
        form = this.formSize;
      }
      this.axios.post('https://ahillsbatchservice.azurewebsites.net/api/Batches', {
        "Sku": this.Sku,
				"Name": this.name,
				"FormSize": form,
				"Location": newLocation,
				"Quantity": this.quantity,
				"WholesalePrice": this.wholesalePrice,
        "ImageExists": false,
        "GrowingQuantity": 0,
        "AllocatedQuantity": 0,
        "DateStamp": moment(new Date),
				"Active": true,
			})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
      });
    },
    editCurrentBatchQuantity(newQuantity) {
      this.axios.put("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId, {
        "Id": this.batchId,
        "Quantity": parseInt(newQuantity),
        "Active": true,
        "DateStamp": null
      })
			.then((response) => {
        console.log(response);
        this.$router.push('StockTable')
			})
			.catch((error) => {
				alert(error);
			});
    },
    validationCheck() { 
      //If quantities are different display alert
      if(this.quantity != this.originalQuantity) {
        this.newBatchNeeded = true;
      } else {
        this.newBatchNeeded = false;
      }
      this.$validator.validateAll();
      //If no validation errors and a sub location is selected enable button
      if (!this.errors.any() && this.selectedSubLocation != '') {
        this.disabled = 0;
      } else {
        this.disabled = 1;
      }
    },
  },
  mounted () {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.originalQuantity = selectedBatchInformation.quantity;
    this.quantity = selectedBatchInformation.quantity;
    this.wholesalePrice = selectedBatchInformation.batchPrice;
    this.growingQuantity = selectedBatchInformation.growingQuantity;
    this.allocatedQuantity = selectedBatchInformation.allocatedQuantity;
    this.oldLocation = selectedBatchInformation.location;
    this.batchId = selectedBatchInformation.batchId;
    this.Sku = selectedBatchInformation.Sku;
    this.name = selectedBatchInformation.plantName;
    this.formSize = selectedBatchInformation.formSize;
  },
  beforeCreate () {
    this.$root.$on('LocationChangeModal',() => { //test CREATED()
    this.quantity = sessionStorage.getItem('newQuantity');
    this.formSize = sessionStorage.getItem('newFormSize');
    this.manualFormSize = sessionStorage.getItem('manualFormSize');
    this.formSizeChanged = 1;
    this.showLocationModal();   
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

.modal__content {
    overflow-y: scroll;
    border-bottom: 1px solid #e9ecef;
    border-top: 1px solid #e9ecef;
    margin-bottom: 5px;
    -webkit-overflow-scrolling: touch;
}
 /* make scrollbar transparent */
::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}

.modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.block label { 
  display: inline-block;  
  text-align: right; 
  }

.form-control {
  width: 50%;
  display: inline-block;
}
/* Stop background moving when modal is open */
/* body.modal-open {
    overflow: hidden !important;
    position: fixed;
    width: 100%;
}

html,
body {
    overflow: hidden;
    position: relative;
    height: 100%;
} */

/* For mobile screens potential for more css in here? */
@media only screen and (max-width : 425px) {
 /* .modal__content {
    /* overflow: hidden !important; */
    /* position: fixed; */
    /* width: 100%; */
    /* height: 100%; */
    /* height: 60vh;
    } */
  /* .modal__content {
    height: 55vh;
     max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .modal {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}  */


}

.myRadioButton {
   width: 100px;
}

</style>