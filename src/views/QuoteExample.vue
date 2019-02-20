<template>
<section>
	<div class="left-div">
		<label class="typo__label">Choose a plant to add to a quote</label>
		<!-- <button @click="sendEmail">Test</button> -->
		<multiselect v-model="selectedPlantName" 
								:options="plantNames"  
								placeholder="Select a plant" 
								label="name" 
								track-by="name"
								:loading="isLoading"
								:show-labels="false"
								@input="getPlantFormSizes"
								@close="plantSelected"
								@open="clearFormSizes"
								class="multiselect"></multiselect>			 
		<multiselect v-model="selectedFormSize" 
								:options="formSizes"  
								placeholder="Select a form size" 
								label="formSize"
								:loading="isLoading2"
								:searchable="false" 
								:show-labels="false"></multiselect>
		<b-form-input v-model="quantity"
										type="text"
										placeholder="Enter a quantity"></b-form-input>	
		<div style="margin-top: 15px;">
			<b-button @click="cancel" variant="outline-danger">Cancel</b-button>
			<b-button @click="addToList" variant="outline-primary">Add to list</b-button>
		</div>
	</div>
	<div class="right-div">
		<div>
			<p>Customer Name: {{customerInfo.name}}</p>
			<p>Customer Number: {{customerInfo.number}}</p>
			<p>Customer Telephone: {{customerInfo.tel}}</p>
			<p>Customer Address: {{customerInfo.address}}</p>
			<p>Quote Date: {{currentDate}}</p>
			<p>Expiry Date: {{expiryDate}}</p>
		</div>
		<p>Quote List</p>
      <ul>
          <li v-for="(data, index) in plants" :key='index'>
            {{ data.name }} {{data.formSize}} x {{data.quantity}}
            <i class="fas fa-trash-alt" v-on:click="remove(index)"></i>
          </li>
      </ul>
	</div>
</section>
</template>

<script>
import moment from 'moment'
export default {
  data () {
		return {
			plantNames: [],
			formSizes: [],
			plantName: '',
			plants: [],
			selectedPlantName: '',
			selectedFormSize: '',
			quantity: '',
			wholesalePrice: '',
			isLoading: false,
			isLoading2: false,
			currentDate: null,
			expiryDate: null,
			customerInfo: '',
		}		
	},
  methods: {
		cancel() {
				this.$router.push('StockTable');
		},
		remove(id) {
			this.plants.splice(id,1);
		},
		sendEmail() {
			var link = "mailto:me@example.com"
							+ "?cc="
							+ "&subject=" + escape("Plant enquiry")
							+ "&body=" + escape("This is the body: " + JSON.stringify(this.plants))
			;

			window.location.href = link;
		},
		addToList() {
			this.plants.push({
				name: this.selectedPlantName.name,
				formSize: this.selectedFormSize.formSize,
				quantity: this.quantity,
			});
			this.selectedPlantName = ''
			this.selectedFormSize = ''
			this.quantity = ''
		},
		getPlantNames() {
			this.isLoading = true;
			this.axios.get('https://ahillsplantservice.azurewebsites.net/api/plant')
				.then((response) => {
					this.transformPlantNames(response.data);
				})
				.catch((error) => {
						alert(error);
				});
		},
		transformPlantNames(data) {
			for(var i = 0; i < data.length; i++){
				this.plantNames.push({ //Create an array of objects
					"name": data[i].plantName,    //Data coming in is string so just assign values in object to be displayed
					"sku": data[i].Sku
				});
				this.isLoading = false;
			}
		},
		getPlantFormSizes() {
			this.axios.get('https://ahillsplantservice.azurewebsites.net/api/FormSizes?sku=' + this.selectedPlantName.sku)
				.then((response) => {
					this.transformFormSizes(response.data);
				})
				.catch((error) => {
					alert(error);
				});
		},
		transformFormSizes(data) {
			this.formSizes = [];
			this.isLoading2 = false;
			for(var i = 0; i < data.length; i++){
				var potSize;
				var RootType;
				//String modifying so that it reads more like "FormSizes"
				if (data[i].PotSize == 0) { //If the pot size = 0 it is a RB/BR/WRB so hide the potsize
					potSize = "";
					RootType = data[i].RootType;
				} else if (data[i].RootType == "CG") {
					potSize = "C" + data[i].PotSize;
					RootType = "";
				} else {
					potSize = "AP" + data[i].PotSize;
					RootType = ""
				}
				var formSize = potSize
					+ " " + data[i].HeightSpread
					+ " " + data[i].Girth
					+ " " + data[i].Age 
					+ " " + RootType
					+ " " + data[i].Description
				this.formSizes.push({
					"formSize": formSize,
				});
			}
		},
		getQuoteDate() {
			this.currentDate = moment().format('DD/MM/YYYY');
			this.expiryDate = moment().add('30', 'days').format('DD/MM/YYYY')
		},
		plantSelected() {
			this.isLoading2 = true;
		},
		clearFormSizes() {
			this.selectedFormSize = '';
		}
	},
	mounted() {
		this.getPlantNames();
		this.getQuoteDate();
	},
	created() {
		this.customerInfo = this.$route.params.selectedCustomer;
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
		height: 300px; 
    /* background: red; */
		float:left;
		overflow:hidden;
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
		font-size: 14px;
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
