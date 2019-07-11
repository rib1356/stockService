<template>
  <b-container fluid>
    <!-- User Navigation -->
    <b-navbar type="light">
      <b-navbar-brand >
        <img src="@/assets/AHillsLogo.png" class="d-inline-block align-top" alt="BV">
        <strong>A Hills Stock</strong>
      </b-navbar-brand>
      <!-- Right Aligned Menu Button -->
      <b-dropdown variant="outline" right class="m-2">
        <template slot="button-content">
          <span class="navbar-toggler-icon"></span>
        </template>
        <!-- <b-dropdown-item @click="sendHome">Home</b-dropdown-item> -->
        <b-dropdown-item @click="sendHome" v-if="authenticated">Home</b-dropdown-item>
        <b-dropdown-item @click="contactPage">Contact Us</b-dropdown-item>
        <b-dropdown-item @click="reloadBatches" v-if="authenticated">Reload Table</b-dropdown-item>
        <b-dropdown-item @click="addNewBatch" v-if="authenticated">Add New Batch</b-dropdown-item>
        <!-- <b-dropdown-item @click="quote" v-if="authenticated">Quote</b-dropdown-item> -->
        <!-- <b-dropdown-item @click="pricing" v-if="authenticated">Pricing</b-dropdown-item> -->
        <!-- <b-dropdown-item @click="admin" v-if="authenticated">Admin Page</b-dropdown-item> -->
        <b-dropdown-item @click="signOut" v-if="authenticated">Signout</b-dropdown-item>
        <b-dropdown-item @click="login" v-else>Login</b-dropdown-item>
      </b-dropdown>
    </b-navbar>

    <!-- Loader and Errors -->
    <p class="loader" v-if="loading"></p>
    <b-alert :show="ifError" variant="danger">{{status}}</b-alert>
    <!-- User Interface Controls -->
    <div class="filter-div">
    <b-row>
      <b-col md="6" class="my-1">
        <!-- <b-form-group horizontal label="Filter" class="mb-0"> -->
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        <!-- </b-form-group> -->
      </b-col>
      <b-col md="6" class="my-1">
        <!-- <b-form-group horizontal label="Sort" class="mb-0"> -->
          <b-input-group>
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">Choose Sort Option</option>
            </b-form-select>
            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        <!-- </b-form-group> -->
      </b-col>
    </b-row>
    </div>
    <!-- Main Table Element -->
    <div class="table-div">
    <b-table show-empty
             stacked="md"
             :items="plantData"
             :fields="fields"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             class="p-2"  
             :busy="isBusy"  
             >
      <div slot="empty">
        <strong>Loading batches...</strong>
      </div>       
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <!-- <p >{{ row.item.imageExists ? 'Yes :)' : 'No :(' }}</p> -->
        
        <b-button size="sm" variant="outline-primary" v-if="row.item.imageExists" @click.stop="info(row.item, $event.target)" >
          View Image
        </b-button>
        <p style="display:inline-block;" v-else>No image yet</p>
        <b-button size="sm" variant="outline-primary" v-if="authenticated" @click.stop="selectBatch(row.item, row.index)">
          Select Batch
        </b-button>
        
      </template> 
    </b-table>
    </div>
    <div>
      <!-- Picture Modal -->
     <b-modal id="modalInfo" size="lg" class="modal-lg" @hide="resetModal" :title="modalInfo.title" ok-only>
        <h4 v-if="!imageLoaded">Image Loading</h4>
        <p v-else-if="imgError">Sorry there was an error finding this image</p>
        <p v-if="imgError && !imageLoaded && authenticated">{{err}}</p>
        <!-- <div v-if="!imageLoaded" class="box"></div> -->
        <img @load="imageFinishedLoading" :src="imageURL" height="400" width="300">
      </b-modal>
    </div>
  </b-container>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/storage';
export default {
  name: 'StockTable',
  data () {
    return {
      fields: [
        { key: 'batchId', label: 'Latest Batches', thClass: 'd-none', tdClass: 'd-none', sortable: true},
        { key: 'plantName', label: 'Plant Full Name', sortable: true, sortDirection: 'desc' },
        { key: 'formSize', label: 'Form Size' },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'quantity', label: 'Saleable Qty', sortable: true },
        { key: 'growingQuantity', label: 'Growing Qty', sortable: true },
        { key: 'allocatedQuantity', label: 'Allocated Qty', sortable: true },
        { key: 'actions', label: 'Actions' }
      ],
      sortBy: 'plantName',
      sortDesc: false,
      sortSearch: false,
      sortDirection: 'asc',
      filter: '',
      modalInfo: { title: '', content: ''},
      status: '',
      plantData: [],
      loading: true,
      isBusy: true,
      userAuthenticated: '',
      ifError: false,
      authenticated: false,
      imageURL: null,
      imgError: false,
      imageLoaded: false,
      customers: [],
      err: ''
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    },
  },
  methods: {
    info(item, button) {
      this.modalInfo.title = `Name: ${item.plantName}`
      // this.modalInfo.content = JSON.stringify(item, null, 2)
      this.getDownloadURL(item.batchId, item.plantName);
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    resetModal() { //Reset the items of the modal
      this.modalInfo.title = ''
      this.modalInfo.content = ''
      this.imageURL = null
      this.imgError = false;
      this.imageLoaded = false;
    },
    selectBatch(item, index) { //Get the selected row
      var selectedBatch = new this.selectedBatchInformation(); //Create a new object and assign the row values
      selectedBatch.Sku = item.Sku;
      selectedBatch.plantName = item.plantName;
      selectedBatch.location = item.location;
      selectedBatch.quantity = item.quantity;
      selectedBatch.growingQuantity = item.growingQuantity;
      selectedBatch.allocatedQuantity = item.allocatedQuantity;
      selectedBatch.dateStamp = item.dateStamp;
      selectedBatch.formSize = item.formSize;
      selectedBatch.batchPrice = item.batchPrice;
      selectedBatch.batchId = item.batchId;
      selectedBatch.active = item.active;

      sessionStorage.setItem('selectedBatchInformation', JSON.stringify(selectedBatch)); //Save the current row to session storage to access data
      if(this.filter != null) {
      sessionStorage.setItem('filterValue', this.filter);
      }
      this.$router.push('BatchInformation'); //Move to next page
    },
    selectedBatchInformation(sku, plantName, location, quantity, formSize, batchPrice, batchId){
      var sku, plantName, loction, quantity, formSize, batchPrice, batchId;
    },
    retrieveData () {
      this.status = "loading stock information..."
      let batchInMemory = sessionStorage.getItem('batchInMemory');
      let auth = localStorage.getItem('logged');
      if(batchInMemory && auth) { //If user is logged in get the batches from session storage and display on table
        console.log("loading batches from sessionStorage")
        let batchList = sessionStorage.getItem('batchList');
        this.plantData = JSON.parse(batchList);
        this.loading = false;
        this.isBusy = false;
      } else { 
      console.log("loading batches from db")  
      this.axios.get('https://ahillsbatchservice.azurewebsites.net/api/Batches') //Call the database to retrieve the current batches
        .then((response) => {
          this.changeData(response.data);
          this.status = 'Stock Information loaded'
          this.ifError = false;
          this.loading = false; //Hide the spinner once data is loaded
          this.isBusy = false;
          this.button 
      }).catch((error) => {
          this.status = error;
          this.ifError = true;
      });
      }
    },
    changeData (response) {
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
      if(response[i].Active === true) {        //Only get the batches that are active to not show deleted batches  
        this.plantData.push({                 //This is then pushed into an array and used to populate the data table
          "batchId": response[i].Id,
          "Sku": response[i].Sku,
          "plantName": response[i].Name,
          "location": response[i].Location,
          "quantity": response[i].Quantity,
          "formSize": response[i].FormSize,
          "batchPrice": response[i].WholesalePrice, 
          "imageExists": response[i].ImageExists,
          "growingQuantity": response[i].GrowingQuantity,
          "allocatedQuantity": response[i].AllocatedQuantity,
          "dateStamp": response[i].DateStamp,
          "active": response[i].Active,
        });
      }
      }   
      //If the user is logged in save the data to session storage for easier retrieval
      if(this.authenticated) {
      sessionStorage.setItem('batchList', JSON.stringify(this.plantData));
      sessionStorage.setItem('batchInMemory', true);
      }
    },
    getAllCustomers() { //Get all customers from webservice --Is called from hasUserAuth()--
			this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/customer/all')
				.then((response) => {
					this.parseCustomers(response.data);
				})
				.catch((error) => {
						alert(error);
				});
		},
		parseCustomers(data) { //Push customers into an array of objects then save to local storage
			for(var i = 0; i < data.length; i++){
				this.customers.push({ //Create an array of objects
					"customerName": data[i].CustomerName,    //Data coming in is string so just assign values in object to be displayed
					"customerRef": data[i].CustomerReference,
					"customerTel": data[i].CustomerTel,
					"customerAddress": data[i].CustomerAddress,
          "customerEmail": data[i].CustomerEmail,
          "sageCustomer": data[i].SageCustomer,
				});
      }
      localStorage.setItem("customers", JSON.stringify(this.customers));
		},
    hasUserAuth() {
      this.authenticated = localStorage.getItem("logged");
      var user = firebase.auth().currentUser; 
      if (this.authenticated || user) { //If user is logged in show the available buttons
        this.authenticated = true;
        // this.getAllCustomers(); //If logged in get all customers and save to storage
        if(sessionStorage.getItem('timesLoaded') == 0) {
          this.$router.push('HomePage'); //Move the user to the home page
        }
      } else { //Hide any buttons
        this.authenticated = false;
      }
    },
    getDownloadURL(batchId, plantName) {
        firebase.storage().ref().child('batchImages/' + batchId + "-" + plantName).getDownloadURL().then( (url) => {
        document.querySelector('img').scr = url;
        this.imageURL = url;
      }).catch((error) => {
        this.imageLoaded = true;
        this.imgError = true;
        this.err = error;
        console.log(error);
      });
    },
    imageFinishedLoading() {
      console.log("loaded")
      this.imageLoaded = true;
    },
    reloadBatches() {
      sessionStorage.removeItem('batchInMemory');
      sessionStorage.removeItem('batchList');
      sessionStorage.removeItem('filterValue');
      location.reload();
    },
    pageLoadCounter() {
      //If counter hasnt started and the user is not logged in
      if(sessionStorage.getItem('timesLoaded') === null) {
        let counter = 0; 
        sessionStorage.setItem('timesLoaded', counter); //set a counter and add it to storage
      } else if (sessionStorage.getItem('timesLoaded') < 4) { 
        let counter = sessionStorage.getItem('timesLoaded'); //Increase the counter each time the page is reloaded
        counter++;
        sessionStorage.setItem('timesLoaded', counter);
      } else { //Once counter is above 4 remove the saved list so that it reloads the database
        sessionStorage.removeItem('batchInMemory');
        sessionStorage.removeItem('batchList');
        sessionStorage.removeItem('timesLoaded');
      }
    },
    setFilter() {
      this.filter = sessionStorage.getItem('filterValue');
      sessionStorage.removeItem('filerValue');
    },
    sendHome() {
      this.$router.push('HomePage');
    }, 
    addNewBatch() {
      this.$router.push('newBatch');
    }, 
    login() {
      this.$router.push('Login');
    },
    contactPage() {
      this.$router.push('ContactPage');
    },
    quote() {
      this.$router.push('QuoteNavigation');
    },
    pricing() {
      this.$router.push('Pricing');
    },
    admin() {
      this.$router.push('Admin');
    },
    signOut() {
			firebase.auth().signOut().then(() => {
        localStorage.removeItem("logged");
        sessionStorage.removeItem('mainLocations');
        this.authenticated = false
		  });
		} 
  },
  created() {    
    this.pageLoadCounter();
    this.setFilter();
    this.retrieveData(); //On webpage load all batches then save into browser storage 
  },  
  mounted() {
    this.hasUserAuth();
  }
}
</script>

<style scoped>

  .scrollable {
    vertical-align: top;
    width: 100%;
    height: -webkit-fill-available;
  }

  .modal-lg {
    height: 50vh !important;
  }

  .modal-content {
    height: 50vh;
  }

  .loader {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #61dd27; /* Green */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
    position: absolute;
    left: 50%;
    top: 50%; /* Needs to be changed so that its centered on mobile devices */  
    right: 50%;
  }

	.table-div {
		float: left;
    max-height: 85vh;
    /* max-width: 95vh; */
		width: 100%;
		overflow: auto;
    /* overflow-y: scroll; */
    -webkit-overflow-scrolling: touch;
	}

  .b-table[aria-busy="true"] {
  content: '';
}

body.modal-open {
    position: fixed;
    overflow: hidden;
    left:0;
    right:0;
}
.modal{
    -webkit-overflow-scrolling: auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media only screen and (max-width : 768px) {
  .loader {
      left: 45%;  
      top: 50%;
      right: 55%;
  }

	.table-div {
    max-height: 75vh;
		/* overflow: auto; */
    -webkit-overflow-scrolling: touch;
	}
}

@media only screen and (max-width : 568px) {
.loader {
    left: 45%;  
    top: 60%;
    right: 55%;
}
}



</style>
