<template>
    <div>
      <quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
      <b-table show-empty
              stacked="sm"
              :items="picklists"
              :fields="fields"
              class="table" 
              outlined   
              >
          <div slot="empty">
            <strong>Loading picklists...</strong>
          </div>
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
        { key: 'deliveryNeeded', label: 'Delivery Needed'},
        { key: 'deliveryAddress', label: 'Delivery Address'},
        { key: 'state', label: 'State' },
        { key: 'comment', label: 'Comment'},
        { key: 'itemsToPick', label: 'Items To Pick'},
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
          this.picklists.push({
          "pickListId": element.PicklistId,
          "quoteId": element.QuoteId,
          "dispatchDate": element.DispatchDate,
          "deliveryNeeded": element.DeliveryNeeded,
          "deliveryAddress": element.DeliveryAddress,
          "state": element.IsPicked,
          "comment": element.Comment,
          "itemsToPick": element.PickListItemQty,
          });
        });
      },
    },
    mounted() {
      this.getAllPicklists();
    }      
  }
</script>

<style scoped>

.navbar-custom {
			background-color: #0f6368;
	}

</style>