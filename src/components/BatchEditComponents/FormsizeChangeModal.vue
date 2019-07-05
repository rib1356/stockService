<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Form Size</b-button>
    <b-modal ref="formSizeModal" title="Change Batch Form Size" size="lg" centered hide-footer>
      <b-alert :show="newBatchNeeded" >This will change saleable quantity and will create a new batch when a location is chosen</b-alert>
      <!-- Div for the modal body -->
      <div class="block">
        <!-- Form validation -->
        <label>Allocated Qty: {{allocatedQty}} </label><br>
        <label>Growing Qty: {{growingQty}}</label><br>
        <label for="quantity">Saleable Qty: </label>
        <input  v-validate="'required|numeric|min_value:1'" 
                name="quantity"
                id="quantity" 
                v-model="quantity" 
                class="form-control" 
                placeholder="Edit Quantity"
                type="number"
                pattern="[0-9]*"
                inputmode="numeric"
                @keyup="validationCheck">
        <p class="text-danger" v-if="errors.has('quantity')">{{ errors.first('quantity') }}</p>
        <br>
        <b-checkbox v-model="manualEdit">Manually enter formsize?</b-checkbox>
        <input v-if="manualEdit" v-model="manualForm" class="form-control" placeholder="Change formsize">
      </div>
      <div>   
        <b-container>
          <b-row>
            <b-col>
              <!-- <p>New Form Size</p> -->
              <b-form-group class="modal__content">
                <b-form-radio-group id="newFormSizeButtons"
                                    v-model="selectedFormSize"
                                    buttons
                                    button-variant="outline-primary"
                                    :options="formSizes"
                                    stacked
                                    name="radioNewFormSize"
                                    @input="validationCheck">
                                    <p>{{status}}</p>
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
        <p v-if="manualEdit">New manual form size: {{manualForm}}</p>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="showModal">Back</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="saveFormSizes">Save Changes</b-btn>
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
      Sku: '',
      status: '',
      originalQuantity: '',
      formSizes: [],
      batchId: '',
      newBatchNeeded: false,
      disabled: 1,
      allocatedQty: '',
      growingQty: '',
      manualEdit: false,
      manualForm: '',
    }
  },
  methods: {
    showModal() {
      this.$refs.formSizeModal.show();
      this.getFormSizes();
    },
    hideModal() {
      this.$refs.formSizeModal.hide();
    },
    hideConfirmModal() {
      this.$refs.formSizeConfirmModal.hide();
    },
    continueOrSave() {
      if(this.quantity == this.originalQuantity){ 
        this.$refs.formSizeConfirmModal.show(); //If the quantity hasnt changed confirm the form size change
      } else {
        sessionStorage.setItem("newQuantity", this.quantity);
        sessionStorage.setItem("newFormSize", this.selectedFormSize);
        sessionStorage.setItem("newManualFormSize". this.manualForm);
        this.$root.$emit('LocationChangeModal'); //Else the changed quantity need to be a new batch, therefore set to a new location
      }
    },
    getFormSizes() {
      this.status = "Retrieving form sizes";
      this.axios.get('https://ahillsplantservice.azurewebsites.net/api/FormSizes?sku=' + this.Sku)
        .then((response) => {
          this.transformData(response.data);
          this.status = '';
      })
        .catch((error) => {
          alert(error);
      });
    },
    transformData(data) {
      if(this.formSizes.length <= 0) //If array doesnt already have data put in the plant formsize
      {
        for(var i = 0; i < data.length; i++){
          var potSize;
          var RootType;
          //String modifying so that it reads more like "FormSizes"
          if (data[i].PotSize == 0) { //If the pot size = 0 it is a RB/BR/WRB so hide the potsize
            potSize = "";
            RootType = data[i].RootType;
          } else if (data[i].RootType == "CG") {
            potSize = "C" + data[i].PotSize;
            RootType = "";
          } else {
            potSize = "AP" + data[i].PotSize;
            RootType = ""
          }
          var formSize = potSize
                        + " " + data[i].HeightSpread
                        + " " + data[i].Girth
                        + " " + data[i].Age 
                        + " " + RootType
                        + " " + data[i].Description
            this.formSizes.push({
              "text": formSize.trim().replace(/  +/g, ' '), //Remove any whitespace in the form sizes
              "value": formSize.trim().replace(/  +/g, ' '),
            });
        }
      } else {
        //Do nothing
      }
    },
    updateFormSize() {
      sessionStorage.setItem("newFormSize", this.selectedFormSize); //Save the new location to session storage
      this.$root.$emit('BatchInformation'); //Call the update location method to change the visible location of that batch
    },
    saveFormSizes() {
      this.updateFormSize();
      this.hideConfirmModal();
      var formsize;
      if(this.manualEdit) {
        formsize = this.manualForm;
      } else {
        formsize = this.selectedFormSize;
      }
      let data = { "Id": this.batchId, "FormSize": formsize, "Quantity": -1, "Active": true, "DateStamp": null};
      this.axios.put("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId, data)
			  .then((response) => {
          console.log(response);    
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
      //If no validation errors and a formsize is selected enable button
      if (!this.errors.any() && this.selectedFormSize != '') {
        this.disabled = 0;
        this.manualEdit = false;
        this.manualForm = '';
      } else {
        this.disabled = 1;
      }
    },
  },
  mounted () {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.batchId = selectedBatchInformation.batchId;
    this.quantity = selectedBatchInformation.quantity;
    this.growingQty = selectedBatchInformation.growingQuantity;
    this.allocatedQty = selectedBatchInformation.allocatedQuantity;
    this.originalQuantity = selectedBatchInformation.quantity;
    this.oldFormSize = selectedBatchInformation.formSize;
    this.Sku = selectedBatchInformation.Sku;
  },
  watch: {
    manualEdit: function() {
      if(this.manualEdit) {
        this.disabled = 0;
        this.selectedFormSize = '';
      } else {
        this.disabled = 1;
        this.manualForm = '';
      }
    }
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

.block label { 
  display: inline-block;  
  text-align: right; 
  }

.form-control {
  width: 50%;
  display: inline-block;
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