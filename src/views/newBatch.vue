<template>
<div>
	<misc-navbar class="navbar-custom" id="navbar" v-bind:pageName='pageName'></misc-navbar>
	<br>
		<div class="row">
			<div class="col-xs-6 col-md-6">
				<h5>Add to stock from Pannebakker's list of names/formsizes</h5>
			</div>
				<div class="col-xs-6 col-md-6">
				<h5>Add to stock from Hills list</h5>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-6 col-md-6">
				<b-button @click="openPlantPickerModal" variant="success" style="margin-top: 5px;">Search for PB name</b-button>		
			</div>
			<div class="col-xs-6 col-md-6">
				<b-button @click="openHillsPlantPickerModal" variant="success" style="margin-top: 5px;">Search for Hills name</b-button>		
			</div>
		</div>
		<div class="row">
			<div class="offset-md-4 col-xs-12 col-md-4">
				Current Selected Plantname: {{selectedPlantName}}
			</div>
		</div>
		<div class="row">
			<div class="offset-md-4 col-xs-12 col-md-4">
				Current Selected Formsize: {{selectedFormSize}}
			</div>
		</div>
		<div class="row">
			<div class="offset-md-4 col-xs-12 col-md-4">
					<multiselect v-model="selectedLocation" 
								:options="locations"  
								placeholder="Select a location" 
								label="location" 
								track-by="location"
								:show-labels="false"></multiselect>		
			</div>
		</div>
		<div class="row">
			<div class="offset-md-4 col-xs-12 col-md-4">
					<b-form-input v-model="saleableQuantity"
									placeholder="Enter a selling quantity"
									type="number"
									pattern="[0-9]*"
									name="quantity"
									inputmode="numeric"
									style="margin-bottom: 10px;"></b-form-input>	
			</div>
		</div>
		<div class="row">
			<div class="offset-md-4 col-xs-12 col-md-4">
				<b-form-input v-model="growingQuantity"
									placeholder="Enter a growing quantity"
									type="number"
									pattern="[0-9]*"
									name="growingQuantity"
									inputmode="numeric"
									style="margin-bottom: 10px;"></b-form-input>	
			</div>
		</div>
		<div class="row">
			<div class="offset-md-4 col-xs-12 col-md-4">
				<b-form-input v-model="wholesalePrice"
									placeholder="Enter a wholesale price"
									type="number"
									name="wholesalePrice"
									inputmode="numeric"
									v-validate="'decimal:2|min_value:0.01'"
									style="margin-bottom: 10px;"></b-form-input>	
			</div>
		</div>
		<div class="row">
			<div class="offset-md-4 col-xs-12 col-md-4">
				<b-form-input v-model="comment"
									placeholder="Enter a batch comment (can be nothing)"
									name="comment"></b-form-input>	
			</div>
		</div>
		<div class="row">
			<div class="offset-md-4 col-xs-12 col-md-4">
				<div style="margin-top: 30px;">
					<b-button @click="cancel" variant="outline-danger">Back To Home</b-button>
					<b-button @click="noImage" variant="outline-danger">Back To Stock</b-button>
					<b-button @click="saveBatch" variant="outline-primary">Submit</b-button>
				</div>
			</div>
		</div>
		<p class="text-danger" v-if="errors.has('wholesalePrice')">{{ errors.first('wholesalePrice') }}</p>
		<!-- <multiselect v-model="selectedPlantName" 
								:options="plantNames"  
								placeholder="Select a plant" 
								label="name" 
								track-by="name"
								:loading="isLoading"
								:show-labels="false"
								@input="getPlantFormSizes"
								@open="clearFormSizes"
								class="multiselect"></multiselect>			  -->
		<!-- <multiselect v-model="selectedFormSize" 
								:options="formSizes"  
								placeholder="Select a form size" 
								label="formSize"
								:loading="isLoading2"
								:searchable="false" 
								:show-labels="false"></multiselect> -->
	
	
		
		
		
		<b-modal ref="imageAskModal" size="sm" title="Add a batch image?" centered hide-footer hide-header-close no-close-on-backdrop>
			<div class="modal__footer">
				<b-btn class="mt-3" variant="outline-danger" @click="noImage">No Image</b-btn>
				<b-btn class="mt-3" variant="outline-primary" @click="addImage">Add Image</b-btn>
			</div>
		</b-modal>							
		<picture-modal style=""></picture-modal>											 					 	 

		<!-- PB PLANT PICKER THING -->
	    <b-modal v-model="showPlantPickerModal" size="xl" class="modal-xl" no-close-on-backdrop hide-footer title="Search for a plantname/formsize from Pannebakker">
			<div>
					<div class="row">
						<div class="col-xs-12 col-md-12 col-lg-12">
							<b-input-group class="input-filter">
								<b-form-input type="text" v-model="plantSearch" placeholder="Type to Search"/>
									<b-input-group-append>
										<b-btn variant="success" @click="searchForPlant">Search</b-btn>
									</b-input-group-append>
									<b-input-group-append>
										<b-btn variant="danger" @click="clearSearch">Clear</b-btn>
									</b-input-group-append>
							</b-input-group>
						</div>
					</div>
					<br>
					<div class="row">
						<div class="col-xs-4 col-md-4 col-lg-4">
							<multiselect 
							  v-model="selectedPlantNameFilter"
								:options="plantNameFilters"  
								placeholder="Select a plantname" 
								:loading="isLoading"
								:show-labels="false"
								:allow-empty="false"
								open-direction="bottom">
								</multiselect>
						</div>
						<div class="col-xs-4 col-md-4 col-lg-4">
							<multiselect 
								v-model="selectedFormSizeFilter"
								:options="formSizeFilters"  
								placeholder="Select a formsize" 
								:loading="isLoading"
								:show-labels="false"
								:allow-empty="false"
								open-direction="bottom">
								</multiselect>
						</div>
						<div class="col-xs-2 col-md-2 col-lg-2">
							<b-btn variant="success" block @click="filterCurrentSearchedPlants()">Filter</b-btn>
						</div>
						<div class="col-xs-2 col-md-2 col-lg-2">
							<b-btn variant="danger" block @click="clearFilterCurrentSearchedPlants()">Clear</b-btn>
						</div>
					</div>
					
					<br>
						<div class="row">
						<div class="col-xs-12 col-md-12 col-lg-12">
							<b-table
							show-empty
							stacked="md"
							:items="currentSearchedPlants"
							:fields="searchedPlantFields"
							outlined
							>
							<template slot="actions" slot-scope="row">
											<b-btn variant="success" @click="AddPlantFromPBList(row.item)">Add</b-btn>
							</template>
						</b-table>
						</div>
					</div>
			</div>
      </b-modal>

			<!-- HILLS PLANT PICKER THING  -->
			<b-modal v-model="showHillsPlantPickerModal" size="xl" class="modal-xl" no-close-on-backdrop hide-footer title="Search for a plantname/formsize from Hills">
			<div>
					<div class="row">
						<div class="col-xs-12 col-md-12 col-lg-12">
							<b-input-group class="input-filter">
								<b-form-input type="text" v-model="hillsPlantSearch" placeholder="Type to Search"/>
									<b-input-group-append>
										<b-btn variant="success" @click="searchForHillsPlant">Search</b-btn>
									</b-input-group-append>
									<b-input-group-append>
										<b-btn variant="danger" @click="clearSearch">Clear</b-btn>
									</b-input-group-append>
							</b-input-group>
						</div>
					</div>
					<br>
					<div class="row">
						<div class="col-xs-12 col-md-12 col-lg-12">
							<multiselect 
							  v-model="selectedHillsPlant"
								:options="currentSearchedHillsPlants"  
								placeholder="Select a plantname" 
								:loading="isLoading"
								:show-labels="false"
								:allow-empty="false"
								open-direction="bottom"
								@input="getPlantFormSizes"
								@open="clearFormSizes">
								</multiselect>
							<!-- <b-table
							show-empty
							stacked="md"
							:items="currentSearchedHillsPlants"
							:fields="searchedPlantFields"
							outlined
							>
							<template slot="actions" slot-scope="row">
											<b-btn variant="success" @click="AddPlantFromPBList(row.item)">Add</b-btn>
							</template>
						</b-table> -->
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12 col-md-12 col-lg-12">
							<multiselect v-model="selectedHillsFormSize" 
									:options="formSizes"  
									placeholder="Select a form size" 
									label="formSize"
									:loading="isLoading2"
									:searchable="false" 
									:show-labels="false"></multiselect>
						</div>
					</div>
						<div class="row">
						<div class="col-xs-12 col-md-12 col-lg-12">
							<b-btn variant="success" @click="AddPlantFromHillsList()">Add</b-btn>
						</div>
					</div>
			</div>
      </b-modal>
</div>
</template>

<script>
import moment from 'moment'
import PictureModal from '@/components/BatchEditComponents/PictureModal';
import MiscNavbar from '@/components/MiscNavbar.vue'
export default {
  data () {
		return {
			pageName: 'New Batch',
			plantNames: [],
			formSizes: [],
			locations: [],
			selectedSku: '',
			selectedPlantName: '',
			selectedFormSize: '',
			selectedLocation: '',
			saleableQuantity: '',
			growingQuantity: '',
			wholesalePrice: '',
			isLoading: false,
			isLoading2: false,
			value: false,
			batchDate: '',
			quantity: '',
			comment: '',
			showPlantPickerModal: false,
			showHillsPlantPickerModal: false,
			currentSearchedPlants: [],
			originalSearchedPlants: [],
			plantSearch: '',
			showSearchTable: true,
			showAddingPlantSection: false, //Nice names lmao
			selectedRowFromSearch: null,
			plantNameFilters: [],
			formSizeFilters: [],
			locationFilters: [],
			selectedPlantNameFilter: null,
			selectedFormSizeFilter: null,
			searchedPlantFields: [
        { key: "PlantName", label: "Plant Name", sortable: true },
        { key: "FormSize", label: "Form Size" },
        { key: "actions", label: "Actions" }
      ],
			hillsPlantSearch: '',
			currentSearchedHillsPlants: [],
			selectedHillsPlant: '',
		}		
  },
	components: {
		PictureModal,
		MiscNavbar
	},
  methods: {
	cancel() {
		this.$router.push('HomePage');
	},
	noImage() {
		this.$router.push('StockTable');
	},
	addImage() {
		this.$root.$emit('PictureModal'); //Display the picture modal when button pressed
	},
	saveBatch() {
		this.axios.post('https://ahillsbatchservice.azurewebsites.net/api/Batches', {
			"Sku": this.selectedSku,
			"Name": this.selectedPlantName,
			"FormSize": this.selectedFormSize,
			"Location":  this.selectedLocation.location,
			"Quantity": this.saleableQuantity,
			"WholesalePrice": Math.trunc(parseFloat(this.wholesalePrice)*100),
			"ImageExists": false,
			"GrowingQuantity": this.growingQuantity,
			"AllocatedQuantity": 0,
			"DateStamp": this.getDate(),
			"Comment": this.comment,
			"Active": true,
			"BuyPrice": 0,
			"FormSizeCode": null,
		})
		.then((response) => {
			console.log(response);
			// var newBatch = new this.newBatchInformation(); //Save these values so if a new image is taken it will know the
      // newBatch.Id = response.data.Id								//batchId and the name to create a unique ID
      // newBatch.Name = response.data.Name
			// sessionStorage.setItem('newBatchInformation', JSON.stringify(newBatch)); //Save information to be used by PictureModal
			// sessionStorage.removeItem('batchInMemory');
			// sessionStorage.removeItem('batchList')
			this.$refs.imageAskModal.show() //Show the modal to see if the user wants to add an image to the batch
		})
		.catch((error) => {
			alert("Please check values before submitting")
			console.log(error);
		});
	},
	// newBatchInformation(batchId, plantName) {
	// 	var batchId, plantName
	// },
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
		this.loading2 = true;
		this.axios.get('https://ahillsplantservice.azurewebsites.net/api/FormSizes?sku=' + this.selectedHillsPlant.Sku)
      .then((response) => {
				this.transformFormSizes(response.data);
				this.loading2 = false
      })
      .catch((error) => {
        alert(error);
      });
	},
	transformFormSizes(data) {
		this.formSizes = [];
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
        "formSize": formSize.trim().replace(/  +/g, ' '), //Remove any whitespace in the form sizes
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
	openPlantPickerModal()
		{
		this.showPlantPickerModal = true;
		this.showAddCollapse = false;
		this.currentSearchedPlants = [];
		this.originalSearchedPlants = [];
		this.plantSearch = "";
		this.formSizeFilters = [];
		this.plantNameFilters = [];
		this.locationFilters = [];
		this.selectedPlantNameFilter = null;
		this.selectedFormSizeFilter = null;
	},
	openHillsPlantPickerModal()
	{
		this.showHillsPlantPickerModal = true;
		this.showAddCollapse = false;
		this.currentSearchedPlants = [];
		this.originalSearchedPlants = [];
		this.plantSearch = "";
		this.formSizeFilters = [];
		this.plantNameFilters = [];
		this.locationFilters = [];
		this.selectedPlantNameFilter = null;
		this.selectedFormSizeFilter = null;
	},
	filterCurrentSearchedPlants()
	{
		if (this.selectedPlantNameFilter != null)
		{
			let selectedPlants = this.currentSearchedPlants.filter(x => //Loop through batches to find which match the one selected for picking
				(x.PlantName === this.selectedPlantNameFilter));
			this.currentSearchedPlants = selectedPlants;
		}
		if (this.selectedFormSizeFilter != null)
		{
			let selectedPlants = this.currentSearchedPlants.filter(x => //Loop through batches to find which match the one selected for picking
				(x.FormSize === this.selectedFormSizeFilter));
			this.currentSearchedPlants = selectedPlants;
		}
	},
	clearFilterCurrentSearchedPlants()
	{
		this.selectedPlantNameFilter = null;
		this.selectedFormSizeFilter = null;
		this.currentSearchedPlants = this.originalSearchedPlants;
	},
	removePBFromCurrentSearchedPlants()
	{
		let selectedPlants = this.currentSearchedPlants.filter(x => //Loop through batches to find which match the one selected for picking
			(x.Location != "PB"));
			this.currentSearchedPlants = selectedPlants;
	},
	searchForPlant()
  {
       this.axios.get("https://ahillsbatchservice.azurewebsites.net/api/search?searchQuery=" +
           this.plantSearch
       )
       .then(response => {
				var tempPNF = [];
				var tempFSF = [];
         for (var i = 0; i < response.data.length; i++) {
					if (response.data[i].Location == "PB")
					{
 						this.currentSearchedPlants.push({
							Sku: response.data[i].Sku, 
							BatchId: response.data[i].Id,
							PlantName: response.data[i].Name,
							FormSize: response.data[i].FormSize,
							Location: response.data[i].Location,
							BatchQuantity: response.data[i].Quantity,
							GrowingQuantity: response.data[i].GrowingQuantity,
							AllocatedQuantity: response.data[i].AllocatedQuantity,
							WholesalePrice: response.data[i].WholesalePrice,
						});
					}
					tempPNF.push(response.data[i].Name);
					tempFSF.push(response.data[i].FormSize);
				}
				this.originalSearchedPlants = this.currentSearchedPlants;
				this.plantNameFilters = this.removeDuplicates(tempPNF);
				this.formSizeFilters = this.removeDuplicates(tempFSF);
			})
       .catch(error => {
         alert(error);
			});
			
	},
	clearSearch()
   {
		this.currentSearchedPlants = [];
		this.originalSearchedPlants = [];
		this.plantSearch = ""
		this.selectedRowFromSearch = null;
		this.selectedPlantNameFilter = null;
		this.selectedFormSizeFilter = null;
		this.formSizeFilters = [];
		this.plantNameFilters = [];
		this.locationFilters = [];
	},
	removeDuplicates(array) {
			return array.filter((a, b) => array.indexOf(a) === b)
	},
	searchForHillsPlant() {
		this.axios.get("https://ahillsbatchservice.azurewebsites.net/api/plantsearch?searchQuery=" +
           this.hillsPlantSearch
       )
       .then(response => {
         for (var i = 0; i < response.data.length; i++) {
 						this.currentSearchedHillsPlants.push({
							Sku: response.data[i].Sku, 
							PlantName: response.data[i].PlantName,
						});
				}
			})
       .catch(error => {
         alert(error);
			});
	},
	AddPlantFromPBList(row)
	{
		this.selectedPlantName = row.PlantName;
		this.selectedFormSize = row.FormSize;
		this.selectedSku = row.Sku
		this.showPlantPickerModal = false;
	},
	AddPlantFromHillsList()
	{
		this.selectedPlantName = this.selectedHillsPlant.PlantName;
		this.selectedFormSize = this.selectedHillsFormSize.formSize;
		this.selectedSku = this.selectedHillsPlant.Sku;
		this.showHillsPlantPickerModal = false;
	},
	getDate() {
		// console.log(moment(new Date).format('DD/MM/YYYY'));
		// console.log(moment(new Date));
		return moment(new Date);
	},
	clearFormSizes() { //When selecting a new plant from the dropdown clear the selected form size
		this.selectedFormSize = '';
	}
	},
	mounted() {
		sessionStorage.removeItem('selectedBatchInformation'); //Make sure that no previous information is saved in storage
		sessionStorage.removeItem('newBatchInformation');
		// this.getPlantNameks(); //Retrieve the data on load of the page
		this.getLocations();
		this.getDate();
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

	.navbar-custom {
			background-color: lightslategray;
	}


	@media only screen and (max-width : 768px) {
	.center-div
	{
    width: 100%;
	}

}

	/* Make the height fit on mobile, just make sure that it fits on any screen smaller than 768 */
</style>
