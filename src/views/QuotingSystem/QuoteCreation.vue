<template>
<section>
	<quote-navbar></quote-navbar>
	<div class="left-div">
		<label class="typo__label">Choose a plant to add to a quote</label>
		<multiselect v-model="selectedBatch" 
								:options="batches"  
								placeholder="Select a batch" 
								label="plantName"
								:loading="isLoading"
								:custom-label="customLabel"
								:show-labels="false"
								:allow-empty="false"></multiselect>
		<b-form-input v-model="quantity"
									placeholder="Enter a quantity"
									type="number"
                  pattern="[0-9]*"
									v-validate="'required|numeric|min_value:1'"
									name="quantity"
									inputmode="numeric"
									@keyup.enter="validateBeforeSubmit"></b-form-input>	
									<p class="text-danger" v-if="errors.has('quantity')">{{ errors.first('quantity') }}</p>
		<b-button @click="saveQuote" variant="outline-success" style="margin-top: 5px;">Save Quote</b-button>																
		<b-button @click="validateBeforeSubmit" variant="outline-primary" style="margin-top: 5px;">Add plant</b-button>																
		<div style="margin-top: 10px;">
			<b-button @click="cancel" variant="outline-danger">Back to stock</b-button>
			<b-button @click="toCust" variant="outline-danger">Chose another customer</b-button>
			
		</div>
	</div>
	<div class="right-div">
		<div>
			<p>
				Customer Name: <strong>{{customerInfo.customerName}}</strong>
			  Customer Reference: <strong>{{customerInfo.customerRef}}</strong>
				Customer Telephone: <strong>{{customerInfo.customerTel}}</strong>
			</p>
			<p>	
				Customer Address: <strong>{{customerInfo.customerAddress}}</strong>
				Customer Email: <strong>{{customerInfo.customerEmail}}</strong>
			</p>
			<p>
				Site reference: <strong>{{siteRef}}</strong>
			  Quote Date: <strong>{{quoteDate}}</strong>
			  Expiry Date: <strong>{{expiryDate}}</strong>
			</p>
			<strong>Quote Price: £{{computedTotalPrice}}</strong>
		</div>
		<p>Quote List</p>
      <ul>
          <li v-for="(data, index) in plants" :key='index' @input="getTotalPrice">
            {{ data.PlantName }} {{data.FormSize}} x {{data.Quantity}} @ £{{getPrice(data.Price)}}
            <i class="fas fa-trash-alt" v-on:click="remove(index)"></i>
          </li>
      </ul>
	</div>
</section>
</template>

<script>
import moment from 'moment'
import QuoteNavbar from '@/components/QuoteNavbar.vue'
export default {
	components: {
		QuoteNavbar,
	},
  data () {
		return {
			plants: [],
			quantity: '',
			wholesalePrice: '',
			isLoading: true,
			isLoading2: false,
			quoteDate: null,
			expiryDate: null,
			siteRef: null,
			customerInfo: '',
			quoteObject: '',
			batches: [],
			selectedBatch: null,
			totalPrice: 0
		}		
	},
  methods: {
		cancel() {
				this.$router.push('StockTable');
		},
		toCust() {
				this.$router.push('CustomerInformation');
		},
		remove(id) {
			this.plants.splice(id,1);
			this.getTotalPrice();
		},
		sendEmail() {
			var link = "mailto:me@example.com"
							+ "?cc="
							+ "&subject=" + escape("Plant enquiry")
							+ "&body=" + escape("This is the body: " + JSON.stringify(this.plants))
			;

			window.location.href = link;
		},
		saveQuote() {
			console.log(this.quoteDate);
			this.axios.post('https://ahillsquoteservice.azurewebsites.net/api/quote', {
        CustomerRef: this.customerInfo.customerRef,
				TotalPrice: this.totalPrice,
				Date: this.quoteDate,
				ExpiryDate: this.expiryDate,
				SiteRef: this.siteRef,
				Active: true,
				QuoteDetails: this.plants,
			}) 
			.then((response) => {
				console.log(response);
				this.plants = [];
				this.$router.push('QuoteNavigation');
			})
			.catch((error) => {
				alert("Please check values before submitting")
				console.log(error);
			});
		},
		validateBeforeSubmit(e) { //Check that all validation passes before adding
      this.$validator.validateAll();
        if (!this.errors.any() && this.selectedBatch != null) { 
            this.addToList(); //If there are no validation errors and a batch has been selected add a plant to the list
        }
    },
		getTotalPrice() {
			this.totalPrice = 0; //Reset total price so correct quote price stays
			this.plants.forEach((element) => { //Loop through the array of plants on quote
				let plantPrice = element.Quantity * element.Price; //Get the current price of that plant
				this.totalPrice += plantPrice; //Add it to the total cost of the quote
			});
		},
		addToList() {
			this.plants.push({
				PlantName: this.selectedBatch.plantName,
				FormSize: this.selectedBatch.formSize,
				Quantity: this.quantity,
				Comment: null,
				Price: this.selectedBatch.batchPrice,
			});
			this.getTotalPrice();
			this.selectedBatch = null
			this.quantity = ''
		},
		getBatchList() {
			if(sessionStorage.getItem('batchList') != null) {
				let batchList = sessionStorage.getItem('batchList');
				this.batches = JSON.parse(batchList);
				this.isLoading = false;
			} else {
				alert("Loading batches from service");
				this.getBatches();
			}
		},
		getBatches() {
		  this.axios.get('https://ahillsbatchservice.azurewebsites.net/api/Batches') //Call the database to retrieve the current batches
      .then((response) => {
        this.changeData(response.data);
      }).catch((error) => {
				alert("Sorry there was an error")
				console.log(error)
      });
    },
    changeData (response) {
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
				if(response[i].Active === true) {        //Only get the batches that are active to not show deleted batches  
					this.batches.push({                 //This is then pushed into an array and used to populate the data table
						"batchId": response[i].Id,
						"Sku": response[i].Sku,
						"plantName": response[i].Name,
						"location": response[i].Location,
						"quantity": response[i].Quantity,
						"formSize": response[i].FormSize,
						"active": response[i].Active,
					});
     	  }     
      }
    },
		customLabel ({ plantName, formSize }) {
      return `${plantName} – ${formSize}`
    },
		getQuoteDate() {
			this.quoteDate = moment().format('DD/MM/YYYY');
			this.expiryDate = moment().add('30', 'days').format('DD/MM/YYYY')
		},
		plantSelected() {
			this.isLoading2 = true;
		},
		clearFormSizes() {
			this.selectedFormSize = '';
		},
		getPrice (price) { //Does the same as computed method but passed in a value
      return (price/100).toFixed(2);
    },
	},
	computed: {
    computedTotalPrice () { ///Whenever total value is shown this will format to look monitary
      return (this.totalPrice/100).toFixed(2);
    },
	},
	mounted() {
		this.getBatchList();
		this.getQuoteDate();
	},
	created() {
		this.customerInfo = this.$route.params.selectedCustomer;
		this.siteRef = this.$route.params.siteRef;
	}
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
/* @import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";  */
@import "https://use.fontawesome.com/releases/v5.7.2/css/all.css";
	.section {
    width: 100%;
		height: 500px;
    background: aqua;
    /* margin:0; */
    /* padding: 10px; */
	}

	.left-div
	{
    width: 25%;
		height: 100%; 
    /* background: red; */
		float:left;
		/* overflow:hidden; */
		/* background: green; */
	}

	.right-div {
		float:left;
		width:75%;
		overflow:hidden;
	}
	
	/* starts here */
	  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  
  ul li {
    padding: 5px;
    /* font-size: 1.3em; */
    background-color: #E0EDF4;
    border-left: 5px solid #3EB3F6;
    margin-bottom: 2px;
    color: #3E5252;
  }
  p {
    text-align:center;
  }
  .container {
    box-shadow: 0px 0px 40px lightgray;
  }
  input {
    /* width: calc(100% - 40px); */
    border: 1px solid #e8e8e8;
		font-size: 16px;
		min-height: 40px;
    /* padding: 5px; */
    /* font-size: 1.3em; */
    /* background-color: #323333; */
    /* color: #adadad !important; */
		
  }
	i {
	margin-top: 3px;	
  float:right;
  cursor:pointer;
	}

	/* Ends here */
	.multiselect {
		margin-bottom: 10px;
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

	/* Make the height fit on mobile, just make sure that it fits on any screen smaller than 768 */
</style>
