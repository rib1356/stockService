<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Form Size</b-button>
    <b-modal ref="formSizeModal" title="Change Batch Form Size" size="lg" centered hide-footer>
      <!-- Div for the modal body -->
      <div class="modal-lg my-modal"> 
        <p>Quantity: <input type="text"  v-model="quantity"></p>
        <b-container>
          <b-row>
            <b-col> 
              <b-form-group label="Form Size Group">
                <b-form-radio-group id="groupFormSizeButtons"
                                    v-model="selected"
                                    buttons
                                    button-variant="outline-primary"
                                    :options="formSizeGroups"
                                    stacked
                                    name="radioFormSizeGroup">
                </b-form-radio-group>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="New Form Size">
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
      <div>
        <b-btn class="mt-3" variant="outline-primary" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="continueOrSave">Continue</b-btn>
      </div>
    </b-modal>
    <div>
      <b-modal ref="formSizeConfirmModal" title="Confirm Form Size Change" size="lg" centered hide-footer>
        <div class="modal-lg">
        <p>Are the changes to form size Correct?</p>
        <p>Old form size: {{oldFormSize}} </p>
        <p>New form size: {{selectedFormSize}}</p>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-primary" @click="showModal">Back</b-btn>
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
      formSizeGroups: [
        { text: 'Group1', value: 'Group1' },
        { text: 'Group2', value: 'Group2' },
        { text: 'Group3', value: 'Group3' },
      ],
      newFormSize: [
        { text: 'C2 20-30', value: 'C2-20' },
        { text: 'C2 30-40', value: 'C2-30' },
        { text: 'C2 40-60', value: 'C2-40' },
        { text: 'C3 20-30', value: 'C3-20' },
        { text: 'C3 40-60', value: 'C3-40' },
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