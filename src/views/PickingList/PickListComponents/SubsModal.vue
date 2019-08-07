<template>
  <div>
    <b-button size="sm" @click="openSubModal" style="margin-left: 5px;">Subsitute</b-button>
    <b-modal :ref='"SubModal"' size="lg" no-close-on-backdrop hide-footer title="Select batches to pick from">
        <!-- <b-alert show v-model="showAlert" variant="danger">The amount selected is higher than the current batch quantity!</b-alert> -->
      <div>  
        <b-button @click="showCollapse = !showCollapse"
                :class="showCollapse ? 'collapsed' : null"
                style="margin-bottom: 5px;"
                class="plus"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showCollapse ? 'true' : 'false'">
          <p v-if="showCollapse">Hide Batches<i class="fas fa-minus my-icon"></i></p>
          <p v-else>Show Batches<i class="fas fa-plus my-icon"></i></p>
        </b-button>
        <p>Item to pick: {{rowInfo.PlantName}} {{rowInfo.FormSize}}</p>
        <p class="qty"><u>Quantity Needed: {{rowInfo.Quantity}} | Qty Outstanding: {{rowInfo.QuantityOutstanding}} |
           Current Amount: {{currentAmount}}</u></p>
      </div>  
      <br>
      <div v-if="batchesToPick.length != 0" class="modal-body"> <!-- Grid items to hold all of the batches to select from -->
			  <b-collapse v-model="showCollapse" id="collapse">
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
			  </b-collapse>   
      </div>  
      <p v-else>Sorry no batches of this type exist on the nursery</p>
      <input type="text" v-model="search">
      <b-button class="search-btn" @click="searchBatches">Search</b-button>
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
        batchesToPick: [],
        batchesUsed: [],
        showCollapse: true,
        currentAmount: 0,
        originalAmount: 0,
        search: '',
        originalSearch: [],
      }
    },
    methods: {
      openSubModal() {
        this.$refs.SubModal.show();
        let stockBatches = JSON.parse(sessionStorage.getItem('batchList')); //Get the latest batches in stock
        if(this.batchesToPick.length == 0) {
        let selectedPlants = stockBatches.filter(stockBatches => //Filter through the batches where the plantName is the same
            (stockBatches.plantName === this.rowInfo.PlantName && !(stockBatches.formSize === this.rowInfo.FormSize) )); //This will give you a list of batches that are the same
        selectedPlants.forEach(element => {
          element['amountNeeded'] = 0; //Add in an amount needed so theres a value to v-model against
          element['plantQuoteIdUsed'] = this.rowInfo.PlantForQuoteId; //The plantQuoteId so that it can be saved into the db 
          element['subFor'] = this.rowInfo.PlantName  + " " + this.rowInfo.FormSize; //Visuals
        });    
        this.batchesToPick = selectedPlants;
        }
        if(sessionStorage.getItem('tempBatchSave') != null && this.batchesUsed.length == 0) {
          this.getTempSaveBatches();
        }
        this.getOriginalAmount();
      },
      hideModal() {
        this.$refs.SubModal.hide();
      },
      allocateItems() {
        this.rowInfo.QuantityOutstanding = ((this.rowInfo.QuantityOutstanding - this.originalAmount) + this.checkBatchesUsed());
        this.$emit('sendVal'); //Changes the colours of the rows on the table based upon how many are chosen
        this.$emit('batchesUsed', this.batchesUsed); //Sends batches to be held for the next page
        this.hideModal();
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
          //The item has already been allocated but its amount needed is changed to 0  
          } else if(parseInt(element.amountNeeded) == 0 && this.batchesUsed.some(({batchId}) => batchId === element.batchId)) {
            this.batchesUsed[indexOfBatch].amountNeeded = element.amountNeeded; //Set the value to be 0 so it can be removed (somehow?)
          }
        });
        return parseInt(amount);
      },
      calcAmounts() {
        this.currentAmount = 0;
        this.batchesToPick.forEach(element => {
          this.currentAmount += parseInt(element.amountNeeded); //Calculate the amounts that have been used on different batches
        });
      },
      getTempSaveBatches() {
        let tempBatch = JSON.parse(sessionStorage.getItem('tempBatchSave'));
        this.batchesToPick.forEach(el => { //Loop through the batches that are on the modal
          let filtered = tempBatch.filter(orig => (orig.batchId == el.batchId)); //Find previous one that has been chosen to get its values
          if(filtered.length > 0) {
            el.amountNeeded = filtered[0].amountNeeded; //Set the amount needed to be the same as what it once was
            this.batchesUsed.push(filtered[0]);
          }
        });
        this.getOriginalAmount();
      },
      getOriginalAmount() { //Get the original amount
        this.originalAmount = 0;
        if(this.batchesUsed.length > 0) {
          this.batchesUsed.forEach(element => {
            this.originalAmount += parseInt(element.amountNeeded);
          });
        }
      },
      searchBatches() {
        //If original search is !empty then remove the search from the batchesToPickArray for the new search  
        if(this.originalSearch.length != 0) {
          this.batchesToPick = this.batchesToPick.filter((el) => !this.originalSearch.includes( el )); //Remove the original search
        }
        //-----------------------------------------------------------------------------------------------------------------------------------------
        //Should I initialise this on mainpage load then pass as props rather than every search
        let stockBatches = JSON.parse(sessionStorage.getItem('batchList'));
        //-----------------------------------------------------------------------------------------------------------------------------------------
        let filtered = stockBatches.filter(stockBatches => //Filter through the batches where the plantName is the same
            (stockBatches.plantName.toLowerCase().includes(this.search.toLowerCase()) ));
          this.originalSearch = filtered; //Store the original search array? Then remove the values?
          filtered.forEach(element => {
            element['amountNeeded'] = 0;
            element['plantQuoteIdUsed'] = this.rowInfo.PlantForQuoteId;
            element['subFor'] = this.rowInfo.PlantName + " " + this.rowInfo.FormSize;
            this.batchesToPick.push(element);
          });
        this.getTempSaveBatches();  
        this.getOriginalAmount();
      },
    }
  }
</script>

<style scoped>

  .modal-body {
    max-height: calc(100vh - 275px);
    padding: 1rem;
    overflow-y: auto;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 200px 130px 130px 130px auto;
  }
  .grid-item {
    text-align: center;
  }

  .plus {
    width: 30%;
    text-align: center;
    height: 40px;
    float: left;
  }

  .qty {
    display: inline;
    text-align: left;
    align-content: left;
  }

  .my-icon {
    margin-top: 3.5px;
    float: right;
  }

  .myList {
    padding: 0px;
  }

  input {
    width: 100px;
  }

  .search-btn {
    height: 30px;
    width: 100px;
    margin-bottom: 5px;
  }

</style>