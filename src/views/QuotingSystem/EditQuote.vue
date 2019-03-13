<template>
  <div>
    <p>{{msg}}</p>
		<router-link to="/ExistingQuotes" tag="button">Back to quotes</router-link>
    <b-button @click="saveEdits" variant="outline-success">Save Edits</b-button>
		<p>
      Customer Ref: {{selectedQuote.customerRef}} ||
      Customer Name: {{selectedQuote.customerName}} ||
      Quote Start Date: {{selectedQuote.startDate}} ||
      Quote Expiry Date: {{selectedQuote.expiryDate}}
    </p>
		<p>Site Ref: {{selectedQuote.siteRef}} || Total Price: {{selectedQuote.totalPrice}}</p>
    <b-table show-empty
             stacked="md"
             :items="quotePlants"
             :fields="fields"
             class="table"  
             >
      <div slot="empty">
        <strong>Loading quotes plants...</strong>
      </div>       
      <template slot="actions" slot-scope="row">
				<i class="far fa-edit fa-lg" style="color:green" @click.stop="editItem(row.item)"></i>
				<i class="fas fa-trash-alt fa-lg" style="color:red" @click.stop="deleteItem(row.id)"></i>
        <b-modal ref="editModal" hide-footer :title="rowName">
          <div class="d-block text-center">
            <p>Comment: <input type="text" v-model="rowComment"></p>
            <p>Quantity: <input type="text" v-model="rowQuantity"><p>
            <p>Price: <input type="text" v-model="rowPrice"></p>
          </div>
            <b-button class="mt-3" variant="outline-primary" block @click.stop="saveEdits">Save Edits</b-button>
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
        { key: 'plantName', label: 'Plant Name', sortable: true},
        { key: 'formSize', label: 'Form Size'},
        { key: 'comment', label: 'Comment'},
        { key: 'quantity', label: 'Quantity', sortable: true},
        { key: 'price', label: 'Item Price', sortable: true, contenteditable: true},
        { key: 'actions', label: 'Actions' }
			],
      quotePlants: [],
      rowName: '',
      rowComment: '',
      rowQuantity: '',
      rowPrice: '',
      edited: false,
    }
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
        this.quotePlants.push({                 //This is then pushed into an array and used to populate the data table
          "plantName": response[i].PlantName,
          "formSize": response[i].FormSize,
          "comment": response[i].Comment,
          "quantity": response[i].Quantity,
          "price": this.getPrice(response[i].Price),
        });   
    }
  },
  getPrice (price) { //Does the same as computed method but passed in a value
      return (price/100).toFixed(2);
  },
  editItem(row) {
    if(this.edited) {
      console.log("im here")
      row.Comment = this.rowComment;
      row.Quantity = this.rowQuantity
      row.Price = this.rowPrice;
    } else {
      this.$refs.editModal.show();
      this.rowName = row.plantName;
      this.rowComment = row.comment;
      this.rowQuantity = row.quantity;
      this.rowPrice = row.price;
    }
  },
  hideModal() {
    this.$refs.editModal.hide();
    this.edited = false;
  },
  deleteItem(id) {
    this.quotePlants.splice(id,1);
    console.log(this.quotePlants);
  },
  saveEdits(row) {
    this.edited = true;
    this.editItem();
    this.hideModal();
  }
	},
	created() {
		this.selectedQuote = this.$route.params.selectedQuote;
		this.getQuotePlants();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
