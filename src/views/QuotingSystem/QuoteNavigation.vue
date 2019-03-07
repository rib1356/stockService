<template>
  <div>
    <p>{{msg}}</p>
    <router-link to="/ExistingQuotes" class="my-nav">
      <b-button variant="outline-primary" class="my-btn">Existing Quotes</b-button>
    </router-link>
    <router-link to="/CustomerInformation" class="my-nav">
    <b-button variant="outline-primary" class="my-btn">Create New Quote</b-button>
    </router-link>
    <router-link to="/StockTable" class="my-nav">
    <b-button variant="outline-danger" class="my-btn">Back to Stock Table</b-button>
    </router-link>
    <router-view></router-view>
    <!-- {{testObj}} -->
    <!-- <button @click="sendObj">Click me to send object</button> -->
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
  }

  .my-btn {
    width: 15%;
    height: 50px;
  }

	@media only screen and (max-width : 768px) {
    .my-btn {
    width: 80%;
    }
  }
 
</style>
