<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Picture</b-button>
    <b-modal ref="PictureModal" title="Change Batch Picture" size="lg" centered hide-footer>
      <div class="modal__content">
        <!-- <b-button class="myBtn" @click="openCamera">Add/Edit Image: </b-button> -->
        <input type="file" accept="image/*">
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
  name: 'PictureChangeModal',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    showModal() {
      this.$refs.PictureModal.show()
    },
    hideModal() {
      this.$refs.PictureModal.hide()
    },
  }
}
</script>

<style scoped>
/* .btn {
  margin-left: 10%;
  text-align: right;
} */
.modal {
    display: none;
    position: fixed;
}
.modal.open {
   display: block;
}
.myBtn {
  margin-left: 0px;
}


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