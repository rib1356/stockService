<template>
  <div>
		<div class="left-div">
		<router-link to="/Pricing" class="my-nav">
    	<b-button variant="outline-primary" class="my-btn" style="margin-bottom:5px; ">Back to batch list</b-button>
    </router-link>
		
		<ul>
  		<li class="text-danger" :key="error" v-for="error in errors.all()">{{ error }}</li>
		</ul>
		<b-form-group horizontal label="Price all:" >
      <b-form-input 
                    placeholder="Price all"
										class="price-input"
										v-model="priceAll"
										@input="changeAllPrices"
										/>
    </b-form-group>
		<ul>
    	<li v-for="(data, index) in selectedBatches" :key='index' class="price-list">
				<b-form-group horizontal :label="customLabel(data.plantName, data.formSize)" >
					<b-form-input v-model="data.batchPrice" 
												placeholder="Enter price"
												class="price-input"
												name="batchPrice"
												v-validate="'required|decimal:2|min_value:0.01'"></b-form-input>
				</b-form-group>	
				<!-- <p class="text-danger" v-if="errors.has('data')">{{ errors.first('data') }}</p> -->
				<!-- v-validate="'required|decimal:2|min_value:0.01'" -->
				<!-- <p class="text-danger" v-show ="errors.has('batchPrice')">{{ errors.first('batchPrice') }}</p> -->
      </li>
   	</ul>
		<b-button variant="outline-success" @click="validateBeforeSubmit" class="my-btn" style="margin-bottom:5px; ">Save Edits</b-button>
		</div>
		<div class="right-div">
			<h4>Suggested Prices</h4>
			<p>These batches have the current prices in the database</p>
			<ul>
				<li v-for="(data, index) in similarBatches" :key='index' class="price-list">
						{{data.plantName}} | {{data.formSize}}. PRICED AT: {{data.batchPrice/100}}
				</li>
			</ul>
		</div>
  </div>
</template>

<script>
  export default {
		data() {
			return {
				selectedBatches: null,
				priceAll: '',
				similarBatches: [],
			}
		},
		methods: {
			savePriceChanges() {
				let batchesToPrice = [];				
				this.selectedBatches.forEach(element => { //Loop through the current array to create an object that can be accepted by the API
					batchesToPrice.push({'BatchId': element.batchId, 'Price': parseFloat(element.batchPrice)*100})
				});
				this.axios.put('https://ahillsbatchservice.azurewebsites.net/Batches/edit', batchesToPrice) 
				.then((response) => {
					console.log(response);
					this.$router.push('Pricing');
				})
				.catch((error) => {
					console.log(error);
				});
			},
			changeAllPrices() {
				for (let i = 0; i < this.selectedBatches.length; i++) {
					this.selectedBatches[i].batchPrice = this.priceAll;
				}
			},
			validateBeforeSubmit(e) { //Check that all validation passes before adding
				this.$validator.validateAll();
				if (!this.errors.any()) { 
						this.savePriceChanges();
				}
			},
			compareBatches() {
				let batches = JSON.parse(sessionStorage.getItem('batchList'));
			
				for (let i = 0; i < this.selectedBatches.length; i++) {
					let plantName = this.selectedBatches[i].plantName; //Get the current name and formSize of the plant being checked
					let formSize = this.selectedBatches[i].formSize;
					//Create an array of objects where the plantName and formSize batch in all of the batches
					let selectedPlant = batches.filter(batches => (batches.plantName === plantName && batches.formSize === formSize))
					if(selectedPlant.length > 1) {
						selectedPlant.forEach(element => {
							this.similarBatches.push(element);	//Loop through the new array and add these values to be displayed on the page
						});
					}
				}
			},
			customLabel(plantName, formSize) {
				return `${plantName} | ${formSize}`
			},
			price() {
				return (this.selectedBatches.batchPrice/100).toFixed(2);
			}
		},
		created() {
		this.selectedBatches = this.$route.params.selectedBatches; //Get the selected batches that are passed through the routerLink
		this.compareBatches();
		}
	}
</script>

<style scoped>

	.left-div
	{
    width: 65%;
		float: left;
		/* overflow: auto; */
	}

	.right-div {
		float:left;
		text-align: left;
		width:35%;
		/* overflow:hidden; */
	}

.price-input {
	width: 30%;
	align-self: right;
}

.price-list {
	align-content: center;
	margin: auto;
}

</style>