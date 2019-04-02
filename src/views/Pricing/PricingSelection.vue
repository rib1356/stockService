<template>
    <div>
			<p>Hello</p>
      <b-container>
        <b-row>
          <b-col> 
          <p>Root Type</p>
					<b-form-group>
						<b-form-radio-group id="rootTypeButtons"
															class="myRadioButton"
															v-model="selectedRootType"
															buttons
															button-variant="outline-primary"
															:options="rootTypes"
															stacked
															name="radioRootType"
															@input="rootTypeChosen"
															> <p>{{selectedRootType}}</p>
        		</b-form-radio-group>
      		</b-form-group>
          </b-col>
          <b-col v-if="potSizes.length > 0">
						<p>Pot Size</p>
						<b-form-group>
							<b-form-radio-group id="potSizeButtons"
																class="myRadioButton"
																v-model="selectedPotSize"
																buttons
																button-variant="outline-primary"
																:options="potSizes"
																stacked
																name="radioPotSize"
																> <p>{{selectedPotSize}}</p>
							</b-form-radio-group>
						</b-form-group>
          </b-col>   
        </b-row>
    	</b-container>
    </div>
</template>

<script>
  export default {
		data() {
			return {
				selectedRootType: '',
				rootTypes: [
					{text: 'CG', value: 'CG'},
					{text: 'AP', value: 'AP'},
					{text: 'RB', value: 'RB'},
					{text: 'BR', value: 'BR'},
				],
				selectedPotSize: '',
				potSizes: [],
			}
		},
		methods: {
			rootTypeChosen() {
				this.potSizes = []
				if(this.selectedRootType === 'CG') {
					this.potSizes.push(
						{text: 'C2', value: 'C2'},
						{text: 'C3', value: 'C3'},
						{text: 'C5', value: 'C5'},
						{text: 'C10', value: 'C10'});
				} else if(this.selectedRootType === 'AP') {
					this.potSizes.push(
						{text: 'AP35', value: 'AP35'},
						{text: 'AP45', value: 'AP45'},
						{text: 'AP65', value: 'AP65'},
						{text: 'AP100', value: 'AP100'});
				} else {
					this.potSizes.push(
						{text: '6-8', value: '6-8'},
						{text: '8-10', value: '8-10'},
						{text: '10-12', value: '10-12'},
						{text: '12-14', value: '12-14'});
				}
			}
		},
  }
</script>

<style scoped>

	.myRadioButton {
		width: 100px;
	}
</style>