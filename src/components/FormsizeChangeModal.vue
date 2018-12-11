<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Form Size</b-button>
    <b-modal ref="formSizeModal" title="Change Batch Form Size" size="lg" centered hide-footer>
      <!-- Div for the modal body -->
      <div>
        <p>Quantity: <input type="text"  v-model="quantity"></p>
      </div>
      <div>   
        <b-container>
          <b-row>
            <b-col>
              <p>New Form Size</p>
              <b-form-group class="modal__content">
                <b-form-radio-group id="newFormSizeButtons"
                                    v-model="selectedFormSize"
                                    buttons
                                    button-variant="outline-primary"
                                    :options="newFormSize"
                                    stacked
                                    name="radioNewFormSize">
                </b-form-radio-group>
              </b-form-group>  
            </b-col>   
          </b-row>
        </b-container>
      </div>
      <div class="modal__footer">
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="continueOrSave">Continue</b-btn>
      </div>
    </b-modal>
    <div>
      <b-modal ref="formSizeConfirmModal" title="Confirm Form Size Change" size="lg" centered hide-footer>
        <div class="modal__content">
        <p>Are the changes to form size Correct?</p>
        <p>Old form size: {{oldFormSize}} </p>
        <p>New form size: {{selectedFormSize}}</p>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="showModal">Back</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="hideConfirmModal">Save Changes</b-btn>
      </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormsizeChangeModal',
  data () {
    return {
      selected: 'Group1',
      oldFormSize: '',
      selectedFormSize: '',
      quantity: '',
      originalQuantity: '',
      newFormSize: [
        { text: 'C2 20-30', value: 'C2-20' },
        { text: 'C2 30-40', value: 'C2-30' },
        { text: 'C2 40-60', value: 'C2-40' },
        { text: 'C3 20-30', value: 'C3-20' },
        { text: 'C3 40-60', value: 'C3-40' },
        { text: 'C5 20-30', value: 'C5-20' },
        { text: 'C5 30-40', value: 'C5-30' },
        { text: 'C5 40-60', value: 'C5-40' },
        { text: 'C10 60-80', value: 'C10-60' },
        { text: 'C10 80-100', value: 'C10-80' },
        { text: 'C10 100-120', value: 'C10-100' },
      ],
    }
  },
  methods: {
    showModal () {
      this.$refs.formSizeModal.show();
    },
    hideModal () {
      this.$refs.formSizeModal.hide();
    },
    hideConfirmModal () {
      this.$refs.formSizeConfirmModal.hide();
    },
    continueOrSave () {
      if(this.quantity == this.originalQuantity){ 
        this.$refs.formSizeConfirmModal.show(); //If the quantity hasnt changed confirm the form size change
      } else {
        console.log("Trying to open modal");
        this.$root.$emit('LocationChangeModal'); //Else the changed quantity need to be a new batch, therefore set to a new location
      }
    },
  },
  mounted () {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.quantity = selectedBatchInformation.quantity;
    this.originalQuantity = selectedBatchInformation.quantity;
    this.oldFormSize = selectedBatchInformation.formSize;
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
    border-bottom: 1px solid #e9ecef !important;
    border-top: 1px solid #e9ecef;
    margin-bottom: 5px;
    -webkit-overflow-scrolling: touch;
}
 /* make scrollbar transparent */
::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}

/* Stop background moving when modal is open */
body.modal-open {
    overflow: hidden;
    /* position: fixed; */
}

body{
  overflow: hidden !important;
  position: fixed;
}

/* For mobile screens potential for more css in here? */
@media only screen and (max-width : 768px) {
 .modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  }
}

</style>