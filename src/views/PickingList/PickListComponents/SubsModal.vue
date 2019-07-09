<template>
  <div>
    <b-button size="sm" @click="openSubModal" style="margin-left: 5px;">Subsitute</b-button>
    <b-modal :ref='"SubModal"' size="lg" no-close-on-backdrop hide-footer title="Select batches to pick from">
      You can choose subsitutes from this model
            <!-- <b-button variant="outline-primary" block @click="boop">Use selected batches</b-button> -->
      <b-button variant="outline-danger" block @click="hideModal">Close Me</b-button>
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
      openSubModal() {
        this.$refs.SubModal.show();
      },
      hideModal() {
        this.$refs.SubModal.hide();
      }
    }
  }
</script>

<style scoped>

</style>