<template>
  <b-container fluid>
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
             :items="items"
             :fields="fields"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             class="table"    
             >
      <template slot="plantName" slot-scope="row">{{row.value.genera}} {{row.value.species}} {{row.value.variety}}</template>
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
const items = [
  { plantName: { genera: 'ACER', species: 'Palmatum', variety: 'Sango-kaku' }, location: 'R2', quantity: 40, formSize: '6-8 C5' },
  { plantName: { genera: 'ASPLENIUM', species: 'Scolopendium', variety: '' }, location: 'W2', quantity: 33, formSize: '20-30 C2' },
  { plantName: { genera: 'BERGENIA', species: 'Silver', variety: 'Light' }, location: 'E5', quantity: 8, formSize: '6-8 C5' },
  { plantName: { genera: 'CHAENOMELES', species: 'Geisha', variety: 'Girl' }, location: 'E6', quantity: 32, formSize: '30-40 C3' },
  { plantName: { genera: 'CLEMATIS', species: 'Alpina', variety: 'Helsingourg' }, location: 'W10', quantity: 27, formSize: '6-8 C5' },
  { plantName: { genera: 'CORYLUS', species: 'Cortorta', variety: '' }, location: 'MBS4', quantity: 22, formSize: '6-8 C5' },
  { plantName: { genera: 'DRYOPERTIS', species: 'Felix-mas', variety: '' }, location: 'MBW7', quantity: 12, formSize: '6-8 C5' },
  { plantName: { genera: 'HELLEBOROUS', species: 'Orirntalis', variety: 'Mixed' }, location: 'W30', quantity: 23, formSize: '6-8 C5' },
  { plantName: { genera: 'HEUCHERA', species: 'Petite', variety: 'Pearl Fairy' }, location: 'W33', quantity: 38, formSize: '6-8 C5' },
  { plantName: { genera: 'LIROPE', species: 'Muscari', variety: 'Big Blue' }, location: 'MBW2', quantity: 6, formSize: '6-8 C5' },
  { plantName: { genera: 'LAMIUM', species: 'Maculata', variety: 'White Nancy' }, location: 'R4', quantity: 5, formSize: '6-8 C5' },
  { plantName: { genera: 'MISCANTHUS', species: 'Sinensis', variety: 'Zebius' }, location: 'E23', quantity: 8, formSize: '6-8 C5' },
  { plantName: { genera: 'LAMIUM', species: 'Maculata', variety: 'White Nancy' }, location: 'R4', quantity: 5, formSize: '6-8 C5' },
  { plantName: { genera: 'MISCANTHUS', species: '', variety: 'Zebius' }, location: 'E23', quantity: 8, formSize: '6-8 C5' },
  { plantName: { genera: 'LAMIUM', species: 'Maculata', variety: 'White Nancy' }, location: 'R4', quantity: 5, formSize: '6-8 C5' },
]

export default {
  name: 'StockTable',
  data () {
    return {
      items: items,
      fields: [
        { key: 'plantName', label: 'Plant Full Name', sortable: true, sortDirection: 'desc' },
        { key: 'location', label: 'Location', sortable: true, 'class': 'text-center' },
        { key: 'quantity', label: 'Quantity', sortable: true },
        { key: 'actions', label: 'Actions' }
      ],
      totalRows: items.length,
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: { title: '', content: '' }
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
      this.modalInfo.title = `Name: ${item.plantName.genera} ${item.plantName.species} ${item.plantName.variety}`
      this.modalInfo.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    resetModal() {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    },
    selectBatch(item, index) {
      var selectedBatch = new this.selectedBatchInformation();
      selectedBatch.genera = item.plantName.genera;
      selectedBatch.species = item.plantName.species;
      selectedBatch.variety = item.plantName.variety;
      selectedBatch.location = item.location;
      selectedBatch.quantity = item.quantity;
      selectedBatch.formSize = item.formSize;
      selectedBatch.batchNo = index;

      console.log("Batch object saved = " + selectedBatch);
      sessionStorage.setItem('selectedBatchInformation', JSON.stringify(selectedBatch));
      this.$router.push('BatchInformation');
    },
    selectedBatchInformation(genera, species, variety, location, quantity, formSize, batchNo){
      var genera, species, variety, loction, quantity, formSize, batchNo;
    }, 
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

/* // th {
//   position: fixed;
// } */

/* body {
  padding-top: 50px;
  position: fixed;
  top: 0; bottom: 0; left: 0; right: 0;
} */

</style>
