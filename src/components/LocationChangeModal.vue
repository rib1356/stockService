<template>
  <div>
    <b-button @click="showLocationModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Location</b-button>
    <b-modal ref="locationModal" title="Change Batch Location" size="lg" centered hide-footer>
      <!-- Div for the modal body -->
      <div class="modal-lg my-modal"> 
        <p>Quantity: <input type="text" v-model="quantity"></p>
        <b-container>
          <b-row>
            <b-col> 
              <b-form-group label="Main Location">
                <b-form-radio-group id="mainLocationButtons"
                                    v-model="selectedMainLocation"
                                    buttons
                                    button-variant="outline-primary"
                                    :options="mainLocation"
                                    stacked
                                    name="radioMainLoc">
                </b-form-radio-group>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Sub Location">
                <b-form-radio-group id="subLocationButtons"
                                    v-model="selectedSubLocation"
                                    buttons
                                    button-variant="outline-primary"
                                    :options="subLocation"
                                    stacked
                                    name="radioSubLoc">
                </b-form-radio-group>
              </b-form-group>  
            </b-col>   
          </b-row>
        </b-container>
      </div>
      <!-- class="modal-footer" Adds a footer but own css could be used? -->
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideLocationModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="showConfirmModal">Continue</b-btn>
      </div>
    </b-modal>
    <!-- A new modal is created to allow the user to confirm their changes -->
    <div>
      <b-modal ref="locationConfirmModal" title="Confirm Location Change" size="lg" centered hide-footer>
        <div class="modal-lg">
        <p>Are the changes to location Correct?</p>
        <p>Old Location: {{oldLocation}}</p>
        <p>New Location: Main-{{selectedMainLocation}} || Sub-{{selectedSubLocation}} </p>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="showLocationModal">Back</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="hideConfirmModal">Save Changes</b-btn>
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
      mainLocation: [
        { text: 'West', value: 'West' },
        { text: 'East', value: 'East' },
        { text: 'MBE', value: 'MBE' },
        { text: 'MBS', value: 'MBS' },
        { text: 'MBW', value: 'MBW' },
        { text: 'R', value: 'R' },
      ],
      subLocation: [
        { text: 'W1', value: 'W1' },
        { text: 'W2', value: 'W2' },
        { text: 'W3', value: 'W3' },
        { text: 'W4', value: 'W4' },
        { text: 'W5', value: 'W5' },
      ],
    }
  },
  components: {
    DeleteBatchModal,
  },
  methods: {
    showLocationModal () {
      console.log("Opening Modal");
      this.$refs.locationModal.show();
      console.log("Modal Open");
    },
    hideLocationModal () {
      this.$refs.locationModal.hide();
    },
    showConfirmModal () {
      this.$refs.locationConfirmModal.show();
      console.log("Selected:" + this.selected);
    },
    hideConfirmModal () {
      this.$refs.locationConfirmModal.hide();
    },
    testModal () {
      console.log("Save Pressed in LocChange");
      this.$refs.locationModal.hide();
    },
  },
  mounted () {
    this.$root.$on('LocationChangeModal',() => { //test CREATED()
    // setTimeout(this.showModal, 1000);
    this.showLocationModal();   
    console.log("IN MOUNTED");
    });
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.quantity = selectedBatchInformation.quantity;
    this.oldLocation = selectedBatchInformation.location;
  },
  created: function () {
    
  }
}
</script>

<style >

/* .btn {
  margin-left: 10%;
  text-align: right;
} */

/* .my-modal .modal-body {
  max-height: 60vh;
  overflow-y: auto;
} */

</style>