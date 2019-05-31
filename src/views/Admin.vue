<template>
  <div>
		<p>This is an admin page changed2</p>
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
								 label="groupDescription"
								 track-by="groupId"
								 >
		</multiselect>
		<p>Check spelling as this cant be changed</p>
		<p>Need to generate a plant key but how??</p>
		<b-button variant="outline-primary" @click="savePlant">Save plant with groups</b-button>
  </div>
</template>

<script>
export default {
  data () {
		return {
			groups: [],	
			selectedGroups: [],
			plantName: '',
		}
	},
	methods: {
		getGroups() {
			this.axios.get('https://ahillsplantservice.azurewebsites.net/api/groups')
      .then((response) => {
				console.log(response);
				this.groups = response.data;
      })
      .catch((error) => {
          alert(error);
      });
		},
		savePlant() {
			console.log(this.getPlantCode());
			//save the plant name and code
			//plus the array of groups
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
	}
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>

</style>