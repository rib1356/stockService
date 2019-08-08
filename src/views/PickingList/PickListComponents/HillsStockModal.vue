<template>
  <div>
    <b-button size="sm" @click="openHSModal" style="margin-left: 5px;">Hills</b-button>
    <b-modal :ref='"HillsStockModal"' size="lg" no-close-on-backdrop hide-footer title="Select batches to pick from">
      <div v-if="batchesToPick.length != 0"> <!-- Grid items to hold all of the batches to select from -->
        <b-alert show v-model="showAlert" variant="danger">The amount selected is higher than the current batch quantity!</b-alert>
        <p><u>Quantity Needed: {{rowInfo.Quantity}} Qty Outstanding: {{rowInfo.QuantityOutstanding}} Current Amount: {{currentAmount}}</u></p>
        <div class="grid-container">
          <div class="grid-item">
            <p><u>Plant Name</u></p>
          </div>
          <div class="grid-item">
            <p><u>Form Size</u></p>
          </div>
          <div class="grid-item">
            <p><u>Location</u></p>
          </div>  
          <div class="grid-item">
            <p><u>Quantity</u></p>
          </div>  
          <div class="grid-item">
            <p><u>Amount Needed</u></p>
          </div>  
        </div>
        <ul v-for="batches in batchesToPick" v-bind:key="batches.batchId" class="myList">
          <div class="grid-container">
            <div class="grid-item">
              <p>{{batches.plantName}}</p>
            </div>
            <div class="grid-item">
              <p>{{batches.formSize}}</p>
            </div>
            <div class="grid-item">
              <p>{{batches.location}}</p>
            </div>  
            <div class="grid-item">
              <p>{{batches.quantity}}</p>
            </div>  
            <div class="grid-item">
              <input v-model="batches.amountNeeded" type="number" step="1" @input="calcAmounts" min="0" :max="batches.quantity"/>
            </div>   
          </div>
        </ul>
      </div>  
      <p v-else>Sorry no batches of this type exist on the nursery</p>
      <b-button variant="outline-primary" v-if="!batchesToPick.length == 0" block @click="acceptValues">Use selected batches</b-button>
      <b-button variant="outline-danger" block @click="hideModal">Cancel</b-button>
    </b-modal>
  </div>
</template>

<script>
  export default {
    props: ['rowInfo'],
    data() {
      return {
        batchesToPick: [],
        batchesUsed: [],
        currentAmount: 0,
        showAlert: false,
        originalAmount: 0,
      }
    },
    methods: {
      //TBH Picklist components are a mess of array of objects and functions which I probably wont remember what they do
      //And will probably break once a database is involved
      openHSModal() {  
        this.$refs.HillsStockModal.show();
        let stockBatches = JSON.parse(sessionStorage.getItem('batchList')); //Get the latest batches in stock
        if(this.batchesToPick.length == 0) {
        let selectedPlants = stockBatches.filter(stockBatches => //Filter through the batches where the plantName/FormSize is the same
            (stockBatches.plantName === this.rowInfo.PlantName && stockBatches.formSize === this.rowInfo.FormSize)); //This will give you a list of batches that are the same
        selectedPlants.forEach(element => {
          element['amountNeeded'] = 0;
          element['plantQuoteIdUsed'] = this.rowInfo.PlantForQuoteId;
        });    
        this.batchesToPick = selectedPlants;
        }
        if(sessionStorage.getItem('tempBatchSave') != null && this.batchesUsed.length == 0) {
          this.getTempSaveBatches();
        }
        this.getOriginalAmount();
      },
      hideModal() {
        this.$refs.HillsStockModal.hide();
      },
      overBatchQuantity() {
        let arr = []
        this.batchesToPick.forEach(element => {
          if(parseInt(element.amountNeeded) > element.quantity) {
            arr.push(true);
          } else {
            arr.push(false)
          }
        });
        if(arr.includes(true)){
          return true;
        } else {
          return false;
        }
      },
      acceptValues() {
        if(this.overBatchQuantity()) {
          this.showAlert = true;
        } else {
          this.showAlert = false;
          this.rowInfo.QuantityOutstanding = ((this.rowInfo.QuantityOutstanding -this.originalAmount) + this.checkBatchesUsed());
          this.$emit('sendVal');//Changes the colours of the rows on the table based upon how many are chosen    
          this.$emit('batchesUsed', this.batchesUsed); //Sends batches to be held for the next page
          this.hideModal();
        }
      },
      checkBatchesUsed() { //Used to calculate the amount that is used on the row and also remember which batch(es) has been used
        var amount = 0;
        this.batchesToPick.forEach(element => {
          var indexOfBatch = this.batchesUsed.findIndex(i => i.batchId === element.batchId);
          if(parseInt(element.amountNeeded) > 0) { //Used to only add the batches that have been used 
            amount += parseInt(element.amountNeeded); //Calculate the total amounts that have been used on different batches
            if(!this.batchesUsed.some(({batchId}) => batchId === element.batchId)) { //It doesnt exist in the array so add it
              this.batchesUsed.push(element); //Push any of the used batches to array as these have been 'allocated'
            } else { //The element exists so change the quantity of the one that exists
              this.batchesUsed[indexOfBatch].amountNeeded = element.amountNeeded;
            }
          } else if(parseInt(element.amountNeeded) == 0 && this.batchesUsed.some(({batchId}) => batchId === element.batchId)) {
            this.batchesUsed[indexOfBatch].amountNeeded = element.amountNeeded; //Set the value to be 0 so it can be removed (somehow?)
          }
        });
        return parseInt(amount);
      },
      calcAmounts() { //Check the current amount from whats currently entered in the inputs
        this.currentAmount = 0;
        this.batchesToPick.forEach(element => {
          this.currentAmount += parseInt(element.amountNeeded); //Calculate the amounts that have been used on different batches
        });
      },
      getOriginalAmount() { //Get the original amount
        this.originalAmount = 0;
        if(this.batchesUsed.length > 0) {
          this.batchesUsed.forEach(element => {
            this.originalAmount += parseInt(element.amountNeeded);
          });
        }
      },
      getTempSaveBatches() {
        let tempBatch = JSON.parse(sessionStorage.getItem('tempBatchSave'));
        this.batchesToPick.forEach(el => { //Loop through the batches that are on the modal
          let filtered = tempBatch.filter(orig => (orig.batchId == el.batchId)); //Find previous one that has been chosen to get its values
          console.log(filtered)
          if(filtered.length > 0) {
            el.amountNeeded = filtered[0].amountNeeded; //Set the amount needed to be the same as what it once was
            this.batchesUsed.push(filtered[0]);
          }
        });
        this.getOriginalAmount();
      },
    },
  }
</script>

<style scoped>

  .myModal {
    height: 80vh;
  }

.grid-container {
    display: grid;
    grid-template-columns: 250px 130px 130px 130px auto;
    /* background-color: lightslategray; */
    /* margin-top: 20px; */
    /* padding: 5px; */
  }
  .grid-item {
    /* background-color: rgba(97, 26, 26, 0.8); */
    /* border: 1px solid rgba(0, 0, 0, 0.8); */
    /* padding: 5px; */
    /* width: 100px; */
    /* font-size: 20px; */
    text-align: center;
  }

  .myList {
    padding: 0px;
  }

  input {
    width: 80px;
  }

</style>