<template>
  <div>
    <pick-list-info class="info"></pick-list-info>
    Hello: {{pickListInfo}}
  </div>
</template>

<script>
import PickListInfo from '@/views/PickingList/PickListComponents/PickListInfo.vue'
	name: 'PlantAllocation'
  export default {
    components: {
      PickListInfo,
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
}

</style>