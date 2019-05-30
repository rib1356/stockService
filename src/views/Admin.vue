<template>
  <div>
		<p>This is an admin page changed</p>
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
				this.groups = response.data;
      })
      .catch((error) => {
          alert(error);
      });
		},
		savePlant() {
			let plant = this.plantName;
			var splitPlant = plant.split(" ");
			console.log(splitPlant);
			let A = splitPlant[0].slice(0,2);
			let B = splitPlant[1].slice(0,1);
			let C = splitPlant[2].slice(0,5);

			console.log((A+B+C).toUpperCase());
			// let D = splitPlant[0].slice(0,2);
			// let E = splitPlant[0].slice(0,2);
			// alert("The plants you are going to save is: " + this.plantName + 
			// 			"\n" +" Groups:" + this.selectedGroups.forEach(element => {
			// 				element
			// 			})
			// 			)
		},
		getPlantCode() {
			

			
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