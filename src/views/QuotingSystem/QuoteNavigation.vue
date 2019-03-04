<template>
  <div>
    <p>{{msg}}</p>
    <router-link to="/ExistingQuotes" tag="button">Existing Quotes</router-link>
    <router-link to="/CustomerInformation" tag="button">Create New Quote</router-link>
    <router-link to="/StockTable" tag="button">Back to stock table</router-link>
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
      testObj: {
				CustomerRef: "T0001",
				TotalPrice: 1000,
				Date: "01/03/2019", //This will need to be a date object to be saved into the db?
				ExpiryDate: "30/03/2019",
				SiteRef: null,
				Active: true,
				QuoteDetails: [
					{PlantName: "TestName", FormSize: "TestForm", Comment: "TestComment", Price: 100, Quantity: 5},
					{PlantName: "TestName2", FormSize: "TestForm2", Comment: "TestComment2", Price: 100, Quantity: 5},
				]
      },
      
    }
  },
  methods: {
    sendObj() {
      console.log(this.testObj);
      // this.axios.post('http://localhost:61993/api/quote', 
      //   this.testObj
			// )
			// .then((response) => {
			// 	console.log(response);
			// })
			// .catch((error) => {
			// 	alert("Please check values before submitting")
			// 	console.log(error);
			// });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
