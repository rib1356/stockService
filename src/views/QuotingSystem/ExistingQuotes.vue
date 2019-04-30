<template>
  <section>
    <quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
    <!-- Quote Informatmion -->
    <div class="left-div">
      <b-button @click="showCollapse = !showCollapse"
                :class="showCollapse ? 'collapsed' : null"
                style="margin-bottom: 5px;"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showCollapse ? 'true' : 'false'">
        <p v-if="showCollapse">Hide Filters<i class="fas fa-plus plus"></i></p>
        <p v-else>Show Filters<i class="fas fa-plus plus"></i></p>
      </b-button>  
      <!-- Collapsible area to show the filters for the table -->
      <b-collapse v-model="showCollapse" id="collapse">
      <b-input-group class="input-filter">
        <b-form-input v-model="filter" placeholder="Type to Search"/>
          <b-input-group-append>
            <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
          </b-input-group-append>
      </b-input-group>
      <b-input-group class="input-filter">
        <b-form-select v-model="sortBy" :options="sortOptions">
          <option slot="first" :value="null">Choose Sort Option</option>
        </b-form-select>
        <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
          <option :value="false">Asc</option>
          <option :value="true">Desc</option>
        </b-form-select>
      </b-input-group>
      <datepicker placeholder="Select Date"
                  v-model="selectedDate"
                  :format="customFormatter"
                  @selected="setFilter"
                  @cleared="clearDate"
                  monday-first
                  clear-button
                  bootstrap-styling
                  ></datepicker>
      </b-collapse>   
      <!-- <b-form-checkbox 
      @input="test"
      switch></b-form-checkbox> -->
    </div>
    <!-- Quote Table -->
    <div class="right-div">
		<b-table show-empty
             stacked="sm"
             :items="quotes"
             :fields="fields"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             class="table" 
             outlined   
             >
      <div slot="empty">
        <strong>Loading quotes...</strong>
      </div>   
      <template slot="totalPrice" slot-scope="row">
        £{{row.item.totalPrice}}
      </template>    
      <template slot="actions" slot-scope="row">
				<router-link :to="{name: 'EditQuote', params: { selectedQuote: row.item } }">
					<i class="far fa-edit fa-lg" style="color:green"></i>
				</router-link>
				<i class="fas fa-trash-alt fa-lg" style="color:red" @click.stop="deleteQuote(row.item)"></i>
      </template> 
    </b-table>
  </div>
  </section>
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker';
import QuoteNavbar from '@/components/QuoteNavbar.vue'
export default {
  name: 'ExistingQuotes',
  components: {
    QuoteNavbar,
    Datepicker,
	},
  data () {
    return {
			pageName: 'Existing Quotes',
			fields: [
        { key: 'quoteId', label: 'QuoteId', sortable: true, sortDirection: 'desc'},
        { key: 'customerRef', label: 'Customer Ref'},
        { key: 'customerName', label: 'Customer Name'},
        { key: 'startDate', label: 'Start Date'},
        { key: 'expiryDate', label: 'Expiry Date'},
        { key: 'siteRef', label: 'Site Reference'},
        { key: 'totalPrice', label: 'Quote Price' , sortable: true},
        { key: 'actions', label: 'Actions' }
			],
			quotes: [],
      customers: [],
      showCollapse: true,
      filter: '',
      sortBy: "quoteId",
      sortDesc: true,
      sortSearch: false,
      sortDirection: 'asc',
      selectedDate: '',
      
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    },
  },
  methods: {
    test() {
      console.log("ree")
      for (let i = 0; i < this.quotes.length; i++) {
        this.quotes[i]._rowVariant = 'danger'
      }
    },
    clearDate(){ //When the clear button is pressed completely clear the filters
      this.filter = ''
    },
    customFormatter(date) { //Return the correct format so that the table dates can be filtered
      return moment(new Date(date)).format('DD/MM/YYYY');
    },
    setFilter(date) {
      this.filter = this.customFormatter(date)
    },
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
        if(response[i].Active === true) {
          this.quotes.push({ //This is then pushed into an array and used to populate the data table
            "quoteId": response[i].QuoteId,
            "customerRef": response[i].CustomerRef,
            "customerName": customerName,
            "startDate": this.convertDate(response[i].Date), //Used to format the date that was saved in the db
            "expiryDate": this.convertDate(response[i].ExpiryDate),
            "siteRef": response[i].SiteRef,
            "totalPrice": this.getPrice(response[i].TotalPrice),
          });
        }
      }
    },
    getPrice (price) { //Does the same as computed method but passed in a value
      return (price/100).toFixed(2);
    },
    convertDate(dateString){ //Will change the date from "yyyy-MM-dd" to = "dd/MM/yyyy"
        var p = dateString.split(/\D/g)
        return [p[2],p[1],p[0] ].join("/")
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
    deleteQuote (row){
      var url = ("https://ahillsquoteservice.azurewebsites.net/api/quote/delete?id=" + row.quoteId); 
      let data = { "QuoteId": row.quoteId, "Active": false} ;
      if(confirm("Delete Quote?")) { //Bring up confirm dialog before deleting
        this.axios.put(url, data)
          .then((response) => {
            console.log(response);
            location.reload();
          })
          .catch((error) => {
            alert(error);
        });
      } else {
        //do nothing?
      }
    }
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
    /* background: aqua; */
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
    max-height: 85vh;
		width: 80%;
		overflow: auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
	}

  .navbar-custom {
			background-color: #49aa09b0;
	}

  .input-filter{
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 0;
  }

  .plus{
    float: right;
    text-align: center;
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
