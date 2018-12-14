<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
        Change Quantity</b-button>
    <b-modal ref="quantityModal" title="Change Batch Quantity" size="lg" centered hide-footer>
      <div class="modal-lg">
          <div class="form-group" :class="{'has-error': errors.has('quantity') }" >
            <label class="control-label" for="quantity">Quantity: {{originalQuantity}}</label>
            <input v-validate="'numeric|min_value:1|required'" name="quantity" id="quantity" v-model="quantity" class="form-control" placeholder="Edit Quantity">
            <p class="text-danger" v-if="errors.has('quantity')">{{ errors.first('quantity') }}</p>
          </div>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="validateBeforeSubmit">Save Changes</b-btn>
      </div>
    <!-- <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-btn>   -->
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
      var url = ("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId); 
      let data = { "Id": this.batchId, "Quantity": parseInt(this.quantity)};
      this.axios.put(url, data)
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
    height: 20vh;
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