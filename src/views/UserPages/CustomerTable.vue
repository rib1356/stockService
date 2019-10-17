<template>
  <div>
    <router-link :to="{name: 'HomePage'}">
        <b-button class="myBtn" variant="primary">Home</b-button>
		</router-link>
    <div class="filter-div">
    <b-row>
      <b-col md="12" class="my-1">
        <!-- <b-form-group horizontal label="Filter" class="mb-0"> -->
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        <!-- </b-form-group> -->
      </b-col>
    </b-row>
    </div>
    <b-table  show-empty
              stacked="sm"
              :items="sageCustomers"
              :fields="fields"
              :filter="filter"
              class="table" 
              outlined   
              >
    </b-table>          
  </div>
</template>

<script>
  export default {
    name: 'CustomerTable',
    data() {
      return {
        sageCustomers: [],
        fields: [
        { key: 'customerRef', label: 'Customer Ref'},
        { key: 'customerName', label: 'Customer Name'},
        { key: 'customerAddress', label: 'Customer Address'},
        { key: 'customerTel', label: 'Customer Tel'},
        { key: 'customerTel2', label: 'Customer Tel 2'},
        { key: 'customerEmail', label: 'Customer Email'},
      ],
      filter: "",
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
      getCustomers() {
        if(sessionStorage.getItem('customers') == null) {
          console.log("getting customers from db")
          this.getAllCustomers();
        } else {
          let cust = JSON.parse(sessionStorage.getItem('customers'));
          this.sageCustomers = cust.filter((obj) => obj.sageCustomer === true);
          console.log(this.sageCustomers);
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
            "customerTel2": data[i].CustomerTel2,
          });
        }
        this.sageCustomers = cust.filter((obj) => obj.sageCustomer === true);
        console.log(this.sageCustomers);
      },
    },
    mounted() {
      this.getCustomers();
    }
  }
</script>

<style>

</style>