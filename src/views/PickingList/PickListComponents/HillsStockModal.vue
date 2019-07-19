<template>
  <div>
    <b-button size="sm" @click="openHSModal" style="margin-left: 5px;">Hills</b-button>
    <b-modal :ref='"HillsStockModal"' size="lg" no-close-on-backdrop hide-footer title="Select batches to pick from">
      <div v-if="batchesToPick.length != 0"> <!-- Grid items to hold all of the batches to select from -->
        <b-alert show v-model="showAlert" variant="danger">The amount selected is higher than the current batch quantity!</b-alert>
        <p><u>Quantity Needed: {{rowInfo.Quantity}} Current Amount: {{currentAmount}}</u></p>
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
      }
    },
    methods: {
      openHSModal() {  
        this.$refs.HillsStockModal.show();
        let stockBatches = JSON.parse(sessionStorage.getItem('batchList')); //Get the latest batches in stock
        if(this.batchesToPick.length == 0) {
        let selectedPlants = stockBatches.filter(stockBatches => //Filter through the batches where the plantName/FormSize is the same
            (stockBatches.plantName === this.rowInfo.PlantName && stockBatches.formSize === this.rowInfo.FormSize)); //This will give you a list of batches that are the same
        selectedPlants.forEach(element => {
          element['amountNeeded'] = 0;
        });    
        this.batchesToPick = selectedPlants;
        }
      },
      hideModal() {
        this.$refs.HillsStockModal.hide();
      },
      acceptValues() {
        if(this.rowInfo.Quantity < this.checkBatchesUsed()) {
          alert("This is more than the quantity needed (Will update the new quantity eventually)")
          this.rowInfo.QuantityOutstanding = this.checkBatchesUsed();
        } else {
          this.rowInfo.QuantityOutstanding = this.checkBatchesUsed();
        }
        this.$emit('sendVal');
        this.$emit('batchesUsed', this.batchesUsed);
        this.hideModal();
      },
      checkBatchesUsed() { //Used to calculate the amount that is used on the row and also remember which batch(es) has been used
        var amount = 0;
        this.batchesToPick.forEach(element => {
          if(parseInt(element.amountNeeded) > 0) { //Used to only add the batches that have been used 
            amount += parseInt(element.amountNeeded); //Calculate the total amounts that have been used on different batches
            if(!this.batchesUsed.includes(element)) { //It doesnt exist in the array so add it
              this.batchesUsed.push(element); //Push any of the used batches to array as these have been 'allocated'
            }
          }
        });
        return amount;
      },
      calcAmounts() {
        this.currentAmount = 0;
        this.batchesToPick.forEach(element => {
          this.currentAmount += parseInt(element.amountNeeded); //Calculate the amounts that have been used on different batches
        });
        console.log(this.batchesToPick.some(this.quantityGreater))
        if(this.batchesToPick.some(this.quantityGreater)) { //If the amount entered in input is greater than the batches quantity
            this.showAlert = true; //Show an alert for the user
        } else {
            this.showAlert = false;
        }
      },
      quantityGreater() {
        let arr = this.batchesToPick;
        return arr.quantity < arr.amountNeeded;
      }
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