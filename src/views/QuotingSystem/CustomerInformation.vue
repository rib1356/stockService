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
								 :allow-empty="true"
								 deselect-label="Can't remove this value" 
								 @close="customerSelected">
		</multiselect>
		<b-form-input v-model="siteRef"
									type="text"
									placeholder="Enter a site reference"></b-form-input>
		<b-form-checkbox id="checkbox" v-model="status" @change="checkboxChange" v-if="!disabled">
      Manually enter customer information
    </b-form-checkbox>
    <div>							
			<router-link :to="{name: 'QuoteCreation', params: { selectedCustomer: selectedCustomer, siteRef: siteRef } }">
				<b-button :disabled="disabled == 1 ? true : false" variant="outline-primary" style="margin-top: 5px;">Go to quote</b-button>
			</router-link>
			</div>
	</div>
	<div class="right-div">
			<!-- <p>
				Customer Name: <strong>{{selectedCustomer.customerName}} ||</strong>
				Customer Reference: <strong>{{selectedCustomer.customerRef}} ||</strong>
				Customer Telephone: <strong>{{selectedCustomer.customerTel}}</strong>
			</p>
			<p>
				Customer Address: <strong>{{selectedCustomer.customerAddress}} ||</strong>
				Customer Email: <strong>{{selectedCustomer.customerEmail}} ||</strong>
			</p> -->
			<p>Site Reference: <strong>{{siteRef}}</strong></p>
	<b-container>
  <b-row class="my-1">
    <b-col sm="2">
      <label for="input-name">Customer Name:</label>
    </b-col>
    <b-col sm="10">
      <b-form-input id="input-name" size="sm" placeholder="Enter customer name" v-if="status" v-model="selectedCustomer.customerName"></b-form-input>
			<strong v-else>{{selectedCustomer.customerName}}</strong>
    </b-col>
  </b-row>
  <b-row class="my-1">
    <b-col sm="2">
      <label for="input-ref">Customer Ref:</label>
    </b-col>
    <b-col sm="10">
      <b-form-input id="input-ref" size="sm" placeholder="Enter customer ref" v-if="status" v-model="selectedCustomer.customerRef"></b-form-input>
			<strong v-else>{{selectedCustomer.customerRef}}</strong>
    </b-col>
  </b-row>
  <b-row class="my-1">
    <b-col sm="2">
      <label for="input-tel">Customer Telephone:</label>
    </b-col>
    <b-col sm="10">
      <b-form-input id="input-tel" size="sm" placeholder="Enter customer telephone" v-if="status" v-model="selectedCustomer.customerTel"></b-form-input>
			<strong v-else>{{selectedCustomer.customerTel}}</strong>
    </b-col>
  </b-row>
  <b-row class="my-1">
    <b-col sm="2">
      <label for="input-address">Customer Address:</label>
    </b-col>
    <b-col sm="10">
      <b-form-input id="input-address" size="sm" placeholder="Enter customer address" v-if="status" v-model="selectedCustomer.customerAddress"></b-form-input>
			<strong v-else>{{selectedCustomer.customerAddress}}</strong>
    </b-col>
  </b-row>
  <b-row class="my-1">
    <b-col sm="2">
      <label for="input-email">Customer Email:</label>
    </b-col>
    <b-col sm="10">
      <b-form-input id="input-email" size="sm" placeholder="Enter customer email" v-if="status" v-model="selectedCustomer.customerEmail"></b-form-input>
			<strong v-else>{{selectedCustomer.customerEmail}}</strong>
    </b-col>
  </b-row>

	</b-container>
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
			status: false
		}		
  },
  methods: {
		checkboxChange() {
			// this.selectedCustomer = '';
		},
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
