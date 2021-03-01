<template>
	<div>
	<quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
	<div class="left-div">
		<label class="typo__label">Choose a customer</label>		 
		<multiselect v-model="selectedCustomer"
							   :options="customers"
								 track-by="customerName"
   							 label="customerName"
								 :allow-empty="true"
								 placeholder="Select a customer"								
								 @open="selectOpened"
								 @input="customerSelected">
		</multiselect>
		<b-form-input v-model="siteRef"
									type="text"
									placeholder="Enter a site reference"></b-form-input>
		<b-form-checkbox id="checkbox" v-model="trade" @change="checkboxChange" style="margin-top: 10px;" v-if="selectedCustomer == ''">
	  Quote for a none existing customer?
	</b-form-checkbox>
		<b-form-checkbox id="checkbox2" v-model="retail" style="margin-top: 10px;" v-if="trade">
	  Check if customer is retail
	</b-form-checkbox>
	<div>					
			<router-link :to="{name: 'HomePage'}">
		<b-button class="myBtn" variant="outline-danger" style="margin-top: 5px;">Home</b-button>
			</router-link>		
			<router-link :to="{name: 'QuoteCreation', params: { selectedCustomer: selectedCustomer, 
																													singleCustomer: singleCustomer,
																													siteRef: siteRef,
																													retail: retail,
																													custFromList: custFromList} }">
				<b-button :disabled="disabled == 1 ? true : false" @click="saveCustomer" variant="outline-primary" style="margin-top: 5px;">Go to quote</b-button>
			</router-link>
			</div>
	</div>
	<div class="right-div">
		<ul id="example-1">
			<li v-for="customer in customers" :key="customer.CustomerName">
				{{ customer.customerName }} <b-button variant="outline-primary" style="margin-top: 5px;" @click="test(customer)"> select</b-button>
			</li>
			</ul>


			<p>Site Reference: <strong>{{siteRef}}</strong></p>
		<b-container>
		<b-row class="my-1">
			<b-col sm="2">
				<label for="input-ref">Customer Ref:</label>
			</b-col>
			<b-col sm="10">
				<strong v-if="trade && !retail">{{nextTRD}}</strong>
				<strong v-else-if="trade && retail">{{nextRET}}</strong>
				<strong v-else>{{selectedCustomer.customerRef}}</strong>
				<!-- <b-form-input id="input-ref" size="sm" placeholder="Enter customer ref" v-if="trade" v-model="selectedCustomer.customerRef"></b-form-input> -->
			</b-col>
		</b-row>
		<b-row class="my-1">
			<b-col sm="2">
				<label for="input-name">Customer Name:</label>
			</b-col>
			<b-col sm="10">
				<b-form-input id="input-name" @input="wew" size="sm" placeholder="Enter customer name" v-if="trade" v-model="singleCustomer.customerName"></b-form-input>
				<strong v-else>{{selectedCustomer.customerName}}</strong>
			</b-col>
		</b-row>
		<b-row class="my-1">
			<b-col sm="2">
				<label for="input-tel">Customer Telephone:</label>
			</b-col>
			<b-col sm="10">
				<b-form-input id="input-tel" size="sm" placeholder="Enter customer telephone" v-if="trade" v-model="singleCustomer.customerTel"></b-form-input>
				<strong v-else>{{selectedCustomer.customerTel}}</strong>
			</b-col>
		</b-row>
		<b-row class="my-1">
			<b-col sm="2">
				<label for="input-tel">Customer Telephone2:</label>
			</b-col>
		</b-row>
		<b-row class="my-1">
			<b-col sm="2">
				<label for="input-address">Customer Address:</label>
			</b-col>
			<b-col sm="10">
				<b-form-input id="input-address" size="sm" placeholder="Enter customer address" v-if="trade" v-model="singleCustomer.customerAddress"></b-form-input>
				<strong v-else>{{selectedCustomer.customerAddress}}</strong>
			</b-col>
		</b-row>
		<b-row class="my-1">
			<b-col sm="2">
				<label for="input-email">Customer Email:</label>
			</b-col>
			<b-col sm="10">
				<b-form-input id="input-email" size="sm" placeholder="Enter customer email" v-if="trade" v-model="singleCustomer.customerEmail"></b-form-input>
				<strong v-else>{{selectedCustomer.customerEmail}}</strong>
			</b-col>
		</b-row>

		</b-container>
	</div>
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
			pageName: 'New Quote',
			selectedCustomer: '',
			singleCustomer: {
				customerRef: '',
				customerName: '',
				customerTel: '',
				customerAddress: '',
				customerEmail: ''
			},
			siteRef: '',
			customers: [],
			disabled: 1,
			trade: false,
			retail: false,
			nextTRD: null,
			nextRET: null,
			custFromList: false,
		}		
  },
  methods: {
		test(customer)
		{
			console.log(customer);
		},
		checkboxChange() {
			if(this.trade) {
				this.disabled = 1;
				this.retail = false;
				}
		},
		wew() {
			if(this.singleCustomer.customerName === null || this.singleCustomer.customerName === '') {
				this.disabled = 1;
			} else {
				this.disabled = 0;
			}
		},
		selectOpened() {
			if(this.trade){
				this.trade = false;
			}
		},
		cancel() {
			this.$router.push('StockTable');
		},
		customerSelected() {
			this.disabled = 0;
			this.custFromList = true;
			if(this.selectedCustomer == '') {
				this.trade = false;
				this.retail = false;
				this.disabled = 1;
			} 
		},
		saveCustomer() {
			var custRef;
			this.custFromList = false;
			if(this.retail){ //Get the customer reference based upon what value has been selected
				custRef = this.nextRET;
			} else {
				custRef = this.nextTRD;
			}
			if(this.trade) { //If the customer isnt chosen from dropdown save to database so it can be referenced on the quote
				this.axios.post('https://ahillsquoteservice.azurewebsites.net/api/Customer', {
					CustomerReference: custRef,
					CustomerName: this.singleCustomer.customerName,
					CustomerTel: this.singleCustomer.customerTel,
					CustomerAddress: this.singleCustomer.customerAddress,
					CustomerEmail: this.singleCustomer.customerEmail,
					SageCustomer: false //not a sage customer so value will always be false
				}) 
				.then((response) => {
					console.log(response);
					this.getCustomers();
					this.singleCustomer['customerRef'] = custRef;
					this.$router.push('QuoteCreation')
				})
				.catch((error) => {
					alert("Error saving customer");
					console.log(error);
				});
			}
		},
		getCustomers(){
			this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/customer/all')
				.then((response) => {
					this.parseCustomers(response.data);
				})
				.catch((error) => {
						alert(error);
			});
		},
		parseCustomers(data) { //Push customers into an array of objects then save to local storage#
			var cust = [];
			for(var i = 0; i < data.length; i++){
				cust.push({ //Create an array of objects
					"customerName": data[i].CustomerName,    //Data coming in is string so just assign values in object to be displayed
					"customerRef": data[i].CustomerReference,
					"customerTel": data[i].CustomerTel,
					"customerAddress": data[i].CustomerAddress,
		  		"customerEmail": data[i].CustomerEmail,
					"sageCustomer": data[i].SageCustomer,
					"customerTel2": data[i].CustomerTel2,
				});
			}
			sessionStorage.removeItem("customers"); //Remove the previous list of customers
			sessionStorage.setItem("customers", JSON.stringify(cust)); //Save the new customers to storage
			
			this.displaySageCustomers(cust);
			this.getRetailTradeReferences(cust);
		},
		getAllCustomers() {
	  if(sessionStorage.getItem("customers") != null) { //If exists load parse customers back to array of objects
				let cust = JSON.parse(sessionStorage.getItem("customers"));
				this.displaySageCustomers(cust);
				this.getRetailTradeReferences(cust);
	  } else {
				alert("Customers being loaded from database")
				this.getCustomers();
				
	  }
		},
		displaySageCustomers(customers) {
			customers.forEach(element => {
				if(element.sageCustomer) {
					this.customers.push(element);
				}
			});	
		},
		getRetailTradeReferences(customers) {
			var tradeArr = [];
			var retailArr = [];
			customers.forEach(element => {
				if(!element.sageCustomer) {
					if(element.customerRef.includes("TRD")) { //Loop through all of the none Sage Customers
						tradeArr.push(element.customerRef.slice(3)); //Create an array of the current customerReferences
					} else if (element.customerRef.includes("RET")) {
						retailArr.push(element.customerRef.slice(3))
					}
				}
			}); 
			//Get the last number used for the reference to increment the value and create a new reference
			this.nextTRD = "TRD"+(parseInt(tradeArr.slice(-1).pop())+1);
			this.nextRET = "RET"+(parseInt(retailArr.slice(-1).pop())+1);
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
			background-color: #15c015;
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
