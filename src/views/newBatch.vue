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
	  <b-form-input id="nestedName"></b-form-input>
	</b-form-group>
	<b-form-group horizontal
				  label="Size:"
				  label-class="text-sm-right"
				  label-for="nestedSize">
	  <b-form-input id="nestedSize"></b-form-input>
	</b-form-group>
	<b-form-group horizontal
				  label="Quantity:"
				  label-class="text-sm-right"
				  label-for="nestedQuantity">
	  <b-form-input id="nestedQuantity"></b-form-input>
	</b-form-group>
	<b-form-group horizontal
				  label="Price:"
				  label-class="text-sm-right"
				  label-for="nestedPrice">
	  <b-form-input id="nestedPrice"></b-form-input>
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
	  	name: ''
		}		
  },
  methods: {
		cancel() {
	  	this.$router.push('StockTable');
	},
		saveBatch() {
	  	alert("Batch Saved");
	  	this.$router.push('StockTable');  
	}
  }
}
</script>