<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Price</b-button>
    <b-modal ref="PriceModal" title="Change Batch Price" size="lg" centered hide-footer>
      <div class="modal-lg">
        <p>Previous selling price £{{computedPrice}}</p>
        <p>Set new selling price: £
          <input name="batchPrice"
                 v-model="batchPrice"
                 v-validate="'required|decimal:2|min_value:0.01'">
        </p>
        <p class="text-danger" v-if="errors.has('batchPrice')">{{ errors.first('batchPrice') }}</p>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="validateBeforeSubmit">Save Changes</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'PriceChangeModal',
  data () {
    return {
      batchPrice: '',
      previousPrice: '',
      batchId: '',
    }
  },
  methods: {
    showModal () {
      this.$refs.PriceModal.show()
    },
    hideModal () {
      this.$refs.PriceModal.hide()
    },
    validateBeforeSubmit(e) { //Check that all validation passes before adding
			this.$validator.validateAll();
      if (!this.errors.any()) { 
          this.saveBatchPrice(); 
      }
		},
    saveBatchPrice() {
      let data = { "Id": this.batchId, "WholesalePrice": parseFloat(this.batchPrice)*100, "Quantity": -1, "Active": true, "DateStamp": null};
      this.axios.put("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId, data)
			  .then((response) => {
          console.log(response);
          this.$router.push('StockTable');
			  })
			.catch((error) => {
				alert(error);
			});
    },
  },
   computed: {
    computedPrice () { ///Whenever total value is shown this will format to look monitary
      return (this.previousPrice/100).toFixed(2);
		},
  },
  mounted() {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    // this.batchPrice = selectedBatchInformation.batchPrice;
    this.previousPrice = selectedBatchInformation.batchPrice;
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

</style>