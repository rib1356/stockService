<template>
  <div>
    <h4>Items on picklist</h4>
    <b-table show-empty
             stacked="md"
             :items="quotePlants"
             :fields="fields"   
             outlined       
             >
      <template slot="Price" slot-scope="row">
        £{{(row.item.Price/100).toFixed(2)}}
      </template>     
      <template slot="actions" slot-scope="row">
        <div class="btn-group" role="group" aria-label="Basic example">
        <supplier-modal></supplier-modal>
        <hills-stock-modal @batchesUsed="createArrayofBatches" @sendVal="checkRowVariant" v-bind:rowInfo='row.item'></hills-stock-modal>
        <subs-modal @batchesUsed="createArrayofBatches" @sendVal="checkRowVariant" v-bind:rowInfo='row.item'></subs-modal>
        </div>  
        <!-- <b-button size="sm">Supplier</b-button> -->
        <!-- <b-button size="sm">Hills</b-button> -->
        <!-- <b-button size="sm">Subsitutes</b-button> -->
      </template>  
    </b-table> 
  </div>
</template>

<script>
import SupplierModal from '@/views/PickingList/PickListComponents/SupplierModal.vue'
import HillsStockModal from '@/views/PickingList/PickListComponents/HillsStockModal.vue'
import SubsModal from '@/views/PickingList/PickListComponents/SubsModal.vue'
  export default {
    props: ['pickListInformation'],
    components: {
      SupplierModal,
      HillsStockModal,
      SubsModal,
    },
    data() {
      return {
        fields: [
          { key: 'PlantName', label: 'Plant Name', sortable: true},
          { key: 'FormSize', label: 'Form Size'},
          { key: 'Comment', label: 'Comment'},
          { key: 'Price', label: 'Item Price', sortable: true, contenteditable: true},
          { key: 'Quantity', label: 'Qty Needed', sortable: true},
          { key: 'QuantityOutstanding', label: 'Qty Outstanding', sortable: true},
          { key: 'actions', label: 'Actions' }
        ],
        quotePlants: [],
        pickListInfo1: '',
        arrayOfBatches: [],
        originalBatches: [],
      }
    },
    methods: {
      //TBH Picklist components are a mess of array of objects and functions which I probably wont remember what they do
      getPlants() {
        // console.log(this.pickListInformation.salesOrderInfo.quoteId);
        this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/quote/detail?id=' + this.pickListInfo1.salesOrderInfo.quoteId)
        .then((response) => {
          this.changeData(response.data.QuoteDetails); //Pass in just the plants on the quote to be displayed on table
        })
        .catch((error) => {
            alert(error);
        });
      },
      changeData (response) {
        for(var i = 0; i < response.length; i++){
          if(response[i].Active === true) {
            this.quotePlants.push({
              PlantForQuoteId : response[i].PlantForQuoteId,
              PlantName: response[i].PlantName,
              FormSize: response[i].FormSize,
              Comment: response[i].Comment,
              Quantity: response[i].Quantity,
              QuantityOutstanding: 0, //To change eventually and calculate how many more is needed based on value already picked
              Price: response[i].Price,
              Active: response[i].Active,
              _rowVariant: '',
            });   
          }
        }
        //After getting the plants get any batches that may have been saved and need re allocating.
        if(sessionStorage.getItem('tempBatchSave') != null) {
          this.arrayOfBatches = JSON.parse(sessionStorage.getItem('tempBatchSave'));
          this.$emit('getUsedBatches', this.arrayOfBatches);
          this.sortOriginalBatches(); //Call this method to sort out the items
        }
        this.checkRowVariant();
      },
      checkRowVariant(row) {
        this.quotePlants.forEach(element => {
          if(element.Quantity == element.QuantityOutstanding) {
            element._rowVariant = 'success';
          } else if (element.QuantityOutstanding == 0) {
            element._rowVariant ='danger';
          } else if (element.QuantityOutstanding > element.Quantity) {
            element._rowVariant = 'info'
            alert("Quantity is more than needed. This will update the Sales Order!")
          } else {
            element._rowVariant = 'warning'
          }
        });  
      },
      createArrayofBatches(batches) { 
        batches.forEach(element => { //Loop through the incoming batches that need to be added to the pick list
          if(this.arrayOfBatches.some(({batchId}) => batchId === element.batchId)) { //If the batch is already contained in the original list (if went to allocate plants then came back)
            var indexOfBatch = this.arrayOfBatches.findIndex(i => i.batchId === element.batchId); //Find the index of that item
            this.arrayOfBatches[indexOfBatch].amountNeeded = element.amountNeeded; //Then change the quantity to the new one
          } else { 
            this.arrayOfBatches.push(element); //Else its a new item and add to the array
          }
        });
        this.$emit('getUsedBatches', this.arrayOfBatches);
      },
      sortOriginalBatches() {
        this.quotePlants.forEach(el => { //Loop through all of the plants
          let tempAmountNeeded = 0;
          //Filter through the batches where the plantName is the same
          let filtered = this.arrayOfBatches.filter(orig => (orig.plantQuoteIdUsed == el.PlantForQuoteId));
            filtered.forEach(element => {
              tempAmountNeeded += parseInt(element.amountNeeded)
            });
            el.QuantityOutstanding = tempAmountNeeded;
        });
      }
    },
    created() {
      this.pickListInfo1 = JSON.parse(sessionStorage.getItem('pickListInfo'));
      this.getPlants();
    }
  }
</script>

<style scoped>

.btn-group {
  margin-right: 5px;
}

</style>