<template>
  <div>
    <p>{{msg}}</p>
		<router-link to="/ExistingQuotes" tag="button">Back to quotes</router-link>
		<p>{{selectedQuote}}</p>
    <b-table show-empty
             stacked="md"
             :items="quotePlants"
             :fields="fields"
             class="table"  
             >
      <div slot="empty">
        <strong>Loading quotes plants...</strong>
      </div>       
      <template slot="actions" slot-scope="">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
				<i class="far fa-edit fa-lg" style="color:green"></i>
				<i class="fas fa-trash-alt fa-lg" style="color:red" @click.stop="remove"></i>
      </template> 
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'EditQuote',
  data () {
    return {
			msg: 'Quote Editing',
			selectedQuote: '',
			fields: [
        { key: 'plantName', label: 'Plant Name', sortable: true},
        { key: 'formSize', label: 'Form Size'},
        { key: 'comment', label: 'Comment'},
        { key: 'quantity', label: 'Quantity', sortable: true},
        { key: 'Price', label: 'Item Price', sortable: true},
        { key: 'actions', label: 'Actions' }
			],
			quotePlants: [],
    }
	},
	methods: {
		getQuotePlants() {
			this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/quote/detail?id=' + this.selectedQuote.quoteId)
      .then((response) => {
				console.log(response.data.QuoteDetails)
				this.changeData(response.data.QuoteDetails); //Pass in just the plants on the quote to be displayed on table
      })
      .catch((error) => {
          alert(error);
      });
		},
		changeData (response) {
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
        this.quotePlants.push({                 //This is then pushed into an array and used to populate the data table
          "plantName": response[i].PlantName,
          "formSize": response[i].FormSize,
          "comment": response[i].Comment,
          "quantity": response[i].Quantity,
          "Price": response[i].Price / 100,
        });   
    }
	},
	},
	created() {
		this.selectedQuote = this.$route.params.selectedQuote;
		this.getQuotePlants();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
