<template>
  <div>
    <b-button @click="showLocationModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Location</b-button>
    <b-modal ref="locationModal" title="Change Batch Location" size="lg" centered hide-footer>
      <b-alert :show="createNewBatch" >Quantity changed, this will create a new batch at chosen location</b-alert>
      <!-- Div for the modal body -->
      <div>
        <p>Quantity: <input type="text" v-model="quantity" @keyup="quantityCheck"></p>
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
                                    @input="subSelected"
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
        <p v-if="createNewBatch">Creating a new batch at {{selectedMainLocation}}{{selectedSubLocation}}
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

  import DeleteBatchModal from '@/components/DeleteBatchModal';

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
      disabled: 1,
      status: '',
      batchId: '',
      createNewBatch: false,
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
      if(this.createNewBatch){ //If a new batch needs to be created because the quantities are different
        console.log("create new batch") //add the code to call a new batch create here
        //worth routing back to the main table
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
      if(this.mainLocations.length <= 0) //If array doesnt already have data format data show on radio buttons
      {
        for(var i = 0; i < data.length; i++){
          this.mainLocations.push({ //Create an array of objects
            "text": data[i],
            "value": data[i]
          });
        }
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
    subSelected() {
      if(this.selectedSubLocation != ''){ //Disable button until sublocation is selected
        this.disabled = 0;
      }
    },
    saveDbLocation(newLocation) { //Save the new location of the batch in the database
      var url = ("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId); 
      let data = { "Id": this.batchId, "Location": newLocation};
      this.axios.put(url, data)
			  .then((response) => {
          console.log(response);
			  })
			.catch((error) => {
				alert(error);
			});
    },
    quantityCheck() {
      if(this.quantity != this.originalQuantity) {
        this.createNewBatch = true;
      } else {
        this.createNewBatch = false;
      }
    }
  },
  mounted () {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.originalQuantity = selectedBatchInformation.quantity;
    this.quantity = selectedBatchInformation.quantity;
    this.oldLocation = selectedBatchInformation.location;
    this.batchId = selectedBatchInformation.batchId;
  },
  beforeCreate () {
    this.$root.$on('LocationChangeModal',() => { //test CREATED()
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