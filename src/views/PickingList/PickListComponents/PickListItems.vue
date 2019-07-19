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
        <subs-modal v-bind:rowInfo='row.item'></subs-modal>
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
      }
    },
    methods: {
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
          } else {
            element._rowVariant = 'warning'
          }
        });  
      },
      createArrayofBatches(batches) {
        batches.forEach(element => {
          if(!this.arrayOfBatches.includes(element))
          this.arrayOfBatches.push(element);
        });
        this.$emit('getUsedBatches', this.arrayOfBatches);
      },
      fetchUsedBatches() {
        return this.arrayOfBatches;
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