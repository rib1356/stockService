<template>
	<div>
	<div class="left-div">
		<label class="typo__label">Choose a customer</label>		 
		<multiselect v-model="selectedCustomer"
							   :options="customers"
								 track-by="name"
   							 label="name"
								 placeholder="Select a customer" >
		</multiselect>
		<div style="margin-top: 15px;">
			<b-button @click="cancel" variant="outline-danger">Cancel</b-button>
			<router-link :to="{name: 'QuoteExample', params: { selectedCustomer: selectedCustomer } }">
				<b-button variant="outline-primary">Go to quote</b-button>
			</router-link>
		</div>
	</div>
	<div class="right-div">
			<p>Customer Name: {{selectedCustomer.name}}</p>
			<p>Customer Number: {{selectedCustomer.number}}</p>
			<p>Customer Telephone: {{selectedCustomer.tel}}</p>
			<p>Customer Address: {{selectedCustomer.address}}</p>
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
			customers: [
				{name: 'LandscaperA', number: 'T0001', tel: '01642 12345', address: 'AddressA'},
				{name: 'LandscaperB', number: 'T0002', tel: '01642 67891', address: 'AddressB'},
				{name: 'LandscaperC', number: 'T0002', tel: '01642 01112', address: 'AddressC'},
			]
		}		
  },
  methods: {
		toQuote() {
			console.log(this.customerName);
			this.$router.push('QuoteExample');
		},
		cancel() {
			this.$router.push('StockTable');
		},
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


</style>
