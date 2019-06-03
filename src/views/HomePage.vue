<template>
  <div>
    <p>A Hills Nursery Management</p>
    <div class="navigation">
      <h5>Choose a place to naviage within the system</h5>
      <router-link :to="{name: 'StockTable'}">
        <b-button class="myBtn" variant="outline-primary">Stock Table</b-button>
			</router-link>
      <router-link :to="{name: 'CustomerInformation'}">
        <b-button class="myBtn" variant="outline-success">Create New Quote</b-button>
      </router-link> 
      <router-link :to="{name: 'ExistingQuotes'}"> <!-- PASS IN PARAMS TO DECIDE WHAT TO SHOW -->
        <b-button class="myBtn" variant="outline-success">View Existing Quotes</b-button>
      </router-link>
      <router-link :to="{name: 'ExistingQuotes'}">
        <b-button class="myBtn" variant="outline-success">View Existing Sales Orders</b-button>
      </router-link>
      <router-link :to="{name: 'PricingSelection'}">
        <b-button class="myBtn" variant="outline-info">Pricing</b-button>
      </router-link>
      <router-link :to="{name: 'newBatch'}">
        <b-button class="myBtn" variant="outline-info">Add New Batch</b-button>
      </router-link>
      <router-link :to="{name: 'Admin'}">
        <b-button class="myBtn" variant="outline-info">Admin Page</b-button>
      </router-link>  
    </div>
    <div class="dashboard">
      <h5>Dashboard</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartPage',
  data () {
    return {

    }
  },
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
  
	.dashboard {
		float: left;
		width: 80%;
    background-color: lightslategray;
	}

  .myBtn{
    width: 100%;
    margin-bottom: 5px;
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
