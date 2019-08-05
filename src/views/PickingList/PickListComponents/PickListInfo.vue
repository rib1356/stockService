<template>
  <div>
    <b-button @click="showCollapse = !showCollapse"
              :class="showCollapse ? 'collapsed' : null"
              class="collapseBtn"
              block
              variant="light"
              aria-controls="collapse"
              :aria-expanded="showCollapse ? 'true' : 'false'">
      <p v-if="showCollapse">Hide Customer Information<i class="fas fa-plus plus"></i></p>
      <p v-else>Show Customer Information<i class="fas fa-plus plus"></i></p>
    </b-button>
		<b-collapse v-model="showCollapse" id="collapse">
      <h3>PickList Information</h3>
      <p>Address: {{pickListInfo1.address}}</p>
      <p v-if="pickListInfo1.estDeliv">Estimated Date: {{pickListInfo1.dispatchDate}}</p>
      <p v-else>Exact Date: {{pickListInfo1.dispatchDate}}</p>
      <p>Delivery Needed: {{pickListInfo1.deliveryNeeded}}</p>

      <h3>Customer/Quote Information</h3>
      <p>Quote/SO Id: {{pickListInfo1.salesOrderInfo.quoteId}}</p>
      <p>Site Reference: {{pickListInfo1.salesOrderInfo.siteRef}}</p>
      <p>Customer Reference: {{pickListInfo1.salesOrderInfo.customerRef}}</p>
      <p>Customer Name: {{pickListInfo1.salesOrderInfo.customerName}}</p>
		</b-collapse> 
  </div>
</template>

<script>
  export default {
    props: ['pickListInformation'],
		data() {
			return {
        pickListInfo1: '',
        showCollapse: true,
			}
		},
		methods: {

    },
    created() {
      this.pickListInfo1 = JSON.parse(sessionStorage.getItem('pickListInfo'));
    }
  }
</script>

<style scoped>

.plus {
  margin: 0px;
}

.collapseBtn {
  height: 35px;
}

</style>