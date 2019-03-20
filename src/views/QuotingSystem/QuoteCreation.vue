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
		<b-form-input v-model="comment"
									placeholder="Enter a plant comment"
									type="text"
									style="margin-top: 10px;"
									@keyup.enter="validateBeforeSubmit"></b-form-input>	
		<b-button @click="saveQuote" variant="outline-success" style="margin-top: 5px;">Save Quote</b-button>																
		<b-button @click="validateBeforeSubmit" variant="outline-primary" style="margin-top: 5px;">Add plant</b-button>																
		<!-- <br> -->
		<!-- <b-button @click="boop" variant="outline-primary" style="margin-top: 5px;">create PDF</b-button>																 -->
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
            {{ data.PlantName }} | {{data.FormSize}} x ({{data.Quantity}}) @ £{{getPrice(data.Price)}} {{data.Comment}}
            <i class="fas fa-trash-alt" @click="remove(index)"></i>
          </li>
      </ul>
	</div>
	<b-modal ref="createPDFModal" size="sm" title="Create a quote PDF?" centered hide-footer hide-header-close no-close-on-backdrop>
		<div class="modal__footer">
      <router-link to="/ExistingQuotes">
      	<b-button variant="outline-danger">Back to quotes</b-button>
    	</router-link>
      <b-btn variant="outline-primary" @click="createPDF">Create PDF</b-btn>
    </div>
  </b-modal>
</section>
</template>

<script>
import moment from 'moment'
import jsPDF from 'jspdf'
import 'jspdf-autotable';
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
			comment: null,
			customerInfo: '',
			batches: [],
			selectedBatch: null,
			totalPrice: 0,
			quoteId: '',
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
							+ "&body=" + escape("This is the body: " + JSON.stringify(this.plants));
			window.location.href = link;
		},
		saveQuote() {
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
				this.quoteId = response.data
				this.$refs.createPDFModal.show()
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
				Comment: this.comment,
				Price: this.selectedBatch.batchPrice,
				Active: true,
			});
			this.getTotalPrice(); //Once a plant is added recalculate the current quote price
			this.selectedBatch = null
			this.quantity = null
			this.comment = null
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
		customLabel ({ plantName, formSize, quantity }) { //Returns a custom label to be used on the dropdown
      return `${plantName} | ${formSize} | Qty: (${quantity})`
		},
		createPDF () {
			let pdfName = this.quoteId + "-" + this.customerInfo.customerName + "-" + this.quoteDate; 
			var columns = [
				{title: "Plant Name", dataKey: "PlantName"},
				{title: "Form Size", dataKey: "FormSize"},
				{title: "Quantity", dataKey: "Quantity"},
				{title: "Comment", dataKey: "Comment"},
				{title: "Price", dataKey: "Price"},
			];
			var companyLogo = {
				src: 'data:image/png;base64,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'
			}
			var companyInfo = "Station Nurserys\n" +
												"Stokesley\n" +
												"Middlesbrough\n" +
												"TS9 7AB\n" +
												"Tel: 01642 711281\n" +
												"Email: enquiries@hillandsons.co.uk\n" +
												"Web: hillandsons.co.uk\n" +
												"Stock: hillsstock.co.uk"
			var quoteInfo =	"Quote Id: " + this.quoteId + "\n" +
			 								"Customer Name: " + this.customerInfo.customerName + "\n" +
											"Customer Ref: " + this.customerInfo.customerRef + "\n" +
											"Start Date: " + this.quoteDate + "\n" +
											"Expiry Date: " + this.expiryDate				
			var deliveryInfo = "Customer Name: " + this.customerInfo.customerName + "\n" +
												 "Customer Ref: " + this.customerInfo.customerRef + "\n" +
												 "Customer Tel: " + this.customerInfo.customerTel + "\n" +
												 "Customer Email: " + this.customerInfo.customerEmail + "\n" +
												 "Customer Address: "+ this.customerInfo.customerAddress + "\n"
			var doc = new jsPDF('p', 'pt');
			doc.addImage(companyLogo.src, 'PNG', 30, 30, 100, 75);
			doc.setFontSize(20);
			doc.text("Quotation", 450, 35)
			doc.setFontSize(10);
			doc.text(companyInfo, 135, 35);
			doc.text(quoteInfo, 443, 50);
			doc.text("Site Reference: " + this.siteRef, 420, 160);
			doc.setFontSize(15);
			doc.text("Quote Price: £" + (this.totalPrice/100).toFixed(2), 420, 185)
			doc.setLineWidth(1);
			doc.line(0,125,700,125) 
			doc.setFontSize(10);
			doc.text(deliveryInfo, 40, 140)
			doc.autoTable(columns, this.plants, {theme: 'striped', startY: 200});
			doc.save(pdfName + '.pdf');

			this.$router.push('QuoteNavigation');
  	},
		getQuoteDate() {
			this.quoteDate = moment(new Date).format('DD/MM/YYYY');
			this.expiryDate = moment(new Date).add('30', 'days').format('DD/MM/YYYY')
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
