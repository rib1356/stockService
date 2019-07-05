<template>
  <div>
    <h4>Items on picklist</h4>
    <b-table show-empty
             stacked="md"
             :items="quotePlants"
             :fields="fields"   
             outlined       
             >
    </b-table> 
  </div>
</template>

<script>
  export default {
    props: ['pickListInfo'],
    data() {
      return {
        fields: [
          { key: 'PlantName', label: 'Plant Name', sortable: true},
          { key: 'FormSize', label: 'Form Size'},
          { key: 'Comment', label: 'Comment'},
          { key: 'Price', label: 'Item Price', sortable: true, contenteditable: true},
          { key: 'Quantity', label: 'Quantity Needed', sortable: true},
          { key: 'Quantity2', label: 'Quantity Outstanding', sortable: true},
          { key: 'actions', label: 'Actions' }
        ],
        quotePlants: [],
      }
    },
    methods: {
      getPlants() {
        this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/quote/detail?id=' + this.pickListInfo.salesOrderInfo.quoteId)
        .then((response) => {
          this.quotePlants=(response.data.QuoteDetails); //Pass in just the plants on the quote to be displayed on table
        })
        .catch((error) => {
            alert(error);
        });
      },
      changeData (response) {
        console.log(response);
        for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
          if(response[i].Active === true) {
            this.quotePlants.push({                 //This is then pushed into an array and used to populate the data table
              PlantForQuoteId : response[i].PlantForQuoteId,
              PlantName: response[i].PlantName,
              FormSize: response[i].FormSize,
              Comment: response[i].Comment,
              Quantity: response[i].Quantity,
              Price: response[i].Price,
              Active: response[i].Active,
              _rowVariant: '',
            });   
          }
        }
      },      
    },
    created() {
      this.getPlants();
    }
  }
</script>

<style scoped>

</style>