<template>
  <section>
    <quote-navbar class="navbar-custom" id="navbar2" v-bind:pageName='pageName'></quote-navbar>
    <!-- Quote information -->  
    <div class="left-div">
      <b-button @click="showCollapse = !showCollapse"
                :class="showCollapse ? 'collapsed' : null"
                style="margin-bottom: 5px;"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showCollapse ? 'true' : 'false'">
        <p v-if="showCollapse">Hide Customer Information<i class="fas fa-minus plus"></i></p>
        <p v-else>Show Customer Information<i class="fas fa-plus plus"></i></p>
      </b-button>
			<b-collapse v-model="showCollapse" id="collapse">
				<p>
					Customer Name: <strong>{{currentCustomer.customerName}}</strong> <br>
					Customer Reference: <strong>{{currentCustomer.customerRef}}</strong> <br>
					Customer Telephone: <strong>{{currentCustomer.customerTel}}</strong> <br>
          Customer Telephone2: <strong>{{currentCustomer.customerTel2}}</strong>
				</p>
				<p>	
					Customer Address: <strong>{{currentCustomer.customerAddress}}</strong> <br>
					Customer Email: <strong>{{currentCustomer.customerEmail}}</strong> <br>
				</p>
				<p>
					Site reference: <strong>{{selectedQuote.siteRef}}</strong> <br>
					Quote Date: <strong>{{selectedQuote.startDate}}</strong> <br>
					Expiry Date: <strong>{{selectedQuote.expiryDate}}</strong> <br>
				</p>
        <hr>
			</b-collapse>
      <!-- Collapsible area to edit SiteRef and add plants to quote -->
      <b-button @click="showCollapse2 = !showCollapse2"
                :class="showCollapse2 ? 'collapsed' : null"
                style="margin-bottom: 5px;"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showCollapse2 ? 'true' : 'false'">
        Edit SiteRef / Add Plants
        <i class="fas fa-plus plus"></i>
      </b-button>
      <b-collapse v-model="showCollapse2" id="collapse">
        <b-form-group class="site-input" horizontal label="Site Ref: " >
          <b-form-input v-model="selectedQuote.siteRef"/>
        </b-form-group>
          <multiselect v-model="selectedBatch" 
                       :options="batches"  
                       placeholder="Select a batch" 
                       label="plantName"
                       :loading="isLoading"
                       :custom-label="customLabel"
                       :show-labels="false"
                       :allow-empty="false"
                       style="margin-bottom: 5px;">
            <template slot="option" slot-scope="props">
              <div>
				        <span>{{props.option.plantName }} {{props.option.formSize }}</span>
				        <br>
				        <span> Quantity: {{props.option.quantity}}
                       Price: <strong>£{{(props.option.price/100).toFixed(2)}}</strong>
                </span>
			        </div>
            </template>
          </multiselect>
          <b-form-input v-model="batchQuantity"
                        placeholder="Enter a quantity"
                        type="number"
                        pattern="[0-9]*"
                        v-validate="'required|numeric|min_value:1'"
                        name="batchQuantity"
                        inputmode="numeric"
                        @keyup.enter.native="validateBatch"></b-form-input>	
                        <p class="text-danger" v-if="errors.has('batchQuantity')">{{ errors.first('batchQuantity') }}</p>
          <b-form-input v-model="comment"
                        placeholder="Enter a plant comment"
                        type="text"
                        style="margin-top: 5px;"
                        @keyup.enter.native="validateBatch">
        </b-form-input>
        <b-button @click="validateBatch" variant="outline-primary" style="margin-top: 5px;">Add plant</b-button>	
      </b-collapse>
      <hr>
      <!-- Buttons to exit or save -->
      <b-button variant="outline-primary" v-if="selectedQuote.SalesOrder" @click="createPDF('Sales Order')" style="margin-bottom: 7px;">Create Sales Order PDF</b-button>
      <b-button variant="outline-primary" v-else @click="createPDF('Quotation')" style="margin-bottom: 7px;">Create Quote PDF</b-button>
      <br>
    	  <router-link v-if="selectedQuote.SalesOrder" :to="{name: 'ExistingQuotes', params: { salesOrder: true } }">
          <b-button variant="outline-danger">Back to Sales Order</b-button>
        </router-link>
    	  <router-link v-else :to="{name: 'ExistingQuotes', params: { salesOrder: false } }">
          <b-button variant="outline-danger">Back to quotes</b-button>
        </router-link>
        <b-button @click="saveQuote" variant="outline-success" v-if="totalPrice != 0">Save Edits</b-button>
        <p v-else>Before you can save a quote it needs some items</p>
    </div>
    <!-- EditQuote table -->
    <div class="right-div">
      <strong>Quote Price: £{{computedTotalPrice}}</strong>  
      <b-table show-empty
              stacked="md"
              :items="quotePlants"
              :fields="fields"   
              outlined       
              >
        <div slot="empty">
          <strong>Loading quotes plants...</strong>
        </div>   
        <template slot="Price" slot-scope="row">
          £{{(row.item.Price/100).toFixed(2)}}
        </template>      
        <template slot="actions" slot-scope="row">
          <b-button type="button" class="btn btn-success action-btn" @click.stop="editItem(row.item, row.index)"><i class="far fa-edit fa-lg" style="color:black"></i></b-button>
          <b-button type="button" class="btn btn-danger action-btn" v-if="row.item.PlantForQuoteId > 0" @click.stop="deleteItem(row.item, row.index)"><i class="fas fa-trash-alt fa-lg" style="color:black"></i></b-button>
          <b-button type="button" class="btn btn-danger action-btn" v-else @click.stop="remove(row.index)"><i class="fas fa-times fa-lg" style="color:black" v-b-tooltip.hover title="Remove Item"></i></b-button>
          <!-- <i class="fas fa-check fa-lg" style="color:blue" @click.stop="pickingList(row.item, row.index)" v-if="selectedQuote.SalesOrder"></i> -->
          <!-- Editing modal -->
          <b-modal :ref='"editModal"+row.index' no-close-on-backdrop hide-footer :title="rowTitle">
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
                              inputmode="numeric"
                              name="rowPrice"
                              v-validate="'required|decimal:2|min_value:0.01'" />
              </b-form-group>
              <p class="text-danger" v-if="errors.has('rowPrice')">{{ errors.first('rowPrice') }}</p>
            </div>
              <b-button class="mt-3" variant="outline-primary" block @click.stop="validateBeforeSubmit">Save Edits</b-button>
              <b-button class="mt-3" variant="outline-danger" block @click="hideModal(row.index)">Close Me</b-button>
          </b-modal>
          <!-- <b-modal :ref='"pickListModal"+row.index' size="lg" no-close-on-backdrop hide-footer @close="emptySelectedArr" title="Select a batch to add to pick list">
            <div v-if="batchesToPick != null">
              <p>Row quantity needed: {{quantityNeeded-quantityTyped}}</p>
              <br>
              <p>Selected {{selected}}</p>
              <b-table striped hover :items="batchesToPick" :fields="pickListFields">
                <template slot="actions" slot-scope="row">
                  <b-form-checkbox :ref='"checkbox"+row.index' @change="selectedItem(row.item, row.item.batchId)" >
                    Use Batch:
                  </b-form-checkbox>
                  <b-form-group v-if="selected.includes(row.item)" horizontal label="Qty:" >
                    <b-form-input v-model="row.item.quantityUse"
                                  placeholder="Enter a quantity"
                                  @input="calculateQuantity" />
                  </b-form-group>
                </template>
              </b-table>
            </div>
              <b-button variant="outline-primary" block @click="boop">Use selected batches</b-button>
              <b-button variant="outline-danger" block @click="hidePickListModal(row.index)">Close Me</b-button>
          </b-modal> -->
        </template>
      </b-table>
    </div>
    <b-modal ref="createPDFModal" size="md" title="Create a quote PDF?" centered hide-footer hide-header-close no-close-on-backdrop>
		  <div class="modal__footer">
        <router-link v-if="selectedQuote.SalesOrder" :to="{name: 'ExistingQuotes', params: { salesOrder: true } }">
        <b-button variant="outline-danger">Back to Sales Order</b-button>
      </router-link>
    	<router-link v-else :to="{name: 'ExistingQuotes', params: { salesOrder: false } }">
        <b-button variant="outline-danger">Back to quotes</b-button>
        </router-link>
        <b-btn variant="outline-primary" v-if="selectedQuote.SalesOrder == false" @click="createPDF('Quotation')">Create Quote PDF</b-btn>
        <b-btn variant="outline-primary" v-else @click="createPDF('Sales Order')">Create Sales Order PDF</b-btn>
      </div>
    </b-modal>
  </section>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import QuoteNavbar from '@/components/QuoteNavbar.vue';
import firebase from 'firebase/app';
export default {
  name: 'EditQuote',
  components: {
    QuoteNavbar,
  },
  data () {
    return {
			pageName: '',
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
      rowTitle: '',
      rowName: '',
      rowForm: '',
      rowComment: '',
      rowQuantity: '',
      rowPrice: '',
      rowActive: '',
      totalPrice: 0,
      currentCustomer: null,
      showCollapse: false,
      showCollapse2: false,
      batches: [],
      selectedBatch: null,
      comment: null,
      batchQuantity: null,
      isLoading: true,
      batchesToPick: null,
      pickListFields: [
        {key: 'plantName', label: 'PlantName'},
        {key: 'formSize', label: 'Form Size'},
        {key: 'location', label: 'Location'},
        {key: 'quantity', label: 'Quantity'},
        {key: 'actions', label: 'Actions'},
      ],
      selected: [],
      checkboxIds: [],
      quantityNeeded: null,
      quantityTyped: 0,
      VAT: 0,
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
    getBatches() {
		  this.axios.get('https://ahillsbatchservice.azurewebsites.net/api/Batches') //Call the database to retrieve the current batches
      .then((response) => {
        this.changeBatchData(response.data);
        this.isLoading = false;
      }).catch((error) => {
				alert("Sorry there was an error")
				console.log(error)
      });
    },
    changeBatchData (response) {
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
				if(response[i].Active === true) {        //Only get the batches that are active to not show deleted batches  
					this.batches.push({                 //This is then pushed into an array and used to populate the data table
						"batchId": response[i].Id,
						"Sku": response[i].Sku,
						"plantName": response[i].Name,
						"location": response[i].Location,
						"quantity": response[i].Quantity,
						"formSize": response[i].FormSize,
            "price": response[i].WholesalePrice,
            "active": response[i].Active,
            "growingQuantity": response[i].GrowingQuantity,
            "allocatedQuantity": response[i].AllocatedQuantity,
            "dateStamp": response[i].DateStamp,
					});
     	  }     
      }
    },
		customLabel ({ plantName, formSize, quantity }) { //Returns a custom label to be used on the dropdown
      return `${plantName} | ${formSize} | Qty: (${quantity})`
    },
    addToList() {
      this.quotePlants.push({ //This is then pushed into an array and used to populate the data table
        PlantForQuoteId : -1, //Id is -1 so when it is passed to the back end, it will check if Ids are greater than 0 edit them
        PlantName: this.selectedBatch.plantName, //Otherwise it is a new plant so add it to the database
        FormSize: this.selectedBatch.formSize,
        Comment: this.comment,
        Quantity: parseInt(this.batchQuantity),
        Price: this.selectedBatch.price,
        Active: true,
        _rowVariant: this.checkIfBatchHasPrice(this.selectedBatch.price),
      });
      this.getTotalPrice(); //Once a plant is added recalculate the current quote price
			this.selectedBatch = null
			this.batchQuantity = null
			this.comment = null
			this.$validator.reset();
    },
    checkIfBatchHasPrice(price) { //This method will determine if the batch has a price or not
			if(price <= 0) {
				return 'danger' //If it doesnt change the _rowVariant which will then highlight the row red
			} else {
				return '' //Else it has a price so dont highlight the row
			}
		},
    editItem(row, rowId) {
      if(row.Active == true){ //If the row hasnt been "deleted" open the edit modal
        this.$refs['editModal'+rowId].show(); //Open editing modal
        this.currentRowId = rowId; //Set the current values of the row so they can be edited then spliced into array
        this.rowPlantForQuoteId = row.PlantForQuoteId;
        this.rowTitle = row.PlantName + " " + row.FormSize;
        this.rowName = row.PlantName;
        this.rowForm = row.FormSize
        this.rowComment = row.Comment;
        this.rowQuantity = row.Quantity;
        this.rowPrice = (row.Price/100).toFixed(2); 
        this.rowActive = row.Active;
      }
    },
    hideModal(rowId) {
      this.$refs['editModal'+rowId].hide();
    },
    // pickingList(row, rowId) {
    //   this.$refs['pickListModal'+rowId].show();
    //   // this.$refs['checkbox'+rowId].is_checked = false;
    //   this.selected = [];
    //   this.quantityNeeded = row.Quantity
    //   let stockBatches = JSON.parse(sessionStorage.getItem('batchList'));
    //   let selectedPlants = stockBatches.filter(stockBatches => //Loop through batches to find which match the one selected for picking
    //       (stockBatches.plantName === row.PlantName && stockBatches.formSize === row.FormSize));  
    //   var counter = 0;    
    //   selectedPlants.forEach(element => {
    //     element.quantityUse = element.quantity; //Add a new element to the object for the quantity thats going to be use on picklist
    //     this.checkboxIds.push("checkbox"+counter);
    //     counter++;
    //   });  
    //   this.batchesToPick = selectedPlants;
    //   // this.batchesToPick.forEach(element => {
    //   //   var counter = 0;
    //   //   this.checkboxIds.push("checkbox"+counter);
    //   //   counter++;
    //   // });
    // },
    hidePickListModal(rowId) {
      this.$refs['pickListModal'+rowId].hide();
    },
    selectedItem(row, batchId) {
      if(this.selected.includes(row)) {
        const index = this.selected.indexOf(row);
        this.selected.splice(index,1);
      } else {
        this.selected.push(row);
        this.calculateQuantity();
      }
      this.calculateQuantity();
    },
    calculateQuantity() {
      this.quantityTyped = 0;
      this.selected.forEach(element => {
        if(element.quantityUse != 0) {
          this.quantityTyped += parseInt(element.quantityUse);
        }
      });
      // let newQty = this.quantityNeeded-quantityTyped;
      // console.log(this.quantityNeeded);
      // this.quantityNeeded = newQty;
    },
    getFirebase() {
			var ref = firebase.database().ref("GPM/").orderByKey();
			// console.log(ref);
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
    deleteItem(row) { //This will make the row not Active so will delete when sent to database
      row.Active = !row.Active; //Allow for the boolean to be flipped each time the button is pressed
      if(row.Active == true) { 
        row._rowVariant = '' //If true take the red row highlight away
      } else {
        row._rowVariant = 'danger'; //Otherwise it wants to be deleted so highlight the row red
        console.log(this.quotePlants.length);
        this.quotePlants.length - 1;
      }
      this.getTotalPrice();
    },
    remove(id) { //This method is called for when new plants are added to the quote meaning youre able to remove if there was a mistake
			this.quotePlants.splice(id,1);
			this.getTotalPrice();
		},
    saveEdits() {
      this.quotePlants.splice(this.currentRowId, 1,{ //Replace current row with new values inputted by splicing new object into
        PlantForQuoteId: this.rowPlantForQuoteId,
        PlantName: this.rowName,                  //its current postion
        FormSize: this.rowForm,
        Comment: this.rowComment,
        Quantity: parseInt(this.rowQuantity),
        Price:  Math.trunc(parseFloat(this.rowPrice)*100), //Parsing edited value eg: "1.55" = 155 so it can be saved to db
        Active: this.rowActive,
        _rowVariant: '',
      });
      this.getTotalPrice();
      this.hideModal(this.currentRowId);
      this.$validator.reset();
    },
    validateBeforeSubmit(e) { //Check that all validation passes before saving
      this.$validator.validate('rowQuantity', this.rowQuantity); //Validate the inputs on the modal
      this.$validator.validate('rowPrice', this.rowPrice);
      if (!this.errors.any()) { 
          this.saveEdits(); //If there are no validation errors and a batch has been selected add a plant to the list
      }
    },
    validateBatch(e) { //Check that all validation passes before saving
      this.$validator.validateAll();
      if (!this.errors.any() && this.selectedBatch != null && this.batchQuantity != null) { 
          this.addToList(); //If there are no validation errors and a batch has been selected add a plant to the list
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
        this.$refs.createPDFModal.show()
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
    getCustomerInfo() {
      if(sessionStorage.getItem("customers") != null) { //If exists load parse customers back to array of objects
        let customers = JSON.parse(sessionStorage.getItem("customers")); 
        for (let i = 0; i < customers.length; i++) { //Loop through the current customers to find whos quote it belongs to
          if(customers[i].customerRef === this.selectedQuote.customerRef) {
            this.currentCustomer = customers[i]; //Set an accessable variable so that their information can be added on the pdf
          }
        }
      } else {
        if(confirm("Customers need to be loaded into storage. Please go to the home page")) {
          this.$router.push('HomePage');
        } else {
          //do nothing
        }

      }
    },
    formatPriceForPDF() {
      //This is done after the quote has been saved to the database so changes will only show on created PDF
      //Map through the list of plants changing the price from "250p to 2.50"
      this.quotePlants.map(o => Object.assign(o, {Price: "£"+(o.Price/100).toFixed(2)}))
    },
    formatTableForPDF() {
      for (let i = 0; i < this.quotePlants.length; i++) {
        if(this.quotePlants[i].Active == false) { //Loops through the array and will remove any items that have been deleted on the quote
          this.quotePlants.splice(i,1); //This is done after the quote has been saved to the database so it show when the PDF is created
        }
      }
    },
    createPDF (pdfType) {
      this.formatPriceForPDF();
      this.formatTableForPDF();
			let pdfName = this.selectedQuote.quoteId  + "-" + this.selectedQuote.customerName + "-" + this.selectedQuote.startDate;
			var columns = [
        {title: "Quantity", dataKey: "Quantity"},
				{title: "Plant Name", dataKey: "PlantName"},
				{title: "Form Size", dataKey: "FormSize"},
				{title: "Comment", dataKey: "Comment"},
				{title: "Price", dataKey: "Price"},
			];
			var companyLogo = {
				src: 'data:image/png;base64,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'
			}
			var companyInfo = "Station Nurserys\n" +
												"Stokesley\n" +
												"Middlesbrough\n" +
												"TS9 7AB\n" +
												"Tel: 01642 711281\n" +
												"Email: enquiries@hillandsons.co.uk\n" +
												"Web: hillandsons.co.uk\n" +
                        "Stock: hillsstock.co.uk"
      //string expiry = "Expiry Date: " + this.selectedQuote.expiryDate).toString();

			var quoteInfo =	pdfType + " Id: " + this.selectedQuote.quoteId + "\n" +
											"Customer Ref: " + this.selectedQuote.customerRef + "\n" +
											"Start Date: " + this.selectedQuote.startDate + "\n"
															
			var deliveryInfo = "Customer Name: " + this.selectedQuote.customerName + "\n" +
												 "Customer Ref: " + this.selectedQuote.customerRef + "\n" +
												 "Customer Tel: " + this.currentCustomer.customerTel + "\n" +
												 "Customer Email: " + this.currentCustomer.customerEmail + "\n" +
												 "Customer Address: "+ this.currentCustomer.customerAddress + "\n"
			var doc = new jsPDF('p', 'pt');
			doc.addImage(companyLogo.src, 'PNG', 30, 30, 100, 75);
			doc.setFontSize(20);
			doc.text(pdfType, 443, 35)
			doc.setFontSize(10);
			doc.text(companyInfo, 135, 35);
			doc.text(quoteInfo, 443, 50);
      doc.text("Site Reference: " + this.selectedQuote.siteRef, 400, 140);
      doc.setFontSize(12);
      doc.text("Expiry Date: " + this.selectedQuote.expiryDate, 400, 155)
			doc.setLineWidth(1);
			doc.line(0,125,700,125) 
			doc.setFontSize(10);
			doc.text(deliveryInfo, 40, 140)
      doc.autoTable(columns, this.quotePlants, {theme: 'striped', startY: 200,
                                                styles: {
																							      overflow: 'linebreak',
																							      cellWidth: 100,
                                                    },
                                                });
      let finalY = doc.autoTable.previous.finalY;
			let quotePrice = (this.totalPrice/100).toFixed(2);
			let quoteVAT = (quotePrice/100*20).toFixed(2);
      let priceAfterVAT = (parseFloat(quotePrice)+parseFloat(quoteVAT)).toFixed(2);
      let footerText = "These Prices Exclude Delivery Charges Unless Quoted";
      doc.setFontSize(12);
      doc.text(footerText,140, finalY+15);
      doc.setLineWidth(1);
      doc.line(140,finalY+17,435,finalY+17) 
			doc.text("Total Exc. VAT: £" + quotePrice, 380, finalY+40);
			doc.text("VAT:                  £" + quoteVAT, 380, finalY+55);
      doc.text("Total Inc. VAT:  £" + priceAfterVAT, 380, finalY+70);
      
      doc.setFontSize(10);
      doc.text("Thank you for your Enquiry",120,finalY+40)
      doc.setFontSize(8);
      doc.text("We look forward to our next opportunity to price for you", 90, finalY+50);
      doc.text("Vat No 258 1678 29 : Plant Passport No GB/12803 : Company No 4395902", 60, finalY+60);
      doc.text("Directors D.Hill : M.Hill : J.Hill : S.Hill", 120, finalY+70);
			doc.save(pdfName + '.pdf');

			//this.$router.push('ExistingQuotes');
    },
	},
	created() {
    this.selectedQuote = this.$route.params.selectedQuote;
    this.getQuotePlants();
    this.getCustomerInfo();
    this.getBatches();
    this.getFirebase();
    
  },
  mounted() {
    if(this.selectedQuote.SalesOrder) {
      this.pageName = 'Sales Order Editing';
      document.getElementById("navbar2").style.backgroundColor = "#11979e";
    } else {
      this.pageName = 'Quote Editing';
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  p{
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .plus{
    float: right;
    text-align: center;
  }

  input{
    font-size: 16px;
  }

  .left-div
	{
    width: 30%;
		height: 100%; 
		float:left;
	}

	.right-div {
		float:left;
		width:70%;
		overflow:hidden;
	}

  .navbar-custom {
    background-color: #0b720b
  }

  .action-btn
  {
    width: 75px;
  }

  @media only screen and (max-width : 768px) {

    .site-input {
      width: 50%;
    }

    .left-div {
		  position: relative;
		  width: 100%;
	  }

	  .right-div {
		width: 100%;
		position: relative;
		}
  }

</style>
