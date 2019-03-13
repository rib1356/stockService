<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Delete Batch</b-button>
    <b-modal ref="DeleteModal" title="Delete Batch" size="lg" centered hide-footer>
      <div>
        <p>Are you sure you want to delete this batch?</p>
        <p>Name: {{plantName}}</p>
        <p>Location: {{location}}</p>
        <p>Reason?: <input type="text" name="reason" id="reason"></p>
        <!-- <p>Quantity: <input type="number" v-model="quantity" :max="quantity"></p> -->
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="deleteBatch">Save Changes</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'DeleteBatchModal',
  data () {
    return {
      plantName: '',
      location: '',
      quantity: '',
      batchId: '',
      active: '',
     }
  },
  methods: {
    showModal () {
      this.$refs.DeleteModal.show();
    },
    hideModal () {
      this.$refs.DeleteModal.hide();
      this.quantity = '';
    },
    deleteBatch (){
      var url = ("https://ahillsbatchservice.azurewebsites.net/api/Batches/" + this.batchId); 
      let data = { "Id": this.batchId, "Active": false} ;
      this.axios.put(url, data)
			  .then((response) => {
          console.log(response);
          sessionStorage.removeItem('selectedBatchInformation');
          sessionStorage.removeItem('batchInMemory');
				  this.$router.push('StockTable');
			  })
			.catch((error) => {
				alert(error);
			});
    }
  },
  mounted() {
    this.$root.$on('DeleteBatchModal',() => {
      this.showModal();      
    });
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.plantName = selectedBatchInformation.plantName; 
    this.location = selectedBatchInformation.location;
    this.quantity = selectedBatchInformation.quantity;
    this.batchId = selectedBatchInformation.batchId;
    this.active = selectedBatchInformation.active;
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
/* .btn {
  margin-left: 10%;
  text-align: right;
} */

/* .modal-body {
  max-width: 150vh;
}

.modal-dialog {
  width: 40% !important;
  height: 80% !important;
}
 
.modal-content {
    /* 80% of window height */

</style>