<template>
  <div>
    <div class="info">
      <h4>THIS IS GOING TO CHANGE</h4>
      <pick-list-info v-bind:pickListInformation="pickListInformation"></pick-list-info>
      <router-link :to="{name: 'ExistingQuotes', params: { salesOrder: true } }">
        <b-button variant="outline-danger" class="myBtn" @click="cancel">Cancel Allocation</b-button>
      </router-link>
      <router-link :to="{name: 'PickListFinalisation', params: { itemsToPick: this.items } }">
        <b-button variant="outline-primary" @click="tempSave" class="myBtn">Allocate Plants</b-button>
      </router-link>
    </div>
    <div class="list">
      <div class="row" style="height: 50vh;">
        <div class="col-xs-12 col-md-12 col-lg-12">
          <h4>Items to add to picklist</h4>
          <b-table
            show-empty
            stacked="md"
            :items="plantsOnQuoteToAddToPicklist"
            :fields="fields"
            outlined
          >
            <template slot="Price" slot-scope="row">£{{(row.item.Price/100).toFixed(2)}}</template>
            <template slot="actions" slot-scope="row">
              <b-button type="button" class="btn btn-primary" @click="openAddPlantModal(row.item)" 
              >Add plant to picklist</b-button>
            </template>
          </b-table>
        </div>
      </div>
      <div class="row" style="height: 49vh;">
        <div class="col-xs-12 col-md-12 col-lg-12">
          <div>
            <h4>Items currently on picklist</h4>
            <b-table show-empty stacked="md" outlined></b-table>
          </div>
        </div>
      </div>
      
    </div>
    <b-modal v-model="modalShow" size="lg" no-close-on-backdrop hide-footer title="Select A button to pick items for picklist">
        <p id="currentPlantTag"></p>
        <div class="row modal-lg">
          <div class="col-xs-3 col-md-3 col-lg-3">
            <b-button variant="outline-primary" class="myBtn" @click="hillsStockClick">Hills Stock</b-button>
          </div>
          <div class="col-xs-3 col-md-3 col-lg-3">
            <b-button variant="outline-primary" class="myBtn" @click="hillsSubsistueClick">Subsitute</b-button>
          </div>
          <div class="col-xs-3 col-md-3 col-lg-3">
            <b-button variant="outline-primary" class="myBtn" @click="sundriesClick">Sundries</b-button>
          </div>
          <div class="col-xs-3 col-md-3 col-lg-3">
            <b-button variant="outline-primary" class="myBtn">Supplier</b-button>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-xs-12 col-md-12 col-lg-12" v-if="showSearchBar">
            <b-input-group class="input-filter">
              <b-form-input type="text" v-model="plantSearch" placeholder="Type to Search"/>
                <b-input-group-append>
                  <b-btn @click="searchForPlant">Search</b-btn>
                </b-input-group-append>
                <b-input-group-append>
                  <b-btn @click="clearSearch">Clear</b-btn>
                </b-input-group-append>
            </b-input-group>
          </div>
          <div class="col-xs-12 col-md-12 col-lg-12" v-if="showSearchTable">
            <p v-if="showSearchMessage">Searching for current selected plant from Hills Stock</p>
            <b-table
            show-empty
            stacked="md"
            :items="currentSearchedPlants"
            :fields="searchedPlantFields"
            outlined
            >
          </b-table>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-12 col-lg-12">
            <b-button variant="outline-primary" block >Pick plants</b-button>
            <b-button variant="outline-danger" block >Close Modal</b-button>
          </div>
        </div>
      </b-modal>
    <!-- <pick-list-items class="list" v-bind:pickListInformation='pickListInformation' @getUsedBatches="putBatches"></pick-list-items> -->
  </div>
</template>

<script>
import PickListInfo from "@/views/PickingList/PickListComponents/PickListInfo.vue";
import PickListItems from "@/views/PickingList/PickListComponents/PickListItems.vue";
export default {
  components: {
    PickListInfo,
    PickListItems,
  },
  data() {
    return {
      fields: [
        { key: "PlantName", label: "Plant Name", sortable: true },
        { key: "FormSize", label: "Form Size" },
        { key: "Comment", label: "Comment" },
        { key: "Price", label: "Item Price", sortable: true,contenteditable: true},
        { key: "Quantity", label: "Qty Needed", sortable: true },
        { key: "QuantityOutstanding",label: "Qty Left to pick",sortable: true},
        { key: "actions", label: "Actions" }
      ],
      searchedPlantFields: [
        { key: "PlantName", label: "Plant Name", sortable: true },
        { key: "FormSize", label: "Form Size" },
        { key: "Location", label: "Location" },
        { key: "BatchQuantity", label: "Saleable", sortable: true },
        { key: "GrowingQuantity", label: "Growing", sortable: true },
        { key: "AllocatedQuantity", label: "Allocated", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      plantsOnQuoteToAddToPicklist: [],
      pickListInformation: "",
      items: "",
      modalShow: false,
      currentSearchedPlants: [],
      currentSelectedPlant: null,
      plantSearch: "",
      showSearchBar: false,
      showSearchTable: false,
      showSearchMessage: false,
    };
  },
  methods: {
    getPlants() {
      // console.log(this.pickListInformation.salesOrderInfo.quoteId);
      this.axios
        .get(
          "https://ahillsquoteservice.azurewebsites.net/api/quote/detail?id=" +
            this.pickListInformation.salesOrderInfo.quoteId
        )
        .then(response => {
          this.addQuotePlantsToArray(response.data.QuoteDetails); //Pass in just the plants on the quote to be displayed on table
        })
        .catch(error => {
          alert(error);
        });
    },
    addQuotePlantsToArray(response) {
      for (var i = 0; i < response.length; i++) {
        if (response[i].Active === true) {
          this.plantsOnQuoteToAddToPicklist.push({
            PlantForQuoteId: response[i].PlantForQuoteId,
            PlantName: response[i].PlantName,
            FormSize: response[i].FormSize,
            Comment: response[i].Comment,
            Quantity: response[i].Quantity,
            QuantityOutstanding: 0, //To change eventually and calculate how many more is needed based on value already picked
            Price: response[i].Price,
            Active: response[i].Active
          });
        }
      }
    },
    openAddPlantModal(row) //Add a duplicate of the row pressed to arrayOfBatches and set the quantityOutstanding = "the quantityNeeded"
    {
      this.currentSelectedPlant = row;
      console.log(row)
      document.getElementById("currentPlantTag").innerHTML = "Current Plant to Pick: " + row.PlantName + " " + row.FormSize + " Quantity Needed: " + row.Quantity
                                                              // + " Quantity Left to Pick: " + row.QuantityOutstanding
      this.showSearchTable = false;
      this.showSearchBar = false;
      this.showSearchMessage = false;
      //empty the table here too
      this.modalShow = true;
    },
    searchForPlant()
    {
      if (this.currentSelectedPlant != null)
      {
        this.axios.get("https://ahillsbatchservice.azurewebsites.net/api/Batches/search?searchQuery=" +
            this.plantSearch
        )
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            this.currentSearchedPlants.push({
              PlantName: response.data[i].Name,
              FormSize: response.data[i].FormSize,
              Location: response.data[i].Location,
              BatchQuantity: response.data[i].Quantity,
              GrowingQuantity: response.data[i].GrowingQuantity,
              AllocatedQuantity: response.data[i].AllocatedQuantity,
            });
          }
          this.showSearchMessage = false;
        })
        .catch(error => {
          alert(error);
        });
      }
    },
    hillsStockClick()
    {
      this.showSearchBar = false;
      this.showSearchTable = true;
      this.showSearchMessage = true;
      this.currentSearchedPlants = [];
      if (this.currentSelectedPlant != null)
      {
        this.axios.get("https://ahillsbatchservice.azurewebsites.net/api/Batches/search?searchQuery=" +
            this.currentSelectedPlant.PlantName
        )
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            this.currentSearchedPlants.push({
              PlantName: response.data[i].Name,
              FormSize: response.data[i].FormSize,
              Location: response.data[i].Location,
              BatchQuantity: response.data[i].Quantity,
              GrowingQuantity: response.data[i].GrowingQuantity,
              AllocatedQuantity: response.data[i].AllocatedQuantity,
            });
          }
          this.showSearchMessage = false;
        })
        .catch(error => {
          alert(error);
        });
      }
    },
    hillsSubsistueClick()
    {
      this.showSearchBar = true;   
      this.showSearchTable = true; 
      this.currentSearchedPlants = [];
    },
    sundriesClick()
    {
      this.showSearchBar = false;  
      this.showSearchTable = false;  
      this.currentSearchedPlants = [];
      alert("Warning only use this for sundres! This will automatically add the full quantity needed");
    },
    clearSearch()
    {
      this.currentSearchedPlants = [];
      this.plantSearch = ""
    },
    cancel() {
      sessionStorage.removeItem("tempBatchSave");
    },
    tempSave() {
      //Save the items to session storage so that if you want to go back you are able to get the original values
      sessionStorage.setItem("tempBatchSave", JSON.stringify(this.items));
    }
  },
  mounted() {
    this.pickListInformation = JSON.parse(
      sessionStorage.getItem("pickListInfo")
    );
    this.getPlants();
  }
};
</script>

<style scoped>
.info {
  width: 20%;
  height: 100%;
  float: left;
  /* background-color: slategray; */
  text-align: center;
  color: black;
}

.myBtn {
  width: 100%;
  float: left;
  margin-top: 5px;
  /* position: relative; */
  /* margin-top: 35px; */
}

.list {
  float: left;
  height: fit-content;
  max-height: 85vh;
  width: 80%;
  /* background-color:lightgray; */
  color: black;
  -webkit-overflow-scrolling: touch;
}



</style>