<template>
  <b-card bg-variant="">
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
		<b-button @click="cancel" variant="outline-danger">Cancel</b-button>
		<b-button @click="saveBatch" variant="outline-primary">Submit</b-button>
  </b-form-group>
</b-card>
</template>

<script>
export default {
  data () {
		return {
			 //Make this batch object to be the same as the table
				Sku: 'Test', //Make sure that the SKU is coming from plant database
				Name: '',
				FormSize: '',
				Location: '',
				Quantity: '',
				WholesalePrice: '',
				Image: null,
				Active: true,
		}		
  },
  methods: {
		cancel() {
	  	this.$router.push('StockTable');
	},
		saveBatch() {
			this.axios.post('https://ahillsbatchservice.azurewebsites.net/api/Batches', {
				"Sku": this.Sku,
				"Name": this.Name,
				"FormSize": this.FormSize,
				"Location": this.Location,
				"Quantity": this.Quantity,
				"WholesalePrice": this.WholesalePrice,
				"Image": this.Image,
				"Active": this.Active,
			})
			.then((response) => {
				console.log(response);
				alert("Batch created");
				this.$router.push('StockTable');
			})
			.catch((error) => {
				console.log(error);
			});
	}
  }
}
</script>