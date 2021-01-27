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
        
        <!-- <h5>Key</h5>
        <p style="background-color: #c3e6cb;">All Picked / Delivered</p>
        <p style="background-color: #ffeeba;">Items left to be picked</p>
        <p style="background-color: #f5c6cb;">Nothing picked</p> -->

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
                responsive
                >
            <div slot="empty">
              <strong>Loading picklists...</strong>
            </div>
            <template slot="actions" slot-scope="row" class="actions">
              <div class="row">
                <div class="col-md-6 col-lg-6">
                  <router-link :to="{name: 'PickListDetail', params: { pickListDetail: row.item } }">
                    <b-button type="button" class="btn btn-success action-btn"><i class="far fa-edit fa-lg" v-b-tooltip.hover title="View/Edit Picklist" style="color:black"></i></b-button>
                  </router-link>
                </div>
                <div class="col-md-6 col-lg-6">
                  <b-button type="button" class="btn btn-danger action-btn" @click.stop="deletePickList(row.item)"><i class="fas fa-trash-alt fa-lg" v-b-tooltip.hover title="Delete PickList" style="color:black"></i></b-button>
                </div>
              </div>
              <div class="row" style="margin-top:5px;">
                <div class="col-md-6 col-lg-6">
                    <Delivery ref="delivery" v-bind:rowInfo='row.item'></Delivery>
                </div>
                <div class="col-md-6 col-lg-6">
                   <Invoice ref="invoice" v-bind:rowInfo='row.item'></Invoice>
                </div>
                <div class="col-md-12 col-lg-12" v-if="row.item.quantityPicked < row.item.itemsToPick">
                    <router-link :to="{name: 'PlantPicking', params: { pickListDetail: row.item } }">
                      <b-button type="button" class="btn btn-info action-btn"><i class="fas fa-tree fa-lg icon-tick" style="color:black;"  v-b-tooltip.hover title="Pick Plants"></i></b-button>
                    </router-link>
                </div>
              </div>
          </template> 
        </b-table>
      </div>
    </div>
</template>

<script>
import moment from 'moment'
import QuoteNavbar from '@/components/QuoteNavbar.vue'
import Datepicker from 'vuejs-datepicker';
import Delivery from '@/views/PickingList/PDFs/Delivery.vue'
import Invoice from '@/views/PickingList/PDFs/Invoice.vue'
  export default {
    components: {
      QuoteNavbar,
      Datepicker,
      Delivery,
      Invoice,
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
        { key: 'salesOrderId', label: 'Sales Order Id', sortable: true},
        { key: 'customerName', label: 'Customer Name', sortable: true},
        { key: 'dispatchDate', label: 'Dispatch Date'},
        { key: 'deliveryNeeded', label: 'Delivery Needed', sortable: true},
        { key: 'deliveryAddress', label: 'Delivery Address'},
        { key: 'state', label: 'State' },
        { key: 'comment', label: 'Comment'},
        { key: 'itemsToPick', label: 'Quantity To Pick', sortable: true},
        { key: 'quantityPicked', label: 'Quantity Picked', sortable: true},
        { key: 'actions', label: 'Actions', thClass: 'actions', class: 'actions', style: "width: 30%;"},
        ],
        showCollapse: false,
        filter: null,
        sortBy: "pickListId",
        sortDesc: true,
        sortSearch: false,
        sortDirection: 'desc',
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
          var allDispatchedVarient;
          var delivNeeded = element.DeliveryNeeded ? "Yes" : "No"; //DeliveryNeeded True=Yes False=No

          if (element.PickListItemQty == element.TotalAmountPicked || element.PickListItemQty < element.TotalAmountPicked)
          {
            currentState = "All Picked";
            allDispatchedVarient = 'success'; 
          } else if (element.TotalAmountPicked > 0 && element.TotalAmountPicked < element.PickListItemQty)
          {
            currentState = "Partially Picked";
            allDispatchedVarient = 'warning'; 
          } else if (element.PickListItemQty == element.TotalAmountPicked && element.IsDelivered == true)
          {
            currentState = "Delivered";
            allDispatchedVarient = 'success'; 
          } else {
            currentState = "None Picked";
            allDispatchedVarient = 'danger'; 
          }
          
          // if(element.IsPicked == true && element.IsAllocated == false && element.IsDelivered == false) {
            
          // } else if(element.IsPicked == false && element.IsAllocated == false && element.IsDelivered == false) {
          //   currentState = "Partially Picked"

          // } else if(element.IsAllocated == true && element.IsPicked == false && element.IsDelivered == false) {
          //   currentState = "Allocated";
          // } else if(element.IsDelivered == true && element.IsPicked == false && element.IsAllocated == false) {
          //   currentState = "Delivered";
          // } else {
          //   currentState = "Unknown State";
          // }

          var datestuff = "";
          if(element.EstimatedDelivery == true) {
            datestuff = 'Estimated: ';
          } else {
            datestuff = 'Exact: ';
          }

          if(element.Active == true) {
            this.picklists.push({
            "pickListId": element.PicklistId,
            "salesOrderId" : element.QuoteId,
            "customerName": element.CustomerName,
            "dispatchDate": datestuff + this.convertDate(element.DispatchDate),
            "deliveryNeeded": delivNeeded,
            "deliveryAddress": element.DeliveryAddress,
            "state": currentState,
            "comment": element.Comment,
            "itemsToPick": element.PickListItemQty,
            "quantityPicked": element.TotalAmountPicked,
            "quoteId": element.QuoteId,
            "estDeliv": element.EstimatedDelivery,
            //"_cellVariants": { dispatchDate: dipatchDateVariant},
            "_rowVariant": allDispatchedVarient,
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
      createDeliveryNote() {
        this.$refs.delivery.createDeliveryPDF();
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

  .left-div {
    padding: 5px;
		position: relative;
		width: 100%;
	}

	.right-div {
    width: 100%;
    padding: 5px;
    position: relative;
    overflow-x: none;
    -webkit-overflow-scrolling: touch;
	}

	/* .left-div
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
	} */

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