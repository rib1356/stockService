<template>
	<div>
	<quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
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
		<!-- <div style="margin-top: 10px;">
			<b-button @click="cancel" variant="outline-danger">Back to stock</b-button>
			<b-button @click="toQuoteNav" variant="outline-danger">Back to quote navigation</b-button>
		</div> -->
	</div>
	<div class="right-div">
			<p>
				Customer Name: <strong>{{selectedCustomer.customerName}} ||</strong>
				Customer Reference: <strong>{{selectedCustomer.customerRef}} ||</strong>
				Customer Telephone: <strong>{{selectedCustomer.customerTel}}</strong>
			</p>
			<p>
				Customer Address: <strong>{{selectedCustomer.customerAddress}} ||</strong>
				Customer Email: <strong>{{selectedCustomer.customerEmail}} ||</strong>
			</p>
			<p>Site Reference: <strong>{{siteRef}}</strong></p>
	</div>
	
		<!-- <button @click="toQuote" >Click me</button> -->
	</div>	
</template>

<script>
import QuoteNavbar from '@/components/QuoteNavbar.vue'
export default {
	components: {
		QuoteNavbar,
	},
  data () {
		return {
			pageName: 'Customer Selection',
			selectedCustomer: '',
			siteRef: '',
			customers: [],
			disabled: 1,
		}		
  },
  methods: {
		toQuote() {
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
		float:left;
	}

	.right-div {
		margin-top: 2%;
		float:left;
		width:75%;
		/* overflow:hidden; */
	}

  input {
    border: 1px solid #e8e8e8;
		font-size: 16px;
		min-height: 40px;
  }

	.multiselect {
		margin-bottom: 10px;
	}

	.navbar-custom {
			background-color: #2a6105;
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
