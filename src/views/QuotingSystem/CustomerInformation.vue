<template>
	<div>
	<div class="left-div">
		<label class="typo__label">Choose a customer</label>		 
		<multiselect v-model="selectedCustomer"
							   :options="customers"
								 track-by="customerName"
   							 label="customerName"
								 placeholder="Select a customer" >
		</multiselect>
		<div style="margin-top: 15px;">
			<b-button @click="cancel" variant="outline-danger">Cancel</b-button>
			<b-button @click="toQuoteNav" variant="outline-primary">Back to quote navigation</b-button>
			<router-link :to="{name: 'QuoteCreation', params: { selectedCustomer: selectedCustomer } }">
				<b-button variant="outline-primary">Go to quote</b-button>
			</router-link>
		</div>
	</div>
	<div class="right-div">
			<p>Customer Name: {{selectedCustomer.customerName}}</p>
			<p>Customer Reference: {{selectedCustomer.customerRef}}</p>
			<p>Customer Telephone: {{selectedCustomer.customerTel}}</p>
			<p>Customer Address: {{selectedCustomer.customerAddress}}</p>
			<p>Customer Email: {{selectedCustomer.customerEmail}}</p>
	</div>
	
		<!-- <button @click="toQuote" >Click me</button> -->
	</div>	
</template>

<script>
//
export default {
  data () {
		return {
			selectedCustomer: '',
			customers: []
		}		
  },
  methods: {
		toQuote() {
			console.log(this.customerName);
			this.$router.push('QuoteCreation');
		},
		cancel() {
			this.$router.push('StockTable');
		},
		toQuoteNav() {
			this.$router.push('QuoteNavigation');
		},
		getAllCustomers() {
			this.axios.get('http://ahillsquoteservice.azurewebsites.net/api/customer/all')
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
				this.isLoading = false;
			}
		},

	},
	mounted() {
		this.getAllCustomers();
	}
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>

	.left-div
	{
    width: 25%;
		height: 300px; 
    /* background: red; */
		float:left;
		overflow:hidden;
		/* background: green; */
	}

	.right-div {
		margin-top: 2%;
		float:left;
		width:25%;
		overflow:hidden;
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
