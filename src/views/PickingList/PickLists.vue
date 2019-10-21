<template>
    <div>
      <quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
      <b-table show-empty
              stacked="sm"
              :items="picklists"
              :fields="fields"
              class="table" 
              outlined
              fixed
              >
          <div slot="empty">
            <strong>Loading picklists...</strong>
          </div>
          <template slot="actions" slot-scope="row">
            <router-link :to="{name: 'PickListDetail', params: { pickListDetail: row.item } }">
              <i class="far fa-edit fa-lg" v-b-tooltip.hover title="View/Edit Picklist" style="color:green"></i>
            </router-link>
            <i class="fas fa-trash-alt fa-lg" v-b-tooltip.hover title="Delete PickList" style="color:red" @click.stop="deletePickList(row.item)"></i>
            <i class="fas fa-check fa-lg icon-tick" v-b-tooltip.hover title="Convert to Delivery" @click.stop=""></i>
        </template> 
      </b-table>
    </div>
</template>

<script>
import QuoteNavbar from '@/components/QuoteNavbar.vue'
  export default {
    components: {
		  QuoteNavbar,
  	},
    name: 'PickLists',
    data(){
      return {
        pageName: "All PickLists",
        picklists: [],
        fields: [
        { key: 'pickListId', label: 'PickList Id', sortable: true},
        { key: 'quoteId', label: 'Quote Id', sortable: true},
        { key: 'dispatchDate', label: 'Dispatch Date'},
        { key: 'deliveryNeeded', label: 'Delivery Needed', sortable: true},
        { key: 'deliveryAddress', label: 'Delivery Address'},
        { key: 'state', label: 'State' },
        { key: 'comment', label: 'Comment'},
        { key: 'itemsToPick', label: 'Items To Pick', sortable: true},
        { key: 'actions', label: 'Actions' },
			],
      }
    },
    methods: {
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
          var delivNeeded = element.DeliveryNeeded ? "Yes" : "No"; //DeliveryNeeded True=Yes False=No
          this.picklists.push({
          "pickListId": element.PicklistId,
          "quoteId": element.QuoteId,
          "dispatchDate": this.convertDate(element.DispatchDate),
          "deliveryNeeded": delivNeeded,
          "deliveryAddress": element.DeliveryAddress,
          "state": element.IsPicked,
          "comment": element.Comment,
          "itemsToPick": element.PickListItemQty,
          });
        });
      },
      deletePickList(row) {
        console.log(row);
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

</style>