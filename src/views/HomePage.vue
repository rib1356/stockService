<template>
  <div>
    <p>A Hills Nursery Management</p>
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
