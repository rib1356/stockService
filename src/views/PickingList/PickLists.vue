<template>
    <div>
      <quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
      <div class="left-div">
        <b-button @click="showCollapse = !showCollapse"
                :class="showCollapse ? 'collapsed' : null"
                style="margin-bottom: 0;"
                block
                variant="light"
                aria-controls="collapse"
                :aria-expanded="showCollapse ? 'true' : 'false'">
          <p v-if="showCollapse">Hide Filters<i class="fas fa-minus plus"></i></p>
          <p v-else>Show Filters<i class="fas fa-plus plus"></i></p>
        </b-button>
      <!-- Collapsible area to show the filters for the table -->
        <b-collapse v-model="showCollapse" class="input-pad" id="collapse">
          <b-input-group class="input-filter" >
            <b-form-input v-model="filter" placeholder="Type to Search"/>
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
              </b-input-group-append>
          </b-input-group>
          <b-input-group class="input-filter">
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">Choose Sort Option</option>
            </b-form-select>
            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
          <datepicker placeholder="Select Date"
                      :format="customFormatter"
                      @selected="setFilter"
                      @cleared="clearDate"
                      monday-first
                      clear-button
                      bootstrap-styling
                      ></datepicker>       
        </b-collapse>
        <br>
        <h5>Key</h5>
        <p style="background-color: #c3e6cb;">Exact Date</p>
        <p style="background-color: #ffeeba;">Estimated Date</p>
        <p style="background-color: #c3e6cb;">Entire Row = Picklist Delivered</p>

      </div>
      <div class="right-div">
        <b-table show-empty
                stacked="sm"
                :items="picklists"
                :fields="fields"
                :filter="filter"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                class="table" 
                outlined
                >
            <div slot="empty">
              <strong>Loading picklists...</strong>
            </div>
            <template slot="actions" slot-scope="row" class="actions">
              <router-link :to="{name: 'PickListDetail', params: { pickListDetail: row.item } }">
                <i class="far fa-edit fa-lg" v-b-tooltip.hover title="View/Edit Picklist" style="color:green"></i>
              </router-link>
              <i class="fas fa-trash-alt fa-lg" v-b-tooltip.hover title="Delete PickList" style="color:red" @click.stop="deletePickList(row.item)"></i>

              <router-link v-if="row.item.state == 'Allocated' || row.item.state == 'Partially Picked' " :to="{name: 'PlantPicking', params: { pickListDetail: row.item } }">
                <i class="fas fa-tree fa-lg icon-tick"  v-b-tooltip.hover title="Pick Plants"></i>
              </router-link>
              <i class="fas fa-file-signature fa-lg icon-tick-delivery" v-else-if="row.item.state != 'Allocated'" v-b-tooltip.hover title="Create Delivery" @click.stop=""></i>
              <i class="fas fa-file-invoice fa-lg icon-tick-delivery" v-if="row.item.itemsToPick == row.item.quantityPicked" v-b-tooltip.hover title="Create Invoice" @click.stop=""></i>
          </template> 
        </b-table>
      </div>
    </div>
</template>

<script>
import moment from 'moment'
import QuoteNavbar from '@/components/QuoteNavbar.vue'
import Datepicker from 'vuejs-datepicker';
  export default {
    components: {
      QuoteNavbar,
      Datepicker,
  	},
    name: 'PickLists',
    computed: {
      sortOptions () {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => { return { text: f.label, value: f.key } })
      },
    },
    data(){
      return {
        pageName: "All PickLists",
        picklists: [],
        fields: [
        { key: 'pickListId', label: 'PickList Id', sortable: true},
        { key: 'customerName', label: 'Customer Name', sortable: true},
        { key: 'dispatchDate', label: 'Dispatch Date'},
        { key: 'deliveryNeeded', label: 'Delivery Needed', sortable: true},
        { key: 'deliveryAddress', label: 'Delivery Address'},
        { key: 'state', label: 'State' },
        { key: 'comment', label: 'Comment'},
        { key: 'itemsToPick', label: 'Quantity To Pick', sortable: true},
        { key: 'quantityPicked', label: 'Quantity Picked', sortable: true},
        { key: 'actions', label: 'Actions', thClass: 'actions', class: 'actions', style: "width: 10%;"},
        ],
        showCollapse: true,
        filter: null,
        sortBy: "pickListId",
        sortDesc: false,
        sortSearch: false,
        sortDirection: 'asc',
      }
    },
    methods: {
      customFormatter(date) { //Return the correct format so that the table dates can be filtered
        return moment(new Date(date)).format('D/M/YYYY');
      },
      setFilter(date) {
        this.filter = this.customFormatter(date)
      },
      clearDate(){ //When the clear button is pressed completely clear the filters
        this.filter = ''
      },
      getAllPicklists() {
        this.axios.get('https://ahillsquoteservice.azurewebsites.net/api/picklist/all')
        .then((response) => {
          this.changeData(response.data);
        })
        .catch((error) => {
            alert("Error getting current picklists: " + error);
        });
      },
      changeData(response) {
        response.forEach(element => {
          // var delivNeeded;
          var currentState;
          var dipatchDateVariant;
          var delivNeeded = element.DeliveryNeeded ? "Yes" : "No"; //DeliveryNeeded True=Yes False=No
          if(element.IsPicked == true && element.IsAllocated == false && element.IsDelivered == false) {
            currentState = "All Picked";
          } else if(element.IsPicked == false && element.IsAllocated == false && element.IsDelivered == false) {
            currentState = "Partially Picked"
          } else if(element.IsAllocated == true && element.IsPicked == false && element.IsDelivered == false) {
            currentState = "Allocated";
          } else if(element.IsDelivered == true && element.IsPicked == false && element.IsAllocated == false) {
            currentState = "Delivered";
          } else {
            currentState = "Unknown State";
          }

          if(element.EstimatedDelivery == true) {
            dipatchDateVariant = 'warning';
          } else {
            dipatchDateVariant = 'success';
          }

          if(element.Active == true) {
            this.picklists.push({
            "pickListId": element.PicklistId,
            "customerName": element.CustomerName,
            "dispatchDate": this.convertDate(element.DispatchDate),
            "deliveryNeeded": delivNeeded,
            "deliveryAddress": element.DeliveryAddress,
            "state": currentState,
            "comment": element.Comment,
            "itemsToPick": element.PickListItemQty,
            "quantityPicked": element.TotalAmountPicked,
            "quoteId": element.QuoteId,
            "estDeliv": element.EstimatedDelivery,
            "_cellVariants": { dispatchDate: dipatchDateVariant},
            });
          }
        });
      },
      deletePickList(row) {
        console.log(row);
        if(confirm("Delete PickList?")) { //Bring up confirm dialog before deleting
          this.axios.put("https://ahillsquoteservice.azurewebsites.net/api/picklist/delete?id=" + row.pickListId)
            .then((response) => {
              console.log(response);
              alert("PickList Deleted");
              location.reload();
            })
            .catch((error) => {
              alert(error);
          });
        } else {
          //do nothing?
        }
      },
      convertDate(dateString){ //Will change the date from "yyyy-MM-dd" to = "dd/MM/yyyy"
        var p = dateString.split(/\D/g)
        return [p[2],p[1],p[0] ].join("/")
      },
    },
    mounted() {
      this.getAllPicklists();
    }      
  }
</script>

<style scoped>
@import "https://use.fontawesome.com/releases/v5.7.2/css/all.css";
  .navbar-custom {
		background-color: #0f6368;
	}

  .icon-tick {
    color: #0f6368;
    margin-left: 2px;
  }

  .icon-tick-delivery {
    color: rebeccapurple;
    margin-left: 2px;
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
  
  .actions {
    width: 20% !important; 
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