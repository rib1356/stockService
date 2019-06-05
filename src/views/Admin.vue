<template>
  <div>
		<misc-navbar class="navbar-custom" id="navbar" v-bind:pageName='pageName'></misc-navbar>
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
								 >
		</multiselect>
		<p>Check spelling as this cant be changed</p>
		<b-button variant="outline-primary" @click="savePlant">Save plant with groups</b-button>
		<hr>
		<h3>Pricing values and VAT</h3>
		<p>Current VAT: {{VAT}} % <b-form-input v-model="VATtoChange"
                placeholder="Enter VAT"
								name="VAT"
								style="margin-bottom: 10px;"></b-form-input></p>
		<b-button variant="outline-primary" @click="saveVat">Save VAT</b-button>
		<!-- <router-link :to="{name: 'HomePage'}">
			<b-button variant="outline-danger">Home</b-button>
			</router-link> -->
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
			plantName: '',
			VAT: 0,
			VATtoChange: 0
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
			// console.log(this.getPlantCode());
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
		this.getFirebase();
	}
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>

	.navbar-custom {
			background-color: lightslategray;
	}

</style>