<template>
  <div>
    <b-button @click="showModal" size="sm" style="position: absolute;" variant="outline-primary">
              Change Picture</b-button>
    <b-modal ref="PictureModal" title="Change Batch Picture" size="lg" centered hide-footer>
      <div class="modal-lg">
        <b-button class="myBtn">Add/Edit Image: </b-button>
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
    showModal () {
      this.$refs.PictureModal.show()
    },
    hideModal () {
      this.$refs.PictureModal.hide()
    }
  }
}
</script>

<style scoped>
/* .btn {
  margin-left: 10%;
  text-align: right;
} */

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