<template>
    <div>
			<misc-navbar class="navbar-custom" id="navbar" v-bind:pageName='pageName'></misc-navbar>
      <b-container>
				<b-form-checkbox v-model="checked" name="check-button" @change="showPricedItems">
      		<p v-if="checked">Show all items</p>
					<p v-else>Hide none priced items</p>
    		</b-form-checkbox>
        <b-row>
          <b-col class="col-md-2"> 
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
          <b-col v-if="potSizes.length > 0" class="col-md-2">
						<p>Pot Size</p>
						<b-form-group class="pricing-buttons">
							<b-form-radio-group id="potSizeButtons"
																class="myRadioButton"
																v-model="selectedPotSize"
																buttons
																button-variant="outline-primary"
																:options="potSizes"
																stacked
																name="radioPotSize"
																@input="potTypeChosen"> <p>{{selectedPotSize}}</p>
							</b-form-radio-group>
						</b-form-group>
          </b-col>
          <b-col v-if="potSizes.length > 0" class="col-md-2">
						<p>Form Size</p>
						<b-form-group class="pricing-buttons">
							<b-form-radio-group id="formSizeButtons"
																class="myRadioButton"
																v-model="selectedFormSize"
																buttons
																button-variant="outline-primary"
																:options="formSizes"
																stacked
																name="radioFormSize"
															  > <p>{{selectedFormSize}}</p>
							</b-form-radio-group>
						</b-form-group>
          </b-col>
					<b-col class="col-md-5">
						<div class="batch-list">
							<ul>
          			<li v-for="(data, index) in filterArray" :key='index'>
										<b-form-checkbox name="batch-check" @change="batchSelected(data)">
											{{ data.plantName }} {{data.formSize}}
    								</b-form-checkbox>	
          			</li>
      				</ul>
						</div>			
					</b-col>
					<b-col class="col-md-1">
						<router-link :to="{name: 'BatchPricing', params: { selectedBatches: selectedBatches } }">
							<b-button variant="outline-success">Price selected items</b-button>
						</router-link>	
					</b-col> 
        </b-row>
    	</b-container>
			<!-- <div class="batch-list">
				<ul>
          <li v-for="(data, index) in batches" :key='index'>
            {{ data.plantName }} 
          </li>
      	</ul>
			</div> -->
    </div>
</template>

<script>
import MiscNavbar from '@/components/MiscNavbar.vue'
  export default {
		components: {
    	MiscNavbar,
		},
		data() {
			return {
				pageName: 'Pricing',
				selectedRootType: '',
				filteredRootTypeArr: [],
				rootTypes: [
					{text: 'Show All', value: 'None'},
					{text: 'CG', value: 'C'},
					{text: 'AP', value: 'AP'},
					{text: 'Rooted', value: 'Rooted'},
				],
				selectedPotSize: null,
				potSizes: [],
				formSizes: [],
				selectedFormSize: null,
				batches: [],
				checked: false,
				selectedBatches: [],
			}
		},
		computed: {
			filterArray() {
				let batches = this.batches;
				this
				if (this.selectedFormSize != null) {
						let filteredArray = this.filteredPotTypeArr.filter(o =>
						Object.keys(o).some(k => String(o.formSize).includes(this.selectedFormSize)));
						return filteredArray;
				}
				if (this.selectedPotSize != null) {
						let filteredArray = this.filteredRootTypeArr.filter(o =>
						Object.keys(o).some(k => String(o.formSize).includes(this.selectedPotSize)));
						this.getNextPotButtons(filteredArray)
						this.filteredPotTypeArr = filteredArray;
						return filteredArray;
				}
				if(this.selectedRootType === 'C' || this.selectedRootType === 'AP') { //Root Type is container grown so it will have a pot size
					let filteredArray = batches.filter(o => //Filter through the current array by the key 'formSize'
					Object.keys(o).some(k => String(o.formSize).includes(this.selectedRootType))); //Show only the formsizes that contain 'C' or 'AP in the list
					this.getNextPotButtons(filteredArray, true) //Pass in the filtered array to display the next set of radio buttons
					this.filteredRootTypeArr = filteredArray;
					return filteredArray;
      	} else if (this.selectedRootType === 'Rooted') { //(this.selectedRootType === 'RB' || this.selectedRootType === 'BR')
					let filteredArray = batches.filter(o =>
					//Does the same filter but checks that the formSize doesnt include these values. This means a plant with no pot has been chosen
					Object.keys(o).some(k => !String(o.formSize).includes('AP') && !String(o.formSize).includes('C')));
					this.getNextPotButtons(filteredArray, true)
					this.filteredRootTypeArr = filteredArray;
					return filteredArray;
				} 
				return batches;
			}
		},
		methods: {
			rootTypeChosen() {
				if(this.checked == false){ //get the batch list to show/hiding of priced items
					this.getBatchList();
				}
				this.potSizes = []; //Whenever a new RootType is chosen reset any of the current values
				this.formSizes = [];
				this.selectedPotSize = null;
				this.selectedFormSize = null;
				this.selectedBatches = [];
			},
			potTypeChosen() {
				this.formSizes = [];
				this.selectedFormSize = null;
				this.selectedBatches = [];
			},
			getNextPotButtons(filteredArray, potChosen) {
				let arrOfFormSizes = filteredArray.map(a => a.formSize); //Get all the form sizes of the selected root type and put into an array
				var potSizeArray = []; 

				if(potChosen) { //If the value passed in is true it means a pot size has just been selected so show those buttons		
					for (let i = 0; i < arrOfFormSizes.length; i++) {
						if(arrOfFormSizes[i] != null) { //If the form size is not null
							//Push into an array the first part of the formsize string and cut it off where there is a space
							//Eg: "C2 20-30" will be split so only "C2" is added to the array
							potSizeArray.push(arrOfFormSizes[i].substring(0,arrOfFormSizes[i].indexOf(' '))); 
						}				
					}
					let unique = [...new Set(potSizeArray)]; //Remove any duplicates from the current array so only the unique pot sizes can be chosen from
					unique.forEach((element) => { //Loop through through the array
						if(element != "") {
							this.potSizes.push({'text':element, 'value':element}); //Push the current values so that they can be displayed as radio buttons
						}
					});
				} else { //Otherwise a potsize has already been chosen so show form size
					this.formSizes = [];
					this.selectedFormSize = null;
					var formSizeArray = [];
					for (let i = 0; i < arrOfFormSizes.length; i++) {
							formSizeArray.push(arrOfFormSizes[i].split(/[, ]+/).pop()); //Split the string and get the last value, which will be the height/spread		
					}
					let unique = [...new Set(formSizeArray)]; //Remove any duplicates from the current array so only the unique pot sizes can be chosen from
					unique.forEach((element) => { //Loop through through the array
						if(element != "") {
							this.formSizes.push({'text':element, 'value':element}); //Push the current values so that they can be displayed as radio buttons
						}
					});	
				}
			},
			showPricedItems() {
				if(this.checked == true) {
					this.getBatchList();
				} else {
				let filteredArr = this.batches.filter((item) => {
					return item.batchPrice == null;
					});
				this.batches = filteredArr;
				}
			},
			batchSelected(data) {
				let selectedBatches = this.selectedBatches;
				if(selectedBatches.includes(data)) { //If the batch includes the item it has been checked
					var index = selectedBatches.indexOf(data); //Therefore it has been unchecked and needs to be removed from the array
					selectedBatches.splice(index, 1);
				} else {
					let newPrice = (data.batchPrice/100).toFixed(2); //Formats the price to be in pounds
					data.batchPrice = newPrice;
					this.selectedBatches.push(data); //Doesnt exist in array so add batch
				}
			},
			getBatchList() {
				if(sessionStorage.getItem('batchList') != null) {
					let batchList = sessionStorage.getItem('batchList');
					this.batches = JSON.parse(batchList);
				} else {
					if(confirm("Please go back to stock table to load batches")) {
						this.$router.push('StockTable');
					}
				}
			},
		},
		mounted() {
			this.getBatchList();
		}
  }
</script>

<style scoped>

	.myRadioButton {
		width: 100px;
	}

	.pricing-buttons {
		max-height: 50vh;
		overflow: auto;
	}

	.batch-list{ 
		max-height: 75vh;
		width: 100%;
		overflow: auto;
    -webkit-overflow-scrolling: touch;
	}

	.navbar-custom {
			background-color: lightslategray;
	}

</style>