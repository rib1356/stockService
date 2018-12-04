<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
        Change Quantity</b-button>
    <b-modal ref="quantityModal" title="Change Batch Quantity" size="lg" centered hide-footer>
      <div class="modal-lg">
          <p>Quantity: {{quantity}}</p>
          <p>Edit Quantity: &nbsp; <input type="number" name="quantity" id="quantity"></p>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="hideModal">Save Changes</b-btn>
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
      quantity: '',
    }
  },
  methods: {
    showModal () {
      this.$refs.quantityModal.show();
    },
    hideModal () {
      this.$refs.quantityModal.hide();
    },
  },
  mounted() {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.quantity = selectedBatchInformation.quantity;
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