<template>
  <div>
    <pick-list-info class="info" v-bind:pickListInfo='pickListInfo'></pick-list-info>
    <pick-list-items class="list" v-bind:pickListInfo='pickListInfo'></pick-list-items>
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
        pickListInfo: '',

      }
    },
    mounted() {
      this.pickListInfo = JSON.parse(sessionStorage.getItem('pickListInfo'));
    }      
  }
</script>

<style scoped>

.info {
  width: 20%;
	height: 100%; 
	float:left;
  background-color: slategray;
  color: black;
}

.list {
	float: left;
  height: fit-content;
  max-height: 85vh;
	width: 80%;
  background-color:lightgray;
  color: black;
  -webkit-overflow-scrolling: touch;
}

</style>