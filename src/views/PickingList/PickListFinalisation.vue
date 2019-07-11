<template>
  <div>
    <p v-if="itemsToPick.length == 0">Theres nothing here</p>
    <ul v-for="items in itemsToPick" v-bind:key="items.batchId">
      <li>
        Name: {{items.plantName}} | FormSize: {{items.formSize}} | 
        Price: {{items.batchPrice}} | Location: {{items.location}} | <b>Amount To Pick: {{items.amountNeeded}}</b>
      </li>
    </ul>
    <!-- Current Items to Pick: {{itemsToPick}} -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        itemsToPick: '',
      }
    },
    created() {
      this.itemsToPick = this.$route.params.itemsToPick
    }
  }
</script>

<style scoped>

</style>