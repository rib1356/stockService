<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Comment</b-button>
    <b-modal ref="commentModal" title="Change Batch Comment" size="lg" centered hide-footer no-close-on-backdrop>
      <div class="modal-lg">
        <b-form-input v-model="comment"
				    					placeholder="Enter a batch comment (can be nothing)"
						    			name="comment"></b-form-input>	
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="saveBatchPrice">Save Changes</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'CommentModal',
  data () {
    return {
      batchId: '',
      comment: null,
    }
  },
  methods: {
    showModal () {
      this.$refs.commentModal.show()
    },
    hideModal () {
      this.$refs.commentModal.hide()
    },
    saveBatchPrice() {
      let data = { "Id": this.batchId, "Comment": this.comment, "Quantity": -1, "Active": true, "DateStamp": null};
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
  mounted() {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
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