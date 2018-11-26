<template>
  <b-container fluid>
    <p class="loader" v-if="loading"></p>
    <p>{{status}}</p>
    <router-link to="/StartPage" tag="button">Home</router-link>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Sort" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">-- none --</option>
            </b-form-select>
            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
      <!-- <b-col md="6" class="my-1">
        <b-form-group horizontal label="Sort direction" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortDirection" slot="append">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
              <option value="last">Last</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col> -->
    </b-row>
    
    <!-- Main table element -->
    <div>
    <b-table show-empty
             stacked="md"
             :items="plantData"
             :fields="fields"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             class="table"    
             >
      <!-- <template slot="plantName" slot-scope="row">{{row.value.plantName}} </template> -->
      <!-- <template slot="quantity" slot-scope="row">{{row.value === 0, 'No'}}</template> -->
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
          Info modal
        </b-button>
        <b-button size="sm" @click.stop="selectBatch(row.item, row.index)">
          Select Batch
        </b-button>
      </template>
    </b-table>

      <!-- Info modal -->
     <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
        <pre>{{ modalInfo.content }}</pre>
      </b-modal>
    </div>
  </b-container>
</template>

<script>

export default {
  name: 'StockTable',
  data () {
    return {
      fields: [
        { key: 'plantName', label: 'Plant Full Name', sortable: true, sortDirection: 'desc' },
        { key: 'location', label: 'Location', sortable: true, 'class': 'text-center' },
        { key: 'quantity', label: 'Quantity', sortable: true },
        { key: 'actions', label: 'Actions' }
      ],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: { title: '', content: '' },
      status: '',
      plantData: [],
      loading: true,
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    }
  },
  methods: {
    info(item, index, button) {
      this.modalInfo.title = `Name: ${item.plantName}`
      // this.modalInfo.title = `Name: ${item.plantName.genera} ${item.plantName.species} ${item.plantName.variety}`
      this.modalInfo.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    resetModal() {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    },
    selectBatch(item, index) { //Get the selected row
      var selectedBatch = new this.selectedBatchInformation(); //Create a new object and assign the row values
      selectedBatch.plantName = item.plantName;
      selectedBatch.location = item.location;
      selectedBatch.quantity = item.quantity;
      selectedBatch.formSize = item.formSize;
      selectedBatch.batchNo = index;

      sessionStorage.setItem('selectedBatchInformation', JSON.stringify(selectedBatch)); //Save the current row to session storage to access data
      this.$router.push('BatchInformation'); //Move to next page
    },
    selectedBatchInformation(plantName, location, quantity, formSize, batchNo){
      var plantName, loction, quantity, formSize, batchNo;
    },
    retrieveData () {
      this.status = "loading stock information..."
      this.$http.get('https://ahillsbatchservice.azurewebsites.net/api/Batches')
        .then((response) => {
          this.changeData(response.data);
          this.status = 'Stock Information loaded'
          this.loading = false; //Hide the spinner once data is loaded
      })
        .catch((error) => {
          this.status = error;
      });
    },
    changeData (response) {

      for(var i = 0; i < response.length; i++){ //Loop through the requested data and create an array of objects
        this.plantData.push({                  //This is then used to populate the data table
          "plantName": response[i].Name,
          "location": response[i].Location,
          "quantity": response[i].Quantity,
          "formSize": response[i].FormSize,
           });
      }
    } 
  },
  created() {
    this.retrieveData(); //On webpage load
  }
}
</script>

<style>

.scrollable {
  vertical-align: top;
  width: 100%;
  height: -webkit-fill-available;
}

/* /thead, tbody { display: block; } */

.loader {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #61dd27; /* Green */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
    position: absolute;
    left: 50%;
    top: 50%; /* Needs to be changed so that its centered on mobile devices */  
    right: 50%;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}


tbody {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

thead {
  width: 100%;
  vertical-align: top;
}

.b-table[aria-busy="true"] {
  content: 'nigguh';
}

/* // th {
//   position: fixed;
// } */

/* body {
  padding-top: 50px;
  position: fixed;
  top: 0; bottom: 0; left: 0; right: 0;
} */

</style>
