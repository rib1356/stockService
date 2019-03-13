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
                placeholder="Enter a quantity"
								type="number"
                pattern="[0-9]*"
								name="quantity"
								inputmode="numeric"></b-form-input>	
	<b-modal ref="imageAskModal" size="sm" title="Add a batch image?" centered hide-footer hide-header-close no-close-on-backdrop>
		<div class="modal__footer">
      <b-btn class="mt-3" variant="outline-danger" @click="noImage">No Image</b-btn>
      <b-btn class="mt-3" variant="outline-primary" @click="addImage">Add Image</b-btn>
    </div>
  </b-modal>							
	<picture-modal style=""></picture-modal>											 					 	 
	<div style="margin-top: 30px;">
		<b-button @click="cancel" variant="outline-danger">Cancel</b-button>
		<b-button @click="saveBatch" variant="outline-primary">Submit</b-button>
	</div>
</div>
</template>

<script>
import PictureModal from '@/components/PictureModal';

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
			value: false,
		}		
  },
	components: {
		PictureModal
	},
  methods: {
	cancel() {
		this.$router.push('StockTable');
	},
	noImage() {
		this.$router.push('StockTable');
	},
	addImage() {
		this.$root.$emit('PictureModal'); //Display the picture modal when button pressed
	},
	saveBatch() {
		this.axios.post('https://ahillsbatchservice.azurewebsites.net/api/Batches', {
			"Sku": this.selectedPlantName.sku,
			"Name": this.selectedPlantName.name,
			"FormSize": this.selectedFormSize.formSize,
			"Location":  this.selectedLocation.location,
			"Quantity": this.quantity,
			"WholesalePrice": null,
			"ImageExists": false,
			"Active": true,
		})
		.then((response) => {
			console.log(response);
			var newBatch = new this.newBatchInformation(); //Save these values so when a new image is taken it will know the
      newBatch.Id = response.data.Id								//batchId and the name to create a unique ID
      newBatch.Name = response.data.Name
      sessionStorage.setItem('newBatchInformation', JSON.stringify(newBatch)); //Save information to be used by PictureModal
			this.$refs.imageAskModal.show() //Show the modal to see if the user wants to add an image to the batch
		})
		.catch((error) => {
			alert("Please check values before submitting")
			console.log(error);
		});
	},
	newBatchInformation(batchId, plantName) {
		var batchId, plantName
	},
	getPlantNames() {
		this.isLoading = true; //Show the loading wheel on dropdown
		this.axios.get('https://ahillsplantservice.azurewebsites.net/api/plant')
      .then((response) => {
				this.transformPlantNames(response.data);
      })
      .catch((error) => {
          alert(error);
      });
	},
	transformPlantNames(data) { //Create an object with each of the plant names and their skus and add to an array
		for(var i = 0; i < data.length; i++){ //These will be displayed in the dropdown
      this.plantNames.push({ 
				"name": data[i].plantName, 
				"sku": data[i].Sku
      });
			this.isLoading = false;
    }
	},
	getPlantFormSizes() { //Query the database to get the form sizes from what plant has been chosen
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
	getLocations() { //Get the locations from the database
		this.axios.get('https://ahillslocationservice.azurewebsites.net/api/locations')
      .then((response) => {
				this.transformLocations(response.data);
      })
      .catch((error) => {
        alert(error);
      });
	},
	transformLocations(data) {
		for(var i = 0; i < data.length; i++){ //Concat the locations and push an object into the array so it can be displayed
      this.locations.push({ //Create an array of objects
				"location": data[i].MainLocation + data[i].SubLocation
    });
    }
	},
	plantSelected() { //When a plant has been selected show a loading wheel while the form sizes are been retrieved
		this.isLoading2 = true;
	},
	clearFormSizes() { //When selecting a new plant from the dropdown clear the selected form size
		this.selectedFormSize = '';
	}
	},
	mounted() {
		sessionStorage.removeItem('selectedBatchInformation'); //Make sure that no previous information is saved in storage
		sessionStorage.removeItem('newBatchInformation');
		this.getPlantNames(); //Retrieve the data on load of the page
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
