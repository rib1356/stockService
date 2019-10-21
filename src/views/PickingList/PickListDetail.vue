<template>
    <div>
      <quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
      <b-table show-empty
             stacked="md"
             :items="pickListDetailItems"
             :fields="fields"   
             outlined       
             >
      </b-table>
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

</style>