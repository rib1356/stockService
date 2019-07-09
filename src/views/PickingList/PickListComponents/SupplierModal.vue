<template>
  <div>
    <b-button size="sm" @click="openSupModal">Supplier</b-button>
    <b-modal :ref='"SupModal"' size="lg" no-close-on-backdrop hide-footer title="Select batches to pick from">
      You can choose from a supplier in this one
            <!-- <b-button variant="outline-primary" block @click="boop">Use selected batches</b-button> -->
      <div>
        <b-button variant="outline-danger" block @click="hideModal">Close Me</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      openSupModal() {
        this.$refs.SupModal.show();
      },
      hideModal() {
        this.$refs.SupModal.hide();
      }
    }
  }
</script>

<style scoped>

</style>