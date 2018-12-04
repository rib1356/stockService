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
        <!-- <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus mattis posuere. Praesent nec erat vitae risus mattis maximus. Pellentesque sed interdum dui. Phasellus facilisis lectus sit amet metus feugiat tempus. Curabitur eu erat sed tellus accumsan faucibus. Duis dolor tellus, venenatis quis aliquet non, cursus a arcu. Proin viverra magna et velit vehicula facilisis. Curabitur pretium facilisis magna vel venenatis. Vivamus varius ligula at interdum tincidunt. Maecenas a rutrum sapien. Curabitur a vehicula purus.
Nunc ut interdum dui, in molestie turpis. Pellentesque et leo eros. Cras scelerisque dictum accumsan. Mauris euismod nunc quis augue luctus iaculis. Maecenas lacus dui, vulputate quis nulla ac, dignissim rutrum mauris. Morbi quis nisi eleifend, euismod neque et, aliquam orci. Sed lobortis tincidunt pellentesque. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean augue odio, tristique suscipit pretium eget, egestas quis risus.
Donec sed bibendum ex. Aenean semper turpis erat, fringilla volutpat leo placerat finibus. Suspendisse et semper lacus. Nam leo diam, condimentum nec semper eget, finibus et lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec elementum nulla id auctor eleifend. Praesent efficitur massa a ligula ornare, vitae fringilla quam luctus. Nam placerat, ante at condimentum porttitor, mauris arcu venenatis mauris, id aliquam lorem magna quis odio.
In et scelerisque sapien, non tempus tellus. Sed vel porttitor nibh. Phasellus nec euismod enim, sed consequat enim. Vestibulum fermentum sit amet ex vehicula hendrerit. Nunc sem neque, tempor ut leo sed, lacinia eleifend purus. Nulla aliquam, magna eget porttitor congue, dolor odio tempus purus, id cursus turpis ex et leo. Mauris fermentum est a eros convallis tincidunt. Nullam sed dignissim quam. Praesent tristique nec lorem eget varius.
Etiam vel dapibus metus. Maecenas arcu nisl, finibus finibus neque dignissim, lacinia rhoncus est. Aenean posuere porttitor nulla vitae dapibus. Sed elit risus, posuere non pellentesque eu, viverra ut magna. Nunc quis tristique erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere fermentum leo sed malesuada. Quisque sed lectus laoreet, pulvinar leo at, posuere lectus. Sed cursus ligula non nisl tempor placerat. Mauris elementum interdum ex, vel efficitur augue.</p> -->
        <b-container>
          <b-row>
            <b-col> 
              <p>Main Location</p>
              <b-form-group class="modal__content">
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
              <p>Sub Location</p>
              <b-form-group class="modal__content">
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
      <div class="modal__footer">
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
      <div class="modal__footer">
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
        { text: 'R', value: 'R' },
        { text: 'R', value: 'R' },
        { text: 'R', value: 'R' },
        { text: 'R', value: 'R' },
      ],
      subLocation: [
        { text: 'W1', value: 'W1' },
        { text: 'W2', value: 'W2' },
        { text: 'W3', value: 'W3' },
        { text: 'W4', value: 'W4' },
        { text: 'W5', value: 'W5' },
        { text: 'W5', value: 'W5' },
        { text: 'W5', value: 'W5' },
        { text: 'W5', value: 'W5' },
        { text: 'W5', value: 'W5' },
        { text: 'W5', value: 'W5' },
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
      this.retrieveData();
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
    retrieveData () {
      this.axios.get('https://ahillslocationservice.azurewebsites.net/api/locations')
        .then((response) => {
          console.log(response.data);
      })
        .catch((error) => {
          this.status = error;
      });
    },
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

<style>

.modal {
    display: none;
    position: fixed;
}
.modal.open {
   display: block;
}

.modal__content {
    overflow-y: hidden;
    border-bottom: 1px solid #e9ecef;
    border-top: 1px solid #e9ecef;
    margin-bottom: 5px;
}
::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

</style>