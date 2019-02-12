<template>
<div class="center-div">
  <label class="typo__label">Create a new batch</label>
  <multiselect v-model="selectedPlantName" 
							 :options="plantNames"  
							 placeholder="Select a plant" 
							 label="name" 
							 track-by="name"
							 :loading="isLoading"
							 :hide-selected="true"
							 @input="getPlantFormSizes"
							 @close="plantSelected"
							 @open="clearFormSizes"></multiselect>
	<br>
	<br>
	<multiselect v-model="selectedFormSize" 
							 :options="formSizes"  
							 placeholder="Select a form size" 
							 label="formSize" 
							 :hide-selected="true"></multiselect>
	<p>{{formSize}}</p>
	<div>
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
			sku: '', 
			name: '',
			formSize: '',
			location: '',
			quantity: '',
			wholesalePrice: '',
			image: null,
			plantNames: [],
			formSizes: [],
			selectedPlantName: '',
			selectedFormSize: '',
			isLoading: false,
		}		
  },
  methods: {
	cancel() {
	  	this.$router.push('StockTable');
	},
	saveBatch() {
		this.axios.post('https://ahillsbatchservice.azurewebsites.net/api/Batches', {
			"Sku": this.sku,
			// "Name": this.name,
			// "FormSize": this.formSize,
			"Location": this.location,
			"Quantity": this.quantity,
			"WholesalePrice": this.wholesalePrice,
			"Image": this.image,
			"Active": true,
		})
		.then((response) => {
			console.log(response);
			alert("Batch created");
			this.$router.push('StockTable');
		})
		.catch((error) => {
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
	plantSelected() {
		// console.log("hello")
	},
	clearFormSizes() {
		this.selectedFormSize = '';
	}
	},
	mounted() {
		this.getPlantNames();
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

	/* Make the height fit on mobile, just make sure that it fits on any screen smaller than 768 */
</style>
