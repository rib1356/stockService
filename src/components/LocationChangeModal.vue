<template>
  <div>
    <b-button @click="showLocationModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Location</b-button>
    <b-modal ref="locationModal" title="Change Batch Location" size="lg" centered hide-footer>
      <!-- Div for the modal body -->
      <div>
        <p>Quantity: <input type="text" v-model="quantity"></p>
      </div>
      <div > 
        <b-container>
          <b-row>
            <b-col> 
              <p>Main Location</p>
              <b-form-group class="modal__content">
                <b-form-radio-group id="mainLocationButtons"
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
        <p>Are the changes to location Correct?</p>
        <p>Old Location: {{oldLocation}}</p>
        <p>New Location: {{selectedMainLocation}}{{selectedSubLocation}} </p>
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
      quantity: '',
      oldLocation: '',
      mainLocations: [],
      subLocations: [],
      disabled: 1,
      status: '',
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
      sessionStorage.setItem("newLocation", newLocation);
      this.$router.go();
      this.$refs.locationConfirmModal.hide();
    },
    retrieveMainLocationData () { //Get all main locations within the database
      this.axios.get('https://ahillslocationservice.azurewebsites.net/api/locations/main')
        .then((response) => {
          this.status = "Retrieving main locations";
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
      this.disabled = 1; //Disable to continue button so a false location cant be selected
      console.log("Main location pressed: disabled=" + this.disabled);
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
    }
  },
  mounted () {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.quantity = selectedBatchInformation.quantity;
    this.oldLocation = selectedBatchInformation.location;
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
    overflow-y: auto;
    border-bottom: 1px solid #e9ecef;
    border-top: 1px solid #e9ecef;
    margin-bottom: 5px;
}
 /* make scrollbar transparent */
::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}

/* Stop background moving when modal is open */
body.modal-open {
    overflow: hidden !important;
    position: fixed;
    width: 100%;
}

body{
  overflow: hidden !important;
}

/* For mobile screens potential for more css in here? */
@media only screen and (max-width : 425px) {
 .modal {
  position: fixed;
  overflow: hidden;
  display: block;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  }
}

</style>