<template>
  <div>
    <p>{{msg}}</p>
    <router-link to="/ExistingQuotes" tag="button">Existing Quotes</router-link>
    <router-link to="/CustomerInformation" tag="button">Create New Quote</router-link>
    <router-link to="/StockTable" tag="button">Back to stock table</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'QuoteNavigation',
  data () {
    return {
      msg: 'Quote Navigation Page'
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
