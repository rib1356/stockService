<template>
  <div>
    <h3>PickList Information</h3>
    <p>Address: {{pickListInfo.address}}</p>
    <p>Estimated Date: {{pickListInfo.estimatedDate}}</p>
    <p>Exact Date: {{pickListInfo.exactDate}}</p>
    <p>Delivery Needed: {{pickListInfo.deliveryNeeded}}</p>

    <h3>Customer/Quote Information</h3>
    <p>Quote/SO Id: {{pickListInfo.salesOrderInfo.quoteId}}</p>
    <p>Site Reference: {{pickListInfo.salesOrderInfo.siteRef}}</p>
    <p>Customer Reference: {{pickListInfo.salesOrderInfo.customerRef}}</p>
    <p>Customer Name: {{pickListInfo.salesOrderInfo.customerName}}</p>
  </div>
</template>

<script>
  export default {
    props: ['pickListInfo'],
		data() {
			return {

			}
		},
		methods: {

		}
  }
</script>

<style scoped>

</style>