<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
        Change Quantity</b-button>
    <b-modal ref="quantityModal" title="Change Batch Quantity" size="lg" centered hide-footer>
      <div class="modal-lg">
          <div>
            <!-- Form Validation -->
            <label class="control-label" for="quantity">Quantity: {{originalQuantity}}</label>
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
          </div>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" :disabled="disabled == 1 ? true : false"
               variant="outline-primary" @click="validateBeforeSubmit">Save Changes</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'QuantityChangeModal',
  data () {
    return {
      originalQuantity: '',
      quantity: '',
      batchId: '',
      disabled: 1,
    }
  },
  methods: {
    showModal () {
      this.$refs.quantityModal.show();
    },
    hideModal () {
      this.$refs.quantityModal.hide();
    },
    validateBeforeSubmit(e) { //Check that all validation passes before saving
      this.$validator.validateAll();
        if (!this.errors.any()) {
            this.saveChanges();
        }
    },
    validationCheck() {
      this.$validator.validateAll();
        if (!this.errors.any()) {
          this.disabled = 0;
        } else {
          this.disabled = 1;
        }
    },
    saveChanges () { //When button pressed show location change and change db
      this.updateBatchQuantity();
      this.saveDbQuantity()
      this.$refs.quantityModal.hide()
    },
    updateBatchQuantity() {
      sessionStorage.setItem("newQuantity", this.quantity); //Save the new location to session storage
      this.$root.$emit('BatchInformation'); //Call the update location method to change the visible location of that batch
    },
    saveDbQuantity() {
      let data = { "Id": this.batchId, "Quantity": parseInt(this.quantity), "Active": true , "DateStamp": null};
      this.axios.put("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId, data)
			  .then((response) => {
          console.log(response);
			  })
			.catch((error) => {
				alert(error);
			});
    },
  },
  mounted() {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.originalQuantity = selectedBatchInformation.quantity;
    this.quantity = selectedBatchInformation.quantity;
    this.batchId = selectedBatchInformation.batchId;
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

.modal-lg { /*Used to overwrite the size of the modal */
    height: 30vh;
}

p {
  margin-left: 10px;
  /* vertical-align: middle;
  line-height: 250px;   */
}
.para {
  padding: 15% 0;
}

</style>