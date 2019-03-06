<template>
  <div>
    <p>{{msg}}</p>
    <router-link to="/ExistingQuotes" class="my-nav">
      <b-button variant="outline-primary">Existing Quotes</b-button>
    </router-link>
    <router-link to="/CustomerInformation" class="my-nav">
    <b-button variant="outline-primary">Create New Quote</b-button>
    </router-link>
    <router-link to="/StockTable" class="my-nav">
    <b-button variant="outline-danger">Back to Stock Table</b-button>
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
    margin-bottom: 5px;
    text-align: center;
  }
</style>
