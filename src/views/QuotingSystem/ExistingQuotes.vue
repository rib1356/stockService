<template>
  <div>
    <p>{{msg}}</p>
		<router-link to="/StockTable" tag="button">Back to stock table</router-link>
		<router-link to="/QuoteNavigation" tag="button">Back to Quote Navigation</router-link>
		<b-table show-empty
             stacked="md"
             :items="quotes"
             :fields="fields"
             class="table"  
             >
      <div slot="empty">
        <strong>Loading quotes...</strong>
      </div>       
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
				<router-link :to="{name: 'EditQuote', params: { selectedQuote: row.item } }">
					<i class="far fa-edit fa-lg" style="color:green"></i>
				</router-link>
					<!-- <i class="far fa-edit fa-lg" style="color:red"></i> -->
				<i class="fas fa-trash-alt fa-lg" style="color:red" @click.stop="remove"></i>
      </template> 
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'ExistingQuotes',
  data () {
    return {
			msg: 'Existing Quotes',
			fields: [
        { key: 'quoteId', label: 'QuoteId', sortable: true},
        { key: 'customerQuoteRef', label: 'Customer Ref'},
        { key: 'customerName', label: 'Customer Name'},
        { key: 'startDate', label: 'Start Date', sortable: true},
        { key: 'expiryDate', label: 'Expiry Date', sortable: true},
        { key: 'siteRef', label: 'Site Reference'},
        { key: 'totalPrice', label: 'Quote Price' , sortable: true},
        { key: 'actions', label: 'Actions' }
			],
			quotes: [],
    }
  },
  methods: {
    getExistingQuotes() {
			this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/quote/all')
      .then((response) => {
				this.changeData(response.data);
      })
      .catch((error) => {
          alert(error);
      });
		},
		changeData (response) {
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
        this.quotes.push({                 //This is then pushed into an array and used to populate the data table
          "quoteId": response[i].QuoteId,
          "customerQuoteRef": response[i].CustomerQuoteRef,
          "customerName": "Name will go here",
          "startDate": response[i].Date,
          "expiryDate": response[i].ExpiryDate,
          "siteRef": response[i].SiteRef,
					"totalPrice": response[i].TotalPrice / 100,
        });   
    }
	},
	selectQuote(item) {
		console.log(item)
	},
	remove() {
		console.log("This will delete");
	},

	},
	mounted() {
		this.getExistingQuotes();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://use.fontawesome.com/releases/v5.7.2/css/all.css";

</style>
