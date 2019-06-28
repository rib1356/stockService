<template>
  <!--------------------------------------------------------------------------- 
    Page not is use. Delete?
   --------------------------------------------------------------------------->
  <div>
    <p>{{msg}}</p>
    <router-link to="/ExistingQuotes" class="my-nav">
      <b-button variant="outline-dark" class="my-btn existing-btn">Existing Quotes</b-button>
    </router-link>
    <router-link to="/CustomerInformation" class="my-nav">
    <b-button variant="outline-dark" class="my-btn create-btn">Create New Quote</b-button>
    </router-link>
    <router-link to="/StockTable" class="my-nav">
    <b-button variant="danger" class="my-btn">Back to Stock Table</b-button>
    </router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'QuoteNavigation',
  data () {
    return {
      msg: 'Quote Navigation Page',      
    }
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .my-nav{
    display: block;
    margin-bottom: 10px;
    text-align: center;
    /* width: 20%; */
  }

  .my-btn {
    width: 15%;
    height: 50px;
  }

  .existing-btn {
    background-color: #49aa09b0;
    border-color: #49aa09b0;
    color:black;
  }

  .create-btn {
    background-color: #2a6105;
    border-color: #2a6105;
    color:black;
  }

	@media only screen and (max-width : 768px) {
    .my-btn {
    width: 85%;
    }
  }
 
</style>
