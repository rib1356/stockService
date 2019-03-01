<template>
  <section>
  
    <p>{{msg}}</p>
    <div class="left-div">
		  <router-link to="/StockTable" tag="button">Back to stock table</router-link>
		  <router-link to="/QuoteNavigation" tag="button">Back to Quote Navigation</router-link>
        <b-form-group vertical label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
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
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
				<router-link :to="{name: 'EditQuote', params: { selectedQuote: row.item } }">
					<i class="far fa-edit fa-lg" style="color:green"></i>
				</router-link>
					<!-- <i class="far fa-edit fa-lg" style="color:red"></i> -->
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
			quotes: [
        {quoteId: 1, customerRef: "Test", customerName: "test", startDate: "test", expiryDate: "test", siteRef: "test", totalPrice: 100},
      ],
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
        // let date = moment(response[i].Date).format('DD/MM/YYYY');
        let customerName = this.getCustomerName(response[i].CustomerRef);
        // console.log(date);
        this.quotes.push({                 //This is then pushed into an array and used to populate the data table
          "quoteId": response[i].QuoteId,
          "customerRef": response[i].CustomerRef,
          "customerName": customerName,
          "startDate": moment(response[i].Date).format('DD/MM/YYYY'),
          "expiryDate": moment(response[i].ExpiryDate).format('DD/MM/YYYY'),
          "siteRef": response[i].SiteRef,
          "totalPrice": response[i].TotalPrice / 100,
        });
      }
    },
    getCustomerName(customerRef){
      let customer = this.customers;
      for (var i = 0; i < customer.length; i++) {
        if(customerRef == customer[i].customerRef) {
          // console.log(customer[i].customerName)
          return customer[i].customerName;
        }
      }
    },
    getAllCustomers() {
      this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/customer/all')
        .then((response) => {
          this.parseCustomers(response.data);
        })
        .catch((error) => {
          alert(error);
        });
    },
    parseCustomers(data) {
      for(var i = 0; i < data.length; i++){
        this.customers.push({ //Create an array of objects
          "customerName": data[i].CustomerName,    //Data coming in is string so just assign values in object to be displayed
          "customerRef": data[i].CustomerReference,
          "customerTel": data[i].CustomerTel,
          "customerAddress": data[i].CustomerAddress,
          "customerEmail": data[i].CustomerEmail,
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
    /* margin:0; */
    /* padding: 10px; */
	}

	.left-div
	{
    width: 20%;
		height: 100%; 
    /* background: red; */
		float:left;
		/* overflow:hidden; */
		/* background: green; */
	}

	.right-div {
    /* position: absolute; */
		float: left;
    /* height: 95%; */
    max-height: 90vh;
		width: 80%;
		overflow: auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
	}

	@media only screen and (max-width : 768px) {

	.left-div {
		position: relative;
		width: 100%;
	}

	.right-div {
		width: 100%;
		position: relative;
		/* visibility: hidden; */
	}

}

</style>
