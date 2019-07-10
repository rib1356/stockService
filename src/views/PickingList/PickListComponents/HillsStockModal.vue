<template>
  <div>
    <b-button size="sm" @click="openHSModal" style="margin-left: 5px;">Hills</b-button>
    <b-modal :ref='"HillsStockModal"' size="lg" no-close-on-backdrop hide-footer title="Select batches to pick from">
      <p>Quantity Needed: {{rowInfo.Quantity}}</p>
      <ul v-for="batches in batchesToPick" v-bind:key="batches.batchId">
        <li>
          PlantName: {{batches.plantName}} | FormSize: {{batches.formSize}} | Location: {{batches.location}} |
          Saleable Qty: {{batches.quantity}} <input v-model="batches.batchId" type="number" step="1" />
        </li>
      </ul>
      <b-button variant="outline-primary" block @click="acceptValues">Use selected batches</b-button>
      <b-button variant="outline-danger" block @click="hideModal">Close Me</b-button>
    </b-modal>
  </div>
</template>

<script>
  export default {
    props: ['rowInfo'],
    data() {
      return {
        batchesToPick: '',
        amountNeeded: ''
      }
    },
    methods: {
      openHSModal() {  
        this.$refs.HillsStockModal.show();
        let stockBatches = JSON.parse(sessionStorage.getItem('batchList')); //Get the latest batches in stock
        let selectedPlants = stockBatches.filter(stockBatches => //Filter through the batches where the plantName/FormSize is the same
            (stockBatches.plantName === this.rowInfo.PlantName && stockBatches.formSize === this.rowInfo.FormSize)); //This will give you a list of batches that are the same
        this.batchesToPick = selectedPlants;
      },
      hideModal() {
        this.$refs.HillsStockModal.hide();
      },
      acceptValues() {
        this.rowInfo.QuantityOutstanding = this.amountNeeded;
        this.$emit('sendVal');
        this.hideModal();
      }
    }
  }
</script>

<style scoped>

</style>