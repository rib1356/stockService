<template>
<div class="container">
	<div class="left-div">
		<label class="typo__label">Choose a plant to add to a quote</label>
		<form @submit.prevent="addPlant">
			<input type="text" placeholder="Enter a plant name" v-model="plantName">
			<button>Add to list</button>
		</form>
		<!-- <multiselect v-model="selectedPlantName" 
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
		<multiselect v-model="selectedLocation" 
								:options="locations"  
								placeholder="Select a location" 
								label="location" 
								track-by="location"
								:show-labels="false"></multiselect>		
		<b-form-input v-model="quantity"
										type="text"
										placeholder="Enter a quantity"></b-form-input>						 					 	  -->
		<div style="margin-top: 15px;">
			<b-button @click="cancel" variant="outline-danger">Cancel</b-button>
			<!-- <b-button @click="saveBatch" variant="outline-primary">Submit</b-button> -->
		</div>
	</div>
	<div class="right-div">
		<p>Quote List</p>
      <ul>
          <li v-for="(data, index) in plants" :key='index'>
            {{ data.name }}
            <i class="fa fa-minus-circle" v-on:click="remove(index)"></i>
          </li>
      </ul>
	</div>
</div>
</template>

<script>
export default {
  data () {
		return {
			plantNames: [],
			formSizes: [],
			locations: [],
			plantName: '',
			plants: [],
			selectedPlantName: '',
			selectedFormSize: '',
			selectedLocation: '',
			quantity: '',
			wholesalePrice: '',
			isLoading: false,
			isLoading2: false,
		}		
  },
  methods: {
	cancel() {
	  	this.$router.push('StockTable');
	},
	addPlant() {
		this.plants.push({name: this.plantName})
		this.plantName = '';
	},
	remove(id) {
    this.plants.splice(id,1);
  },
	saveBatch() {
		this.axios.post('https://ahillsbatchservice.azurewebsites.net/api/Batches', {
			"Sku": this.selectedPlantName.sku,
			"Name": this.selectedPlantName.name,
			"FormSize": this.selectedFormSize.formSize,
			"Location":  this.selectedLocation.location,
			"Quantity": this.quantity,
			"WholesalePrice": null,
			"Image": null,
			"Active": true,
		})
		.then((response) => {
			console.log(response);
			alert("Batch created");
			this.$router.push('StockTable');
		})
		.catch((error) => {
			alert("Please check values before submitting")
			console.log(error);
		});
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
	getLocations() {
		this.axios.get('https://ahillslocationservice.azurewebsites.net/api/locations')
      .then((response) => {
				this.transformLocations(response.data);
      })
      .catch((error) => {
        alert(error);
      });
	},
	transformLocations(data) {
		for(var i = 0; i < data.length; i++){
      this.locations.push({ //Create an array of objects
				"location": data[i].MainLocation + data[i].SubLocation
    });
    }
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
		this.getLocations();
	}
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"; 
	.container {
		float: left;
		display: flex;
		/* margin-top: 25px; */
	}

	.left-div
	{
		align-items: flex-start;
    width: 500px;
		height: 300px; 
		/* background: green; */
	}

	.right-div {
		align-items: stretch;
		flex-grow: 1;
		/* background: blue */
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
    color: gray;
  }
  .container {
    box-shadow: 0px 0px 40px lightgray;
  }
  input {
    width: calc(100% - 40px);
    border: 0;
    padding: 5px;
    /* font-size: 1.3em; */
    background-color: #323333;
    color: #687F7F;
  }
	i {
  float:right;
  cursor:pointer;
	}

	/* Ends here */
	.multiselect {
		margin-bottom: 10px;
	}

	@media only screen and (max-width : 768px) {
	.center-div
	{
    width: 100%;
	}

}

	/* Make the height fit on mobile, just make sure that it fits on any screen smaller than 768 */
</style>
