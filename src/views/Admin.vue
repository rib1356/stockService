<template>
  <div>
		<misc-navbar class="navbar-custom" id="navbar" v-bind:pageName='pageName'></misc-navbar>
		<div>
			<h3>Add a new plant</h3>
			<b-form-input v-model="plantName"
									placeholder="Enter a plant Name"
									name="plantName"
									style="margin-bottom: 10px;"></b-form-input>	
			<multiselect v-model="selectedGroups" 
									:options="groups"
									:multiple="true"
									:close-on-select="false"
									:clear-on-select="false"
									:preserve-search="true"
									placeholder="Pick a group or groups"
									label="GroupDescription"
									track-by="GroupId"
									@input="getGroupFormSize">
					<template slot="option" slot-scope="props">
					<div>
						<span>{{props.option.GroupId }} - {{props.option.GroupDescription }}</span>
					</div>
				</template>
			</multiselect>
			<p>Check spelling as this cant be changed</p>
			<b-button variant="outline-primary" @click="savePlant">Save plant with groups</b-button>
			<b-button @click="showCollapse = !showCollapse"
                :class="showCollapse ? 'collapsed' : null"
                style="margin-bottom: 5px; height: 35px;"
                block
                
                aria-controls="collapse"
                :aria-expanded="showCollapse ? 'true' : 'false'">
        <p v-if="showCollapse">Hide Form Size Groups<i class="fas fa-plus plus"></i></p>
        <p v-else>Show Form Size Groups<i class="fas fa-plus plus"></i></p>
      </b-button>  
      <!-- Collapsible area to show the filters for the table -->
      <b-collapse v-model="showCollapse" id="collapse">
				<!-- <p>Current Form Sizes {{groupFormSizes}}</p> -->
				<ul>
					<li v-for="group in groupFormSizes" v-bind:key="group">
						<ul>
							<li v-for="forms in group" v-bind:key="forms">
								RootType:{{ forms.RootType }} - PotSize:{{ forms.PotSize }} - HeightSpread:{{forms.HeightSpread}} 
						    - Girth:{{forms.Girth}} - Age:{{forms.Age}} - Description:{{forms.Description}}
							</li>
						</ul>
					</li>
				</ul>
				<!-- <ul>
					<li v-for="forms in groupFormSizes" v-bind:key="forms.id">
						RootType:{{ forms.RootType }} - PotSize:{{ forms.PotSize }} - HeightSpread:{{forms.HeightSpread}} 
						- Girth:{{forms.Girth}} - Age:{{forms.Age}} - Description:{{forms.Description}}
					</li>
				</ul> -->
			</b-collapse>
		</div>
		<hr>
		<div>
			<h4>Add more groups to existing plant</h4>
			<multiselect v-model="selectedPlantName" 
			   					:options="plantNames"  
									placeholder="Select a plant" 
									label="name" 
									track-by="name"
									:show-labels="false"
									@input="getPlantsGroups">
			</multiselect>		
			<p>Plant is in the current group(s): {{currentPlantGroups}}</p>
			<multiselect v-model="selectedGroups2" 
									:options="groups"
									:multiple="true"
									:close-on-select="false"
									:clear-on-select="false"
									:preserve-search="true"
									placeholder="Pick a group or groups"
									label="GroupDescription"
									track-by="GroupId"
									style="margin-bottom: 5px;">
				<template slot="option" slot-scope="props">
					<div>
						<span>{{props.option.GroupId }} - {{props.option.GroupDescription }}</span>
					</div>
				</template>						
			</multiselect>
			<b-button variant="outline-primary" @click="editPlant">Save plant group edits</b-button>
		</div>
		<hr>
		<div>
			<h3>VAT</h3>
			<p>Current VAT: {{VAT}} % <b-form-input v-model="VATtoChange"
									placeholder="Enter VAT"
									name="VAT"
									style="margin-bottom: 10px;"></b-form-input></p>
			<b-button variant="outline-primary" @click="saveVat">Save VAT</b-button>
			<hr>
		</div>
		<h3>Pricing bands and GPM</h3>
  </div>
</template>

<script>
import MiscNavbar from '@/components/MiscNavbar.vue'
import firebase from 'firebase/app';
export default {
	components: {
    MiscNavbar,
	},
  data () {
		return {
			pageName: 'Admin',
			groups: [],	
			selectedGroups: [],
			selectedGroups2: [],
			plantNames: [],
			selectedPlantName: '',
			plantName: '',
			VAT: 0,
			VATtoChange: 0,
			currentPlantGroups: '',
			showCollapse: false,
			groupFormSizes: '',
			formSizes: [],
		}
	},
	methods: {
		getGroups() {
			this.axios.get('https://ahillsplantservice.azurewebsites.net/api/groups')
      .then((response) => {
				this.groups = response.data;
      })
      .catch((error) => {
          alert(error);
      });
		},
		savePlant() {
			this.axios.post('https://ahillsplantservice.azurewebsites.net/api/groups', {
				Name: this.plantName,
				Sku: this.getPlantCode(),
				GroupDetails: this.selectedGroups
			}) 
			.then((response) => {
				console.log(response);
				alert("Plant and groups have been saved");
				this.plantName = '';
				this.selectedGroups = [];
			})
			.catch((error) => {
				alert("Please check values before submitting: " + error);
				console.log(error);
			});
		},
		editPlant() {
			this.axios.post('https://ahillsplantservice.azurewebsites.net/api/Groups/edit', {
				PlantId: this.selectedPlantName.plantId,
				GroupDetails: this.selectedGroups2
			}) 
			.then((response) => {
				console.log(response);
				alert("Plant has been edited and new groups added");
				this.selectedPlantName = '';
				this.selectedGroups2 = [];
			})
			.catch((error) => {
				alert("Please check values before submitting: " + error);
				console.log(error);
			});
		},
		getPlantNames() {
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
					"plantId": data[i].plantId,
					"name": data[i].plantName, 
					"sku": data[i].Sku
				});
			}
		},
		getPlantsGroups() {
			this.axios.get('https://ahillsplantservice.azurewebsites.net/api/FormSizes?sku=' + this.selectedPlantName.sku)
      .then((response) => {
				let arr1 = response.data.map(a => a.GroupId) //Create an array of the different form sizes that belong to plant
				let unique = [...new Set(arr1)]; //Remove any duplicates so only single GroupIds exist
				this.currentPlantGroups = unique;
      })
      .catch((error) => {
        alert(error);
      });
		},
		getGroupFormSize() {
			this.groupFormSizes = []; //Clear the group of form sizes in case something 
			this.selectedGroups.forEach(element => { //Loop through the current selected groups
				let filtered = this.formSizes.filter((obj) => obj.GroupId === element.GroupId); //filter the form sizes based on what groupIds are selected
				this.groupFormSizes.push(filtered);
			});
			// filtered.forEach(element => { //Loop through each element in the array to then
			// 		this.groupFormSizes.push(element); //Push these into an array to be shown on screen
			// 	});
		},
		getFormSizes() {
			this.axios.get('https://ahillsplantservice.azurewebsites.net/api/FormSizes')
      .then((response) => {
				this.formSizes = response.data;
      })
      .catch((error) => {
        alert(error);
      });
		},
		saveVat() { 
			firebase.database().ref('/GPM/' + "VAT").update({value: this.VATtoChange},
			function(error) {
				if(error) {
					alert("There was an error: " + error)
				} else {
					alert("VAT saved successfully");
				}
			});
		},
		getFirebase() {
			var ref = firebase.database().ref("GPM/").orderByKey();
			ref.on("value", (snapshot) => {
          snapshot.forEach((child) => { 
							var obj = child.val();
							if(child.key == "VAT"){
								this.VAT = obj.value;
							}
            });
			}, 
			function (error) {
        console.log("Error: " + error.code);
      });
		},
		getPlantCode() {
			let plant = this.plantName;
			var res = plant.replace(/'/g, ""); //Remove any ' from plant so that theyre not string
			var splitPlant = res.split(" "); //Split the plant name into an array
			//Horribly inefficient way
			if(splitPlant.length <= 2){ 
				return (splitPlant[0].slice(0,2) + splitPlant[1].slice(0,6)).toUpperCase();
			} else if(splitPlant.length == 3) {
				return (splitPlant[0].slice(0,2) + splitPlant[1].slice(0,1) + splitPlant[2].slice(0,5)).toUpperCase();
			} else if(splitPlant.length == 4) {
				return (splitPlant[0].slice(0,2) + splitPlant[1].slice(0,1) + splitPlant[2].slice(0,1) + splitPlant[3].slice(0,4)).toUpperCase();
			} else if(splitPlant.length == 5) {
				return (splitPlant[0].slice(0,2) + splitPlant[1].slice(0,1) + splitPlant[2].slice(0,1) + splitPlant[3].slice(0,1) + splitPlant[4].slice(0,3)).toUpperCase();
			} else if(splitPlant.length == 6) {
				return (splitPlant[0].slice(0,2) + splitPlant[1].slice(0,1) + splitPlant[2].slice(0,1) + splitPlant[3].slice(0,1) + splitPlant[4].slice(0,1) + splitPlant[5].slice(0,2)).toUpperCase();
			} else {
				alert("Name too long?")
			}
		},
	},
	created() {
		this.getGroups();
		this.getPlantNames();
		this.getFirebase();
		this.getFormSizes();
	}
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>

	.navbar-custom {
			background-color: lightslategray;
	}

	hr{
		border-top: 2px solid black;
	}

	.plus{
    float: right;
    text-align: center;
  }

</style>