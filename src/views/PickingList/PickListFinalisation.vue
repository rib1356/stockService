<template>
  <div>
    <div class="info">
      <pick-list-info></pick-list-info>
      <hr>
      <p>Add Note to Picklist</p>
      <input type="text">
    </div>
    <div class="list">
      <b-table show-empty
             stacked="md"
             :items="itemsToPick"
             :fields="fields"   
             outlined       
             >
      </b-table>       
      <p v-if="itemsToPick.length == 0">Theres nothing here</p>
      <ul v-for="items in itemsToPick" v-bind:key="items.batchId">
        <li>
          Name: {{items.plantName}} | FormSize: {{items.formSize}} | 
          Price: {{items.batchPrice}} | Location: {{items.location}} | <b>Amount To Pick: {{items.amountNeeded}}</b>
        </li>
      </ul>
    </div>
    <!-- Current Items to Pick: {{itemsToPick}} -->
  </div>
</template>

<script>
import PickListInfo from '@/views/PickingList/PickListComponents/PickListInfo.vue'
  export default {
    components: {
      PickListInfo,     
    },
    data() {
      return {
        itemsToPick: '',
        fields: [
          { key: 'plantName', label: 'Plant Name', sortable: true},
          { key: 'formSize', label: 'Form Size'},
          { key: 'comment', label: 'Comment'},
          { key: 'batchPrice', label: 'Item Price', sortable: true},
          { key: 'location', label: 'Location', sortable: true},
          { key: 'amountNeeded', label: 'Amount to pick', sortable: true},
        ],
      }
    },
    created() {
      this.itemsToPick = this.$route.params.itemsToPick
      console.log(this.itemsToPick)
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