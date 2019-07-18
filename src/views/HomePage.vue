<template>
  <div>
    <div class="navigation">
      <h5>Choose a place to naviage within the system</h5>
      <router-link :to="{name: 'StockTable'}">
        <b-button class="myBtn" variant="primary">Stock Table</b-button>
			</router-link>
      <router-link :to="{name: 'CustomerInformation'}">
        <b-button class="myBtn q-btn" variant="success">Create New Quote</b-button>
      </router-link> 
      <router-link :to="{name: 'ExistingQuotes', params: { salesOrder: false } }"> <!-- PASS IN PARAMS TO DECIDE WHAT TO SHOW -->
        <b-button class="myBtn eq-btn" variant="success">View Existing Quotes</b-button>
      </router-link>
      <router-link :to="{name: 'ExistingQuotes', params: { salesOrder: true } }">
        <b-button class="myBtn so-btn" variant="secondary">View Existing Sales Orders</b-button>
      </router-link>
      <router-link :to="{name: 'PickList' }">
        <b-button class="myBtn p-btn" variant="secondary">View Picking Lists</b-button>
      </router-link>
      <router-link :to="{name: 'PricingSelection'}">
        <b-button class="myBtn misc-btn" variant="secondary">Pricing</b-button>
      </router-link>
      <router-link :to="{name: 'newBatch'}">
        <b-button class="myBtn misc-btn" variant="secondary">Add New Batch</b-button>
      </router-link>
      <router-link :to="{name: 'Admin'}">
        <b-button class="myBtn misc-btn" variant="secondary">Admin Page</b-button>
      </router-link>  
      <b-button class="myBtn misc-btn" variant="secondary" @click="reloadBatches">Refresh values</b-button>
      <export-excel 
          :data = "excelBatches"
          worksheet = "BatchList"
          name = "HillsStock">
          <b-button class="myBtn export-btn" variant="secondary">Export Batches</b-button>
      </export-excel>
    </div>
    <div class="dashboard">
      <h3>Dashboard</h3>
      <div class="grid-container">
        <div class="grid-item">
          <h4>Number of batches</h4>
          <p>{{batches}}</p>
        </div>
        <div class="grid-item">
          <h4>Number of Quotes</h4>
          <p>{{quotes}}</p>
        </div>
        <div class="grid-item">
          <h4>Number of Sales Orders</h4>
          <p>{{salesOrders}}</p>
        </div>  
        <div class="grid-item">
          <h4>Number of Customers</h4>
          <p>{{customers}}</p>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartPage',
  data () {
    return {
      batches: 'loading',
      quotes: 'loading',
      salesOrders: 'loading',
      customers: 'loading',
      batchData: [],
      excelBatches: [],
      blahsd: "blah"
    }
  },
  methods: {
    getNoBatches() {
      let b = JSON.parse(sessionStorage.getItem('batchList'))
      this.batches = b.length;
    },
    getQuotes() {
      this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/quote/all')
      .then((response) => {
        this.reduceQuotes(response.data);
      })
      .catch((error) => {
          this.quotes = 'Err getting quotes'
      });
    },
    reduceQuotes(quoteArray) {
      var reducedQuotes = quoteArray.filter((obj) => obj.Active === true); //Reduce the quotes to only the ones that are active (both Quotes and SalesOrder)
      this.salesOrders = reducedQuotes.filter((obj) => obj.SalesOrder === true).length; //Number of SalesOrders is where SalesOrder == true
      this.quotes = reducedQuotes.length - this.salesOrders;
    },
    reloadBatches() {
      sessionStorage.removeItem('batchInMemory');
      sessionStorage.removeItem('batchList');
      sessionStorage.removeItem('timesLoaded');
      sessionStorage.removeItem('customers');
      location.reload();
    },
    retrieveData (dbBatch) {
      this.axios.get('https://ahillsbatchservice.azurewebsites.net/api/Batches') //Call the database to retrieve the current batches
        .then((response) => {
          console.log(response);
          this.excelBatch(response.data); //Call this each time so the correct batch data can be export
          if(dbBatch) { //Only call this if the batch data needs to be saved into browser storage
            this.changeData(response.data);
          }
      }).catch((error) => {
          console.log(error);
      });
    },
    changeData (response) {
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
        if(response[i].Active === true) {        //Only get the batches that are active to not show deleted batches  
          this.batchData.push({                 //This is then pushed into an array and used to populate the data table
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
            "comment": response[i].Comment,
            "active": response[i].Active,
          });
        }
      }   
      // console.log("saved?");
      //Save the data into session storage
      sessionStorage.setItem('batchList', JSON.stringify(this.batchData));
      sessionStorage.setItem('batchInMemory', true);
      this.batches = this.batchData.length;
    },
    excelBatch(response) {
      console.log("here")
      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
        if(response[i].Active === true) {        //Only get the batches that are active to not show deleted batches  
          this.excelBatches.push({                 //This is then pushed into an array and used to populate the data table
            "plantName": response[i].Name,
            "formSize": response[i].FormSize,
            "location": response[i].Location,
            "quantity": response[i].Quantity,
            //"batchPrice": response[i].WholesalePrice, 
            "growingQuantity": response[i].GrowingQuantity,
            "allocatedQuantity": response[i].AllocatedQuantity,
            "dateStamp": response[i].DateStamp,
          });
        }
      }
    },
    getCustomers() {
      if(sessionStorage.getItem('customers') == null) {
        console.log("getting customers from db")
        this.getAllCustomers();
      } else {
        this.customers = JSON.parse(sessionStorage.getItem('customers')).length;
      }
    },
    getAllCustomers() { //Get all customers from webservice --Is called from hasUserAuth()--
			this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/customer/all')
				.then((response) => {
          this.parseCustomers(response.data);
				})
				.catch((error) => {
						alert("Error getting customers: " + error);
				});
		},
    parseCustomers(data) { //Push customers into an array of objects then save to local storage
    var cust = [];
			for(var i = 0; i < data.length; i++){
				cust.push({ //Create an array of objects
					"customerName": data[i].CustomerName,    //Data coming in is string so just assign values in object to be displayed
					"customerRef": data[i].CustomerReference,
					"customerTel": data[i].CustomerTel,
					"customerAddress": data[i].CustomerAddress,
          "customerEmail": data[i].CustomerEmail,
          "sageCustomer": data[i].SageCustomer,
				});
      }
      sessionStorage.setItem("customers", JSON.stringify(cust));
      this.customers = cust.length
		},
  },  
  mounted() {
    var bool;
    if(sessionStorage.getItem('batchList') == null) {
      console.log("getting data from db");
      bool = true;
      // this.retrieveData(pleb);
    } else {
      console.log("getting length from session");
      setTimeout(this.getNoBatches, 1500);
      bool = false;
    }
    this.retrieveData(bool);
    setTimeout(this.getCustomers,1500);
    setTimeout(this.getQuotes,1500);
    sessionStorage.setItem('timesLoaded', 0);
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.navigation
	{
    width: 20%;
		height: 100%; 
		float:left;
    background-color: lightslategray;
    color: black;
	}
  
  h3 {
    color: black;
  }
  
	.dashboard {
		float: left;
		width: 80%;
    background-color: lightslategray;
	}

  .grid-container {
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: lightslategray;
    margin-top: 20px;
    padding: 5px;
  }
  .grid-item {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 5px;
    font-size: 20px;
    text-align: center;
  }

  .myBtn{
    width: 100%;
    margin-bottom: 5px;
  }

  .q-btn {
    border-color: #15c015;
    background: #15c015;
  }

  .eq-btn {
    border-color: #0b720b;
    background: #0b720b;
  }

  .so-btn {
    border-color: #11979e;
    background: #11979e;
  }

  .p-btn {
    border-color: #0f6368;
    background: #0f6368;
  }

  .misc-btn{
    border-color: #B22222;
    background: #B22222;
  }

  .export-btn{
    border-color: lightblue;
    background: lightblue;
  }

  .misc-btn > :hover {
    background: blue;
  }

  @media only screen and (max-width : 768px) {

    .navigation {
      position: relative;
      width: 100%;
    }

    .dashboard{
      width: 100%;
      position: relative;
      /* visibility: hidden; */
    }

  }
</style>
