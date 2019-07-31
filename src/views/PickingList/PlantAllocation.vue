<template>
  <div>
    <div class="info" >
    <pick-list-info v-bind:pickListInformation='pickListInformation'></pick-list-info>
    <router-link :to="{name: 'ExistingQuotes', params: { salesOrder: true } }">
      <b-button variant="outline-danger" class="myBtn">Cancel Allocation</b-button>
    </router-link>
    <router-link :to="{name: 'PickListFinalisation', params: { itemsToPick: this.items } }">
      <b-button variant="outline-primary" @click="tempSave" class="myBtn">Allocate Plants</b-button>
    </router-link>  
    </div>
    <pick-list-items class="list" v-bind:pickListInformation='pickListInformation' @getUsedBatches="putBatches"></pick-list-items>
  </div>
</template>

<script>
import PickListInfo from '@/views/PickingList/PickListComponents/PickListInfo.vue'
import PickListItems from '@/views/PickingList/PickListComponents/PickListItems.vue'
	name: 'PlantAllocation'
  export default {
    components: {
      PickListInfo,
      PickListItems,
    },
    data() {
      return {
        pickListInformation: '',
        items: '',
      }
    },
    methods: {
      //----------------------------------
      // Worth saving the picklist items and their amounts to session storage until they are saved to the database?
      //----------------------------------
      putBatches(batches) { //Items for the picklist are passed up through components to then be sent to the next page
        batches.forEach(element => {
          if(element.amountNeeded == 0) {  //Loop through the batches and remove any that have a picked quantity of 0 as they shouldnt be used
            var index = batches.indexOf(element);
            batches.splice(index, 1);
          }
        });
        this.items = batches;
      },
      tempSave() {
        sessionStorage.setItem('tempBatchSave', JSON.stringify(this.items));
        //Save the items to session storage so that if you want to go back you are able to get the original values
      }
    },
    mounted() {
      this.pickListInformation = JSON.parse(sessionStorage.getItem('pickListInfo'));
    }      
  }
</script>

<style scoped>

.info {
  width: 20%;
	height: 100%; 
	float:left;
  /* background-color: slategray; */
  text-align: center;
  color: black;
}

.myBtn
{
  width: 100%;
  float: left;
  margin-top: 5px;
  /* position: relative; */
  /* margin-top: 35px; */
}

.list {
	float: left;
  height: fit-content;
  max-height: 85vh;
	width: 80%;
  /* background-color:lightgray; */
  color: black;
  -webkit-overflow-scrolling: touch;
}

</style>