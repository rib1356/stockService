<template>
<div class="center-div">
  <label class="typo__label">Create a new batch</label>
  <multiselect v-model="selectedPlantName" 
							 :options="plantNames"  
							 placeholder="Select a plant" 
							 label="name" 
							 track-by="name"
							 :loading="isLoading"
							 :show-labels="false"
							 @input="getPlantFormSizes"
							 @close="plantSelected"
							 @open="clearFormSizes"></multiselect>			 
	<br>
	<br>
	<multiselect v-model="selectedFormSize" 
							 :options="formSizes"  
							 placeholder="Select a form size" 
							 label="formSize"
							 :loading="isLoading2"
							 :searchable="false" 
							 :show-labels="false"></multiselect>
	<br>
	<br>
	<multiselect v-model="selectedLocation" 
							 :options="locations"  
							 placeholder="Select a location" 
							 label="location" 
							 track-by="location"
							 :show-labels="false"></multiselect>		
	<br>
	<br>
	<b-form-input v-model="quantity"
                  type="text"
                  placeholder="Enter a quantity"></b-form-input>						 					 	 
	<div style="margin-top: 15px;">
		<b-button @click="cancel" variant="outline-danger">Cancel</b-button>
		<b-button @click="saveBatch" variant="outline-primary">Submit</b-button>
	</div>
</div>
  <!-- <b-card bg-variant="">

  <b-form-group breakpoint="lg"
				label="New Batch"
				label-size="lg"
				label-class="font-weight-bold pt-0"
				class="mb-0">
	<b-form-group horizontal
				  label="Name:"
				  label-class="text-sm-right"
				  label-for="nestedName">
	  <b-form-input id="nestedName" v-model="Name"></b-form-input>
		<b-form-select :options="plantNames" class="mb-3" />
	</b-form-group> 
	<b-form-group horizontal
				  label="Size:"
				  label-class="text-sm-right"
				  label-for="nestedSize">
	  <b-form-input id="nestedSize" v-model="FormSize"></b-form-input>
	</b-form-group>
	<b-form-group horizontal
				  label="Location:"
				  label-class="text-sm-right"
				  label-for="nestedLocation">
	  <b-form-input id="nestedLocation" v-model="Location"></b-form-input>
	</b-form-group>
	<b-form-group horizontal
				  label="Quantity:"
				  label-class="text-sm-right"
				  label-for="nestedQuantity">
	  <b-form-input id="nestedQuantity" v-model="Quantity"></b-form-input>
	</b-form-group>
	<b-form-group horizontal
				  label="Price:"
				  label-class="text-sm-right"
				  label-for="nestedPrice">
	  <b-form-input id="nestedPrice" v-model="WholesalePrice"></b-form-input>
	  </b-form-group>
	<b-form-group horizontal
				  label="Image:"
				  label-class="text-sm-right"
				  label-for="nestedImage"
				  button="position-left">
	  <b-button disabled id="nestedImage">Add</b-button>
	</b-form-group>

  </b-form-group>
</b-card> -->

</template>

<script>
export default {
  data () {
		return {
			plantNames: [],
			formSizes: [],
			locations: [],
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
	saveBatch() {
		// console.log("Sku: " + this.selectedPlantName.sku + " Name: " + this.selectedPlantName.name + " FormSize: " + this.selectedFormSize.formSize
		// + " Location: " + this.selectedLocation.location + " Quantity: " + this.quantity)
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
	.center-div
	{
    margin: 0 auto;
    width: 500px;
		height: 300px; 
		margin-top: 5px;
	}

	.middle-div
	{
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 500px;
    height: 300px;
	}

	@media only screen and (max-width : 768px) {
	.center-div
	{
    width: 400px;
	}

}

	/* Make the height fit on mobile, just make sure that it fits on any screen smaller than 768 */
</style>
