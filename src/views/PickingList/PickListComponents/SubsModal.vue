<template>
  <div>
    <b-button size="sm" @click="openSubModal" style="margin-left: 5px;">Subsitute</b-button>
    <b-modal :ref='"SubModal"' size="lg" no-close-on-backdrop hide-footer title="Select batches to pick from">
      You can choose subsitutes from this model
      <input type="number" v-model="values">
      <b-button variant="outline-primary" block @click="allocateItems">Use selected batches</b-button>
      <b-button variant="outline-danger" block @click="hideModal">Close Me</b-button>
    </b-modal>
  </div>
</template>

<script>
  export default {
    props: ['rowInfo'],
    data() {
      return {
        values: '',
      }
    },
    methods: {
      openSubModal() {
        this.$refs.SubModal.show();
        console.log(this.rowInfo)
      },
      hideModal() {
        this.$refs.SubModal.hide();
      },
      allocateItems() {
        this.rowInfo.QuantityOutstanding += parseInt(this.values);
        this.hideModal();
      }
    }
  }
</script>

<style scoped>

</style>