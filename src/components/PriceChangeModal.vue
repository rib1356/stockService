<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Price</b-button>
    <b-modal ref="PriceModal" title="Change Batch Price" size="lg" centered hide-footer>
      <div class="modal-lg">
        <p>Buying Price Minimum: £0.00</p>
        <p>Buying Price Maximum: £0.00</p>
        <p>Selling Price Minimum: £0.00</p>
        <p>Selling Price Maximum: £0.00</p>
        <p>Set new selling price: <input type="text" name="price" id="price"></p>
      </div>
      <div>
        <b-btn class="mt-3" variant="outline-danger" @click="hideModal">Cancel</b-btn>
        <b-btn class="mt-3" variant="outline-primary" @click="hideModal">Save Changes</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'PriceChangeModal',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    showModal () {
      this.$refs.PriceModal.show()
    },
    hideModal () {
      this.$refs.PriceModal.hide()
    }
  }
}
</script>

<style scoped>
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