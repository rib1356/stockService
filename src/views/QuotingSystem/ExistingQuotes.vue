<template>
  <section>
    <p>{{msg}}</p>
    <div class="left-div">
		  <router-link to="/StockTable" tag="button">Back to stock table</router-link>
		  <router-link to="/QuoteNavigation" tag="button">Back to Quote Navigation</router-link>
          <b-input-group class="input-filter">
            <b-form-input v-model="filter" placeholder="Type to Search"/>
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        <!-- <datepicker placeholder="Select Date"></datepicker> -->
    </div>
    <div class="right-div">
		<b-table show-empty
             stacked="md"
             :items="quotes"
             :fields="fields"
             :filter="filter"
             class="table" 
             outlined   
             >
      <div slot="empty">
        <strong>Loading quotes...</strong>
      </div>       
      <template slot="actions" slot-scope="row">
				<router-link :to="{name: 'EditQuote', params: { selectedQuote: row.item } }">
					<i class="far fa-edit fa-lg" style="color:green"></i>
				</router-link>
				<i class="fas fa-trash-alt fa-lg" style="color:red" @click.stop="remove"></i>
      </template> 
    </b-table>
  </div>
  </section>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ExistingQuotes',
  data () {
    return {
			msg: 'Existing Quotes',
			fields: [
        { key: 'quoteId', label: 'QuoteId', sortable: true},
        { key: 'customerRef', label: 'Customer Ref'},
        { key: 'customerName', label: 'Customer Name'},
        { key: 'startDate', label: 'Start Date', sortable: true},
        { key: 'expiryDate', label: 'Expiry Date', sortable: true},
        { key: 'siteRef', label: 'Site Reference'},
        { key: 'totalPrice', label: 'Quote Price' , sortable: true},
        { key: 'actions', label: 'Actions' }
			],
			quotes: [],
      customers: [],
      filter: '',
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
        let customerName = this.getCustomerName(response[i].CustomerRef); //Get the customer name from the method
        this.quotes.push({ //This is then pushed into an array and used to populate the data table
          "quoteId": response[i].QuoteId,
          "customerRef": response[i].CustomerRef,
          "customerName": customerName,
          "startDate": moment(response[i].Date).format('DD/MM/YYYY'), //Used to format the date that was saved in the db
          "expiryDate": moment(response[i].ExpiryDate).format('DD/MM/YYYY'),
          "siteRef": response[i].SiteRef,
          "totalPrice": response[i].TotalPrice / 100,
        });
      }
    },
    getCustomerName(customerRef){
      let customer = this.customers;
      for (var i = 0; i < customer.length; i++) { //Loops through the customers to find where the references match to get their name
        if(customerRef == customer[i].customerRef) {
          return customer[i].customerName;
        }
      }
    },
    getAllCustomers() {
      if(localStorage.getItem("customers") != null) { //If exists load parse customers back to array of objects
        this.customers = JSON.parse(localStorage.getItem("customers"));
      } else {
        alert("Customers need to be loaded into storage. Please go to the stock table")
      }
    },
    remove() {
      console.log("This will delete");
    },
	},
	mounted() {
    this.getAllCustomers();
		this.getExistingQuotes();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://use.fontawesome.com/releases/v5.7.2/css/all.css";

	.section {
    width: 100%;
		max-height: 95vh;
    background: aqua;
    overflow: hidden;
    overflow-y: hidden;
	}

	.left-div
	{
    width: 20%;
		height: 100%; 
		float:left;
	}

	.right-div {
		float: left;
    max-height: 90vh;
		width: 80%;
		overflow: auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
	}

  .input-filter{
    margin-bottom: 5px;
    margin-top: 5px;
  }

	@media only screen and (max-width : 768px) {

	.left-div {
		position: relative;
		width: 100%;
	}

	.right-div {
    max-height: 75vh;
		width: 100%;
		position: relative;
	}

}

</style>
