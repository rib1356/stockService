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
        <!-- <div class="grid-item">4</div>
        <div class="grid-item">5</div>
        <div class="grid-item">6</div>  
        <div class="grid-item">7</div>
        <div class="grid-item">8</div>
        <div class="grid-item">9</div>   -->
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
    loadItems() {
      
    }
  },
  mounted() {
    setTimeout(this.getNoBatches, 1500);
    setTimeout(this.getQuotes,1500);
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
    /* background-color: lightgreen; */
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
    padding: 10px;
  }
  .grid-item {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 10px;
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
    border-color: lightslategray;
    background: lightslategray;
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
