<template>
    <div>
      <quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
      <div >
        <b-input-group class="input-filter" >
            <b-form-input v-model="filter" placeholder="Type to Search"/>
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
              </b-input-group-append>
          </b-input-group>
      </div>
      <div >
        <b-table show-empty
              stacked="md"
              :items="pickListDetailItems"
              :fields="fields"
              :filter="filter"
              outlined       
              >
        </b-table>
      </div>
    </div>
</template>

<script>
import QuoteNavbar from '@/components/QuoteNavbar.vue'
  export default {
    components: {
		  QuoteNavbar,
  	},
      data() {
        return{
          pageName: "PickList Detail",
          pickListDetail: '',
          pickListDetailItems: [],
          filter: '',
          fields: [
          { key: 'plantName', label: 'Plant Name', sortable: true},
          { key: 'formSize', label: 'Form Size'},
          { key: 'location', label: 'Location'},
          { key: 'quantityToPick', label: 'Quantity To Pick', sortable: true},
          { key: 'isSubbed', label: 'Is subbed'},
          { key: 'subbedFor', label: 'Subbed For' }
        ],
        }
      },
      methods: {
        getPickListDetail() {
          this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/picklist/detail?id=' + this.pickListDetail.pickListId)
          .then((response) => {
            this.changeData(response.data.PickListPlants);
          })
          .catch((error) => {
              alert("Error getting current picklists: " + error);
          });
        },
        changeData(items) {
          items.forEach(item => {
            this.pickListDetailItems.push({
              "plantName": item.PlantName,
              "formSize": item.FormSize,
              "location": item.BatchLocation,
              "quantityToPick": item.QuantityToPick,
              "isSubbed": item.IsSubbed,
              "subbedFor": item.SubbedFor,
            });
          });
        }
      },
      mounted() {
        this.pickListDetail = this.$route.params.pickListDetail;
        this.getPickListDetail();
      },
    }
</script>

<style scoped>

  .navbar-custom {
		background-color: #0f6368;
	}

  	.left-div
	{
    width: 20%;
		height: 100%; 
		float:left;
	}
  
	.right-div {
		float: left;
    height: fit-content;
    max-height: 90vh;
		width: 80%;
		overflow: auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
	}

  .plus{
    float: right;
    text-align: center;
  }

  .input-filter{
    margin-bottom: 5px;
  }

  .input-pad {
    margin-top: 5px;
  }

  p {
    margin-bottom: 0;
  }

</style>