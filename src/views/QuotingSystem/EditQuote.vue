<template>
  <div>
    <p>{{msg}}</p>
    <!-- Quote information -->
		<router-link to="/ExistingQuotes">
      <b-button variant="outline-danger">Back to quotes</b-button>
    </router-link>
    <b-button @click="saveQuote" variant="outline-success">Save Edits</b-button>
		<p>
      Customer Ref: {{selectedQuote.customerRef}} ||
      Customer Name: {{selectedQuote.customerName}} ||
      Quote Start Date: {{selectedQuote.startDate}} ||
      Quote Expiry Date: {{selectedQuote.expiryDate}}
    </p>
		<p>Site Ref: {{selectedQuote.siteRef}} || Total Price: £{{computedTotalPrice}}</p>

    <!-- EditQuote table -->
    <b-table show-empty
             stacked="md"
             :items="quotePlants"
             :fields="fields"           
             >
      <div slot="empty">
        <strong>Loading quotes plants...</strong>
      </div>   
      <template slot="Price" slot-scope="row">
        £{{row.item.Price/100}}
      </template>      
      <template slot="actions" slot-scope="row">
				<i class="far fa-edit fa-lg" style="color:green" @click.stop="editItem(row.item, row.index)"></i>
				<i class="fas fa-trash-alt fa-lg" style="color:red" @click.stop="deleteItem(row.item, row.index)"></i>
        <!-- Editing modal -->
        <b-modal ref="editModal" no-close-on-backdrop hide-footer :title="rowName">
          <div>
            <b-form-group horizontal label="Comment:" >
              <b-form-input v-model="rowComment"
                            placeholder="Enter a comment" />
            </b-form-group>
            <b-form-group horizontal label="Quantity:" >
              <b-form-input v-model="rowQuantity"
                            placeholder="Enter a quantity"
                            type="number"
                            pattern="[0-9]*"
                            name="rowQuantity"
                            inputmode="numeric"
                            v-validate="'required|numeric|min_value:1'"  />
            </b-form-group>
            <p class="text-danger" v-if="errors.has('rowQuantity')">{{ errors.first('rowQuantity') }}</p>
            <b-form-group horizontal label="Price" >
              <b-form-input v-model="rowPrice"
                            placeholder="Enter a price"
                            type="number"
                            name="rowPrice"
                            v-validate="'required|decimal:2|min_value:0.01'" />
            </b-form-group>
            <p class="text-danger" v-if="errors.has('rowPrice')">{{ errors.first('rowPrice') }}</p>
          </div>
            <b-button class="mt-3" variant="outline-primary" block @click.stop="validateBeforeSubmit">Save Edits</b-button>
            <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-button>
        </b-modal>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'EditQuote',
  data () {
    return {
			msg: 'Quote Editing',
			selectedQuote: '',
			fields: [
        { key: 'PlantName', label: 'Plant Name', sortable: true},
        { key: 'FormSize', label: 'Form Size'},
        { key: 'Comment', label: 'Comment'},
        { key: 'Quantity', label: 'Quantity', sortable: true},
        { key: 'Price', label: 'Item Price', sortable: true, contenteditable: true},
        { key: 'actions', label: 'Actions' }
			],
      quotePlants: [],
      rowPlantForQuoteId: '',
      rowName: '',
      rowForm: '',
      rowComment: '',
      rowQuantity: '',
      rowPrice: '',
      rowActive: '',
      totalPrice: 0,
    }
  },
  computed: {
    computedTotalPrice () { ///Whenever total value is shown this will format to look monitary
      return (this.totalPrice/100).toFixed(2);
    },
  },
	methods: {
		getQuotePlants() {
			this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/quote/detail?id=' + this.selectedQuote.quoteId)
      .then((response) => {
				this.changeData(response.data.QuoteDetails); //Pass in just the plants on the quote to be displayed on table
      })
      .catch((error) => {
          alert(error);
      });
		},
		changeData (response) {
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
       if(response[i].Active === true) {
        this.quotePlants.push({                 //This is then pushed into an array and used to populate the data table
          PlantForQuoteId : response[i].PlantForQuoteId,
          PlantName: response[i].PlantName,
          FormSize: response[i].FormSize,
          Comment: response[i].Comment,
          Quantity: response[i].Quantity,
          Price: response[i].Price,
          Active: response[i].Active,
          _rowVariant: '',
        });   
       }
      }
      this.getTotalPrice(); //Once the plants have loaded calculate the current price of the quote
    },
    editItem(row, rowId) {
      if(row.Active == true){ //If the row hasnt been "deleted" open the edit modal
      this.$refs.editModal.show(); //Open editing modal
      this.currentRowId = rowId; //Set the current values of the row so they can be edited then spliced into array
      this.rowPlantForQuoteId = row.PlantForQuoteId;
      this.rowName = row.PlantName;
      this.rowForm = row.FormSize
      this.rowComment = row.Comment;
      this.rowQuantity = row.Quantity;
      this.rowPrice = (row.Price/100).toFixed(2); 
      this.rowActive = row.Active;
      }
    },
    hideModal() {
      this.$refs.editModal.hide();
    },
    deleteItem(row) {
      row.Active = !row.Active; //Allow for the boolean to be flipped each time the button is pressed
      if(row.Active == true) { 
        row._rowVariant = '' //If true take the red row highlight away
      } else {
        row._rowVariant = 'danger'; //Otherwise it wants to be deleted so highlight the row red
      }
      this.getTotalPrice();
    },
    saveEdits() {
      this.quotePlants.splice(this.currentRowId, 1,{ //Replace current row with new values inputted by splicing new object into
        PlantForQuoteId: this.rowPlantForQuoteId,
        PlantName: this.rowName,                  //its current postion
        FormSize: this.rowForm,
        Comment: this.rowComment,
        Quantity: parseInt(this.rowQuantity),
        Price:  parseFloat(this.rowPrice)*100, //Parsing edited value eg: "1.55" = 155 so it can be saved to db
        Active: this.rowActive,
        _rowVariant: '',
      });
      console.log(this.quotePlants);
      this.getTotalPrice();
      this.hideModal();
    },
    validateBeforeSubmit(e) { //Check that all validation passes before saving
      this.$validator.validateAll();
        if (!this.errors.any()) {
            this.saveEdits();
        }
    },
    saveQuote() {
      this.axios.put('https://ahillsquoteservice.azurewebsites.net/api/quote/edit?id=' + this.selectedQuote.quoteId, {
        QuoteId: this.selectedQuote.quoteId,
        CustomerRef: this.selectedQuote.customerRef,
				TotalPrice: this.totalPrice,
				SiteRef: this.selectedQuote.siteRef,
				QuoteDetails: this.quotePlants,
			}) 
			.then((response) => {
        console.log(response);
        this.$router.push('ExistingQuotes');
			})
			.catch((error) => {
				alert("Please check values before submitting")
				console.log(error);
			});
    },
    getTotalPrice() {
      this.totalPrice = 0
      this.quotePlants.forEach((element) => { //Loop through the array of plants on quote
        if(element.Active === true) {
				  let plantPrice = element.Quantity * element.Price; //Get the current price of that plant
          this.totalPrice += plantPrice; //Add it to the total cost of the quote
        }
      });
		},
	},
	created() {
    this.selectedQuote = this.$route.params.selectedQuote;
    this.getQuotePlants();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
