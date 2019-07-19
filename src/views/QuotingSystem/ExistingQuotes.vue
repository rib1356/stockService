<template>
  <section>
    <quote-navbar class="navbar-custom" id="navbar" v-bind:pageName='pageName'></quote-navbar>
    <!-- Quote Informatmion -->
    <div class="left-div">
      <b-button @click="showCollapse = !showCollapse"
                :class="showCollapse ? 'collapsed' : null"
                style="margin-bottom: 5px;"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showCollapse ? 'true' : 'false'">
        <p v-if="showCollapse">Hide Filters<i class="fas fa-minus plus"></i></p>
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
          <b-button @click="toggleQuoteSales" style="margin-top: 5px;">
            <p v-if="!showSaleOrders">Show sales orders</p>        
            <p v-else>Show quotes</p> </b-button>          
      </b-collapse>   
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
            <i class="far fa-edit fa-lg" v-b-tooltip.hover title="Edit Item" style="color:green"></i>
          </router-link>
          <i class="fas fa-trash-alt fa-lg" v-b-tooltip.hover title="Delete Item" style="color:red" @click.stop="deleteQuote(row.item)"></i>
          <i class="fas fa-check fa-lg" v-b-tooltip.hover title="Convert to Sales Order" style="color:#0b720b" @click.stop="turnToSalesOrder(row.item)" v-if="!row.item.SalesOrder"></i>
          <i class="fas fa-check fa-lg" v-b-tooltip.hover title="Convert to Pick List" @click="openPickList(row.item)" style="color:#11979e" v-else></i>
        </template> 
      </b-table>
      <b-modal ref="pickListModel" size="lg" no-close-on-backdrop hide-footer title="Create Pick List for Sales Order">
        <b-form-group horizontal label="Address:" >
          <b-form-input v-model="pickListInfo.address"
                        placeholder="Enter an address" />
        </b-form-group>                            
        <b-form-group horizontal label="Estimated Date:" >
          <b-form-input v-model="pickListInfo.estimatedDate"
                        placeholder="Enter an estimated date" />
        </b-form-group>                            
        <b-form-group horizontal label="Exact Date:" >
          <b-form-input v-model="pickListInfo.exactDate"
                        placeholder="Enter an exact date" />
        </b-form-group>                            
        <b-form-group horizontal label="Delivery Needed:" >
          <b-form-checkbox v-model="pickListInfo.deliveryNeeded" style="align: left;">
            {{pickListInfo.deliveryNeeded}}
          </b-form-checkbox>
        </b-form-group>                            
        <b-button variant="outline-primary" @click="savePickListInfo" block>Allocate Plants</b-button>
        <b-button variant="outline-danger" block @click="hidePickListModal()">Cancel</b-button>
      </b-modal>
  </div>
  </section>
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker';
import QuoteNavbar from '@/components/QuoteNavbar.vue'
// import PickListModel from '@/views//PickListModel.vue'
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
        { key: 'quoteId', label: 'Id', sortable: true, sortDirection: 'desc'},
        { key: 'customerRef', label: 'Customer Ref'},
        { key: 'customerName', label: 'Customer Name'},
        { key: 'customerAddress', label: 'Customer Address', thClass: 'd-none', tdClass: 'd-none', sortable: true},
        { key: 'startDate', label: 'Start Date'},
        { key: 'expiryDate', label: 'Expiry Date'},
        { key: 'siteRef', label: 'Site Reference'},
        { key: 'totalPrice', label: 'Quote Price (exVAT)' , sortable: true},
        { key: 'actions', label: 'Actions' }
      ],
      pickListInfo: {
        address: null,
        estimatedDate: null,
        exactDate: null,
        deliveryNeeded: false,
        salesOrderInfo: {},
      },
      quotes: [],
      saleOrders: [],
      originalQuotes: [],
      customers: [],
      showCollapse: true,
      filter: '',
      sortBy: "quoteId",
      sortDesc: true,
      sortSearch: false,
      sortDirection: 'asc',
      selectedDate: '',
      showSaleOrders: false,
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
    clearDate(){ //When the clear button is pressed completely clear the filters
      this.filter = ''
    },
    customFormatter(date) { //Return the correct format so that the table dates can be filtered
      return moment(new Date(date)).format('D/M/YYYY');
    },
    setFilter(date) {
      this.filter = this.customFormatter(date)
    },
    openPickList(row) {
      this.pickListInfo.salesOrderInfo = row;
      this.$refs['pickListModel'].show()
    },
    hidePickListModal() {
      this.$refs['pickListModel'].hide()
    },
    savePickListInfo() {
      sessionStorage.setItem('pickListInfo', JSON.stringify(this.pickListInfo));
      this.$router.push('PlantAllocation');
    },
    getExistingQuotes() {
			this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/quote/all')
      .then((response) => {
        this.changeData(response.data);
      })
      .catch((error) => {
          alert("Error from getExistingQuotes: "+error + "\n" + "Please try going to home page");
      });
		},
    changeData(response) {
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
        if(response[i].Active === true && response[i].SalesOrder === false) {
          this.quotes.push({ //This is then pushed into an array and used to populate the data table
            "quoteId": response[i].QuoteId,
            "customerRef": response[i].CustomerRef,
            "customerName": response[i].CustomerName,
            "customerAddress": response[i].CustomerAddress,
            "startDate": this.convertDate(response[i].Date), //Used to format the date that was saved in the db
            "expiryDate": this.convertDate(response[i].ExpiryDate),
            "siteRef": response[i].SiteRef,
            "totalPrice": this.getPrice(response[i].TotalPrice),
            "SalesOrder": response[i].SalesOrder,
          });
          this.originalQuotes = this.quotes;
        } else if (response[i].Active === true && response[i].SalesOrder === true) {
            this.saleOrders.push({ //This is then pushed into an array and used to populate the data table
            "quoteId": response[i].QuoteId,
            "customerRef": response[i].CustomerRef,
            "customerName": response[i].CustomerName,
            "customerAddress": response[i].CustomerAddress,
            "startDate": this.convertDate(response[i].Date), //Used to format the date that was saved in the db
            "expiryDate": this.convertDate(response[i].ExpiryDate),
            "siteRef": response[i].SiteRef,
            "totalPrice": this.getPrice(response[i].TotalPrice),
            "SalesOrder": response[i].SalesOrder,
          });
        }
      }
      if(this.$route.params.salesOrder) {
        this.toggleQuoteSales();
      }
    },
    toggleQuoteSales() { //Changes text and values when swapping between quotes/salesorders
      this.showSaleOrders = !this.showSaleOrders;
      if(this.showSaleOrders == true) {
        document.getElementById("navbar").style.backgroundColor = "#11979e";
        this.pageName = 'Sales Orders'
        this.quotes = null;
        this.quotes = this.saleOrders;
      } else {
        document.getElementById("navbar").style.backgroundColor = "#0b720b";
        this.pageName = 'Existing Quotes'
        this.quotes = null;
        this.quotes = this.originalQuotes;
      }
    },
    getPrice(price) { //Does the same as computed method but passed in a value
      return (price/100).toFixed(2);
    },
    convertDate(dateString){ //Will change the date from "yyyy-MM-dd" to = "dd/MM/yyyy"
      var p = dateString.split(/\D/g)
      return [p[1],p[0],p[2] ].join("/")
    },
    deleteQuote(row){
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
    },
    turnToSalesOrder(row) {
      //var url = ("https://ahillsquoteservice.azurewebsites.net/api/quote/delete?id=" + row.quoteId); 
      let data = { "QuoteId": row.quoteId, "SalesOrder": true} ;
      if(confirm("Turn Quote to sales order?")) { //Bring up confirm dialog before deleting
        this.axios.put('https://ahillsquoteservice.azurewebsites.net/api/quote/salesOrder?id=' + row.quoteId, data)
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
    //this.getAllCustomers();
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
    height: fit-content;
    max-height: 85vh;
		width: 80%;
		overflow: auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
	}

  .navbar-custom {
			background-color: #0b720b;
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
