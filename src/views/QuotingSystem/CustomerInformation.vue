<template>
	<div>
	<div class="left-div">
		<label class="typo__label">Choose a customer</label>		 
		<multiselect v-model="selectedCustomer"
							   :options="customers"
								 track-by="customerName"
   							 label="customerName"
								 placeholder="Select a customer"
								 :allow-empty="false"
								 deselect-label="Can't remove this value" 
								 @close="customerSelected">
		</multiselect>
		<b-form-input v-model="siteRef"
									type="text"
									placeholder="Enter a site reference"></b-form-input>	
			<router-link :to="{name: 'QuoteCreation', params: { selectedCustomer: selectedCustomer, siteRef: siteRef } }">
				<b-button :disabled="disabled == 1 ? true : false" variant="outline-primary" style="margin-top: 5px;">Go to quote</b-button>
			</router-link>
		<div style="margin-top: 10px;">
			<b-button @click="cancel" variant="outline-danger">Back to stock</b-button>
			<b-button @click="toQuoteNav" variant="outline-danger">Back to quote navigation</b-button>
		</div>
	</div>
	<div class="right-div">
			<p>Customer Name: {{selectedCustomer.customerName}}</p>
			<p>Customer Reference: {{selectedCustomer.customerRef}}</p>
			<p>Customer Telephone: {{selectedCustomer.customerTel}}</p>
			<p>Customer Address: {{selectedCustomer.customerAddress}}</p>
			<p>Customer Email: {{selectedCustomer.customerEmail}}</p>
			<p>Site Reference: {{siteRef}}</p>
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
			siteRef: '',
			customers: [],
			disabled: 1,
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
		customerSelected() {
			this.disabled = 0;
		},
		toQuoteNav() {
			this.$router.push('QuoteNavigation');
		},
		getAllCustomers() {
      if(localStorage.getItem("customers") != null) { //If exists load parse customers back to array of objects
        this.customers = JSON.parse(localStorage.getItem("customers"));
      } else {
        alert("Customers need to be loaded into storage. Please go to the stock table")
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

  input {
    border: 1px solid #e8e8e8;
		font-size: 16px;
		min-height: 40px;
  }

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


</style>
