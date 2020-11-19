<template>
    <div>
      <quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
      <div class="left-div">
        <p>Search Pick List</p>
        <b-input-group class="input-filter" style="margin-top:10px;">
              <b-form-input v-model="filter" placeholder="Type to Search"/>
                <b-input-group-append>
                  <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                </b-input-group-append>
          </b-input-group>
        <b-button @click="showEditCollapse = !showEditCollapse"
                :class="showEditCollapse ? 'collapsed' : null"
                style="margin-bottom: 5px;"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showEditCollapse ? 'true' : 'false'">
                Edit PickList Details
                <i class="fas fa-plus plus"></i>
        </b-button>
        <b-collapse v-model="showEditCollapse" id="collapse">
          <div class="editDate">
            <p>Edit Picklist Date</p>
            <b-input-group class="input-filter" style="margin-top:10px;">
                <h5 style="margin-top:5px; margin-left: 15px;">{{deliveryTypeName}}</h5>
                <b-btn @click="changeDeliveryType" style="margin-left: 15px;">Change Delivery Type</b-btn>
            </b-input-group>
            <b-form-group horizontal label="Current Date:">
              <p>{{oldDispatchDate}}</p>
            </b-form-group> 
            <b-form-group horizontal label="New Date:">
            <datepicker id="modalDatepicker"
                      placeholder="Select Date"
                      :format="customFormatter"
                      
                      @selected="setSelectedDate"
                      monday-first
                      clear-button
                      bootstrap-styling
                      ></datepicker>
          </b-form-group>     
            <b-button variant="outline-success" type="button" class="btn btn-block" @click="saveDateChanges">Save Date changes</b-button>
          </div>
        </b-collapse>
        <b-button @click="showAddCollapse = !showAddCollapse"
                :class="showAddCollapse ? 'collapsed' : null"
                style="margin-bottom: 5px;"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showAddCollapse ? 'true' : 'false'">
        Add Plants To Picklist
        <i class="fas fa-plus plus"></i>
        </b-button>
        <b-collapse v-model="showAddCollapse" id="collapse">
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
				        <span> Quantity: <strong>{{props.option.quantity}}</strong>
                       Price: <strong>£{{(props.option.price/100).toFixed(2)}}</strong>
                       Location: <strong>{{props.option.location}} </strong>
                </span>
			        </div>
            </template>
          </multiselect>
          <b-form-input v-model="batchQuantity"
                        placeholder="Enter a quantity to pick"
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
        <b-button @click="validateBatch" variant="outline-primary" style="margin-top: 5px;">Add plant to picklist</b-button>	
      </b-collapse>
        <!-- <b-button @click="showCollapse = !showCollapse"
                :class="showCollapse ? 'collapsed' : null"
                style="margin-bottom: 0;"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showCollapse ? 'true' : 'false'">
          <p v-if="showCollapse">Hide Items Left On Quote<i class="fas fa-minus plus"></i></p>
          <p v-else>Show Items Left On Quote<i class="fas fa-plus plus"></i></p>
        </b-button>  -->
        <!-- <b-collapse v-model="showCollapse" class="input-pad" id="collapse">
          <p>Will finish this soon, these items havent been allocated so need to deal with that somehow</p>
          <ul>
            <li v-for="(data, index) in remainingPlants" :key='index'>
              {{data.plantName}} {{data.formSize}} | Amount On Quote: {{data.amountNeeded}} 
              <b-form-input v-model="data.quantityEntered" 
                            placeholder="Enter amount for plant above"
                            >
              </b-form-input>
              <p v-if="data.amountNeeded < data.quantityEntered">More than allocated on quote</p>
            </li>
          </ul>
          <b-button variant="outline-success" @click="addToList" v-if="remainingPlants.length != 0">Add Plant</b-button>
          <p v-else>All plants have been allocated from quote: {{pickListDetail.quoteId}}</p>
        </b-collapse> -->
        <div style="margin-top:5px;">
          <router-link :to="{name: 'PickLists'}">
            <b-button variant="outline-danger" class="btn">Back To Picklists</b-button>
          </router-link>
          <b-button variant="outline-primary" class="btn" @click="createPDF">Create Picklist PDF</b-button>
        </div>
      </div>
      <div class="right-div">
        <b-table show-empty
              stacked="md"
              :items="pickListDetailItems"
              :fields="fields"
              :filter="filter"
              outlined       
              >
              <template slot="actions" slot-scope="row" class="actions">
                <div class="row">
                  <div class="col-md-6 col-lg-6">
                    <b-button type="button" class="btn btn-success action-btn" @click.stop="editItem(row.item, row.index)"><i class="far fa-edit fa-lg" v-b-tooltip.hover title="Edit Item" style="color:black"></i></b-button>
                  </div>
                  <div class="col-md-6 col-lg-6">
                    <b-button type="button" class="btn btn-danger action-btn" @click.stop="deleteItemFromPickList(row.item)"><i class="fas fa-trash-alt fa-lg" v-b-tooltip.hover title="Delete PickList" style="color:black"></i></b-button>
                  </div>
                </div>
                 <b-modal :ref='"editModal"+row.index' no-close-on-backdrop hide-footer :title="rowTitle">
                  <div>
                    <p>Edit the quantity to pick for this plant</p>
                    <b-form-group horizontal label="Quantity:" >
                      <b-form-input v-model="editRowQuantityToPick"
                                    placeholder="Enter a quantity"
                                    type="number"
                                    pattern="[0-9]*"
                                    name="editRowQuantityToPick"
                                    inputmode="numeric"
                                    v-validate="'required|numeric|min_value:1'"  />
                    </b-form-group>
                    <p class="text-danger" v-if="errors.has('editRowQuantityToPick')">{{ errors.first('editRowQuantityToPick') }}</p>
                    <!-- <p class="text-danger" v-if="errors.has('rowPrice')">{{ errors.first('rowPrice') }}</p> -->
                  </div>
                    <b-button class="mt-3" variant="outline-primary" block @click.stop="validateBeforeSubmit">Save Edits</b-button>
                    <b-button class="mt-3" variant="outline-danger" block @click="hideModal(row.index)">Close Me</b-button>
                </b-modal>
              </template> 
        </b-table>
      </div>
    </div>
</template>

<script>
import moment from 'moment'
import QuoteNavbar from '@/components/QuoteNavbar.vue'
import Datepicker from 'vuejs-datepicker';
import jsPDF from 'jspdf'
import 'jspdf-autotable';
  export default {
    components: {
      QuoteNavbar,
      Datepicker,
  	},
      data() {
        return{
          pageName: "PickList Detail",
          pickListDetail: '',
          pickListDetailItems: [],
          plantsForPDF: [],
          filter: '',
          customerRef: '',
          customerTel: '',
          fields: [
          { key: 'plantName', label: 'Plant Name', sortable: true},
          { key: 'formSize', label: 'Form Size'},
          { key: 'location', label: 'Location'},
          { key: 'quantityToPick', label: 'Quantity To Pick', sortable: true},
          { key: "isSubbed", label: "Is Subsituted", formatter: (value, key, item) => {
                return value ? 'Yes' : 'No'
          }},
          { key: 'originalItem', label: 'Original Item' },
          { key: 'actions', label: 'Actions'},
          { key: 'plantForPicklistId', thClass: 'd-none', tdClass: 'd-none',}
          ],
          showCollapse: true,
          remainingPlants: [],
          deliveryTypeName: null,
          oldDispatchDate: '',
          newDispatchDate: null,
          showEditCollapse: false,
          showAddCollapse: false,
          batches: [],
          selectedBatch: null,
          isLoading: true,
          batchQuantity: null,
          comment: null,
          rowTitle: '',
          editRowQuantityToPick: null,
          originalRowQuantityToPick: null,
          plantForPicklistId: null,
        }
      },
      methods: {
        getPickListDetail() {
          this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/picklist/detail?id=' + this.pickListDetail.pickListId)
          .then((response) => {
            this.changeData(response.data.PickListPlants);
            this.customerRef = response.data.CustomerRef;
            this.customerTel = response.data.CustomerTel;
            if (response.data.EstimatedDelivery == true)
            {
               this.deliveryTypeName = 'Estimated';
            } else {
              this.deliveryTypeName = 'Exact';
            }
            this.oldDispatchDate = this.customFormatter(response.data.DispatchDate);
          })
          .catch((error) => {
              alert("Error getting current picklists: " + error);
          });
        },
        changeData(items) {
          items.forEach(item => {
            if(item.Active === true)
            {
              this.pickListDetailItems.push({
                "plantName": item.PlantName,
                "formSize": item.FormSize,
                "location": item.BatchLocation,
                "quantityToPick": item.QuantityToPick,
                "isSubbed": item.IsSubbed,
                "originalItem": item.OriginalItem,
                "plantForPicklistId": item.PlantForPicklistId,
              });
              this.plantsForPDF.push({
                "batchId": item.BatchId,
                "plantName": item.PlantName,
                "formSize": item.FormSize,
                "amountNeeded": item.QuantityToPick,
                "location": item.BatchLocation,
              });
            }
          });
        },
        customFormatter(date) { //Return the correct format so that the table dates can be filtered
          return moment(new Date(date)).format('DD/MM/YYYY');
        },
        setSelectedDate(date) {
          this.newDispatchDate = this.customFormatter(date);
          console.log(this.newDispatchDate);
        },
        saveDateChanges()
        {
          var estDeliveryBool = true;
          if (this.deliveryTypeName == 'Exact')
          {
            estDeliveryBool = false;
          }
          this.axios.put("http://ahillsquoteservice.azurewebsites.net/api/picklist/updateDate", 
            {
              PickListId: this.pickListDetail.pickListId,
              EstimatedDelivery: estDeliveryBool,
              DispatchDate: this.newDispatchDate,
            })
            .then((response) => {
              console.log(response);
              alert("Date changes saved")
            })
          .catch((error) => {
            alert(error);
          });
        },
        getRemainingPlants() {
          this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/picklist/plantsNeeded?id=' + this.pickListDetail.quoteId)
          .then((response) => {
            this.displayRemainingPlants(response.data)
          })
          .catch((error) => {
              alert("Error getting current remaining plants on quote: " + error);
          });
        },
        displayRemainingPlants(items) {
          items.forEach(element => {
            this.remainingPlants.push({
              "plantName": element.PlantName,
              "formSize": element.FormSize,
              "amountNeeded": element.AmountNeeded,
              "quantityEntered": null,
            });
          });
        },
        addToList() {
          this.remainingPlants.forEach(element => {
            if(parseInt(element.quantityEntered) != null && parseInt(element.quantityEntered) <= element.amountNeeded 
                         ){
              this.pickListDetailItems.push({
              "plantName": element.plantName,
              "formSize": element.formSize,
              "location": "addLocation",
              "quantityToPick": element.quantityEntered,
              "isSubbed": "GetThis",
              "subbedFor": "AndThis",
            });
            element.quantityEntered = null;
            }
          });
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
        validateBatch(e) { //Check that all validation passes before saving
          this.$validator.validateAll();
          if (!this.errors.any() && this.selectedBatch != null && this.batchQuantity != null) { 
              this.addNewItemToPicklist(); //If there are no validation errors and a batch has been selected add a plant to the list
          }
        },
        addNewItemToPicklist()
        {
            if(confirm("This will also add this plant onto the original sales order. Make sure to check pricing of item in quote"))
            {
              this.axios.put("https://ahillsquoteservice.azurewebsites.net/api/picklist/addItem", 
                {
                  PickListId: this.pickListDetail.pickListId,
                  PlantName: this.selectedBatch.plantName,
                  Comment: this.comment,
                  FormSize: this.selectedBatch.formSize,
                  QuantityToPick: this.batchQuantity,
                  BatchId: this.selectedBatch.batchId,
                })
                .then((response) => {
                  console.log(response);
                  this.pickListDetailItems = [],
                  this.getPickListDetail();
                })
              .catch((error) => {
                alert(error);
              });
            }
        },
        deleteItemFromPickList(row)
        {
            if(confirm("WARNING: If this is the last item on the picklist it will delete the entire picklist \nAre you sure you want to delete, this will add the Quantity to pick back onto the sales order"))
            {
                this.axios.put("http://ahillsquoteservice.azurewebsites.net/api/picklist/deletePicklistRow?PlantForPicklistId=" + row.plantForPicklistId, 
                {
                })
                .then((response) => {
                  console.log(response);
                  this.pickListDetailItems = [];
                  this.getPickListDetail();
                })
              .catch((error) => {
                alert(error);
              });
            }
        },
        editItem(row, rowId) {
            this.$refs['editModal'+rowId].show(); //Open editing modal
            this.rowTitle = row.plantName + " " + row.formSize;
            this.originalRowQuantityToPick = row.quantityToPick;
            this.plantForPicklistId = row.plantForPicklistId;
            if (row.plantForPicklistId == null)
            {
              confirm("plant for picklistid is null which means this will not be able to be edited");
            }
        },
        validateBeforeSubmit(e) { //Check that all validation passes before saving
          this.$validator.validate('editRowQuantityToPick', this.editRowQuantityToPick); //Validate the inputs on the modal
          if (!this.errors.any() && this.editRowQuantityToPick != null && this.editRowQuantityToPick > 0) { 
              this.saveRowEdit(); //If there are no validation errors and a batch has been selected add a plant to the list
          }
        },
        saveRowEdit()
        {
            if (confirm("If the quantity is greater than the original picklist, accepting this will add update this picklist and add the additional quantity to the sales order."))
            {
              console.log("updating picklist row");
              this.axios.put("http://ahillsquoteservice.azurewebsites.net/api/picklist/editPicklistRow", 
                {
                  PlantForPicklistId: this.plantForPicklistId,
                  NewQuantityToPick: this.editRowQuantityToPick,
                })
                .then((response) => {
                  console.log(response);
                  this.hideModal();
                  this.pickListDetailItems = [];
                  this.getPickListDetail();
                })
              .catch((error) => {
                alert(error);
              });
            }
        },
        hideModal(rowId) {
          this.$refs['editModal'+rowId].hide();
        },
        changeDeliveryType()
        {
          //Grim but w/e
          if (this.deliveryTypeName == 'Estimated')
          {
              this.deliveryTypeName = 'Exact'; 
          } else if (this.deliveryTypeName == 'Exact') 
          {
              this.deliveryTypeName = 'Estimated';
          }
        },
        createPDF() {
          let pdfName = 'Picklist' + this.pickListDetail.quoteId;
          var doc = new jsPDF('p', 'pt');
          var columns = [
            {title: "Batch Id", dataKey: "batchId"},
            {title: "Plant Name", dataKey: "plantName"},
            {title: "Form Size", dataKey: "formSize"},
            {title: "Qty Needed", dataKey: "amountNeeded"},
            {title: "Location", dataKey: "location"},
          ];
          // var companyLogo = {
          //   src: 'data:image/png;base64,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'
          // }
          var companyInfo = "Station Nurserys\n" +
                            "Stokesley\n" +
                            "Middlesbrough\n" +
                            "TS9 7AB\n" +
                            "Tel: 01642 711281\n" +
                            "Email: enquiries@hillandsons.co.uk\n" +
                            "Web: hillandsons.co.uk\n" +
                            "Stock: hillsstock.co.uk"
          // var deliveryNeeded;
          // if(this.picklistInfo.deliveryNeeded){
          //   deliveryNeeded = "Yes"
          // } else {
          //   deliveryNeeded = "No"
          // }
          var splitAdd = doc.splitTextToSize(this.pickListDetail.deliveryAddress, 150);       
          var orderTo =	  "Customer Ref: " + this.customerRef + "\n" +
                          "Customer Name: " + this.pickListDetail.customerName + "\n" +
                          "Customer Tel: " + this.customerTel + "\n"	
          var delivStr;                
          if(this.pickListDetail.estDeliv) {
            delivStr = "Estimated Delivery: "
          } else {
            delivStr = "Exact Delivery: "
          }                

          var deliveryStuff =	"Delivery Needed: " + this.pickListDetail.deliveryNeeded + "\n" +
                              delivStr + this.pickListDetail.dispatchDate + "\n"
          doc.setFontSize(20);
          doc.text("PICKING LIST", 240, 20);
          doc.setFontSize(10);
          doc.text("Order To:", 40, 35);
          doc.text(orderTo, 90, 35);
          doc.text("Customer Address:", 90, 70);
          doc.setFontStyle("bold");
          doc.text(splitAdd, 90, 80); //---------------------------------------------------Customer Address
          doc.setFontStyle("normal");
          doc.text("Deliver To:", 300, 35);
          doc.setFontStyle("bold");
          //if(this.picklistInfo.address != null) {
            var splitDelivAdd = doc.splitTextToSize(this.pickListDetail.deliveryAddress, 200); 
            doc.text(splitDelivAdd, 360, 35); //---------------------------------------------Delivery Address
          //} else {
          //  doc.text(splitAdd, 360, 35);
         // }
          doc.setFontStyle("normal");
          doc.text(deliveryStuff, 40, 130);
          doc.setLineWidth(1);
          doc.line(0,160,700,160) 
          doc.autoTable(columns, this.plantsForPDF, {theme: 'striped', startY: 170,
                                                    styles: {
                                                        overflow: 'linebreak',
                                                        },
                                                    columnStyles: {
                                                      0: {cellWidth: 50},
                                                      1: {cellWidth: 100},
                                                      2: {cellWidth: 100},
                                                      3: {cellWidth: 100},
                                                      4: {cellWidth: 50},
                                                      5: {cellWidth: 75},
                                                      }    
                                                    });
          let finalY = doc.autoTable.previous.finalY;
          doc.text("Comment: " + this.pickListDetail.comment, 40, finalY+10);
          // doc.text("Packed In: " + this.packedIn, 40, finalY+25);
          // doc.text("In Crates: " + this.inCrate, 40, finalY+40);
          // doc.text("In Trolly: " + this.inTrolly, 40, finalY+55);
          // doc.text("Loose: " + this.loose, 40, finalY+70);
          
          // let quotePrice = (this.totalPrice/100).toFixed(2);
          // let quoteVAT = (quotePrice/100*this.VAT).toFixed(2);
          // let priceAfterVAT = (parseFloat(quotePrice)+parseFloat(quoteVAT)).toFixed(2);
          // doc.setFontSize(12);
          // doc.text("Total Exc. VAT: £" + quotePrice, 380, finalY+20);
          // doc.text("VAT:                  £" + quoteVAT, 380, finalY+35);
          // doc.text("Total Inc. VAT:  £" + priceAfterVAT, 380, finalY+50);
          doc.save(pdfName + '.pdf');
          this.$router.push('PickLists');
        },
      },
      mounted() {
        this.pickListDetail = this.$route.params.pickListDetail;
        this.getPickListDetail();
        this.getRemainingPlants();
        this.getBatches();
      },
    }
</script>

<style scoped>

  .navbar-custom {
		background-color: #0f6368;
	}

  	.left-div
	{
    width: 25%;
		height: 100%; 
		float:left;
	}
  
	.right-div {
		float: left;
    height: fit-content;
    max-height: 90vh;
		width: 75%;
		overflow: auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
	}

  .plus{
    float: right;
    text-align: center;
  }

  .input-filter{
    margin-bottom: 5px;
  }

  .input-pad {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 0;
  }

</style>