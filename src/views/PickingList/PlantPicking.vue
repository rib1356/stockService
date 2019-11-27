<template>
    <div>
      <quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
      <div class="left-div">
        <b-input-group class="input-filter" >
            <b-form-input v-model="filter" placeholder="Type to Search"/>
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
              </b-input-group-append>
          </b-input-group>
        <div style="margin-top:5px;">
          
          <router-link :to="{name: 'PickLists'}">
            <b-button variant="outline-danger" class="myBtn">Back To Picklists</b-button>
          </router-link>
          <br>
          <p>Pick these plants for delivery/invoicing</p>
          <b-button variant="outline-primary">Pick all plants on list</b-button>
          <b-button variant="outline-success" class="myBtn">Pick Plants</b-button>
          <!-- <b-button variant="outline-primary" class="myBtn" @click="createPDF">Create Picklist PDF</b-button> -->
        </div>
      </div>
      <div class="right-div">
        <b-table show-empty
              stacked="md"
              :items="pickListDetailItems"
              :fields="fields"
              :filter="filter"
              outlined       
              >
           <template slot="actions" slot-scope="row">
              <b-form-input placeholder="enter an amount picked" v-model="row.item.quantityPicked"></b-form-input>
          </template>      
        </b-table>
      </div>
    </div>
</template>

<script>
import QuoteNavbar from '@/components/QuoteNavbar.vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable';
  export default {
    components: {
		  QuoteNavbar,
  	},
      data() {
        return{
          pageName: "Pick plants on Picklist",
          pickListDetail: '',
          pickListDetailItems: [],
          filter: '',
          customerRef: '',
          customerTel: '',
          fields: [
          { key: 'plantName', label: 'Plant Name', sortable: true},
          { key: 'formSize', label: 'Form Size'},
          { key: 'location', label: 'Location'},
          { key: 'quantityToPick', label: 'Quantity To Pick', sortable: true},
          { key: 'isSubbed', label: 'Is subbed'},
          { key: 'subbedFor', label: 'Subbed For' },
          { key: 'actions', label: 'Picked'}
          ],
          showCollapse: true,
        }
      },
      methods: {
        getPickListDetail() {
          this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/picklist/detail?id=' + this.pickListDetail.pickListId)
          .then((response) => {
            this.changeData(response.data.PickListPlants);
            this.customerRef = response.data.CustomerRef;
            this.customerTel = response.data.CustomerTel;
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
              "quantityPicked": item.QuantityPicked,
              "isSubbed": item.IsSubbed,
              "subbedFor": item.SubbedFor,
            });
          });
        },
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
    width: 25%;
		height: 100%; 
		float:left;
	}
  
	.right-div {
		float: left;
    height: fit-content;
    max-height: 90vh;
		width: 75%;
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
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 0;
  }

  	@media only screen and (max-width : 768px) {

	.left-div {
		position: relative;
		width: 100%;
	}

	.right-div {
    max-height: 75vh;
		width: 100%;
		position: relative;
	}

  }

</style>