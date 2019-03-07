<template>
  <div class="my-nav">
		<b-navbar type="light" >
      <b-navbar-brand >
        <img src="@/assets/AHillsLogo.png" class="d-inline-block align-top" alt="BV">
        <strong>Quote Navigation</strong>
      </b-navbar-brand>
      <!-- Right Aligned Menu Button -->
      <b-dropdown variant="outline" right class="m-2">
        <template slot="button-content">
          <span class="navbar-toggler-icon"></span>
        </template>
        <!-- <b-dropdown-item @click="sendHome">Home</b-dropdown-item> -->
        <b-dropdown-item @click="stockTable">Stock Table</b-dropdown-item>
        <b-dropdown-item @click="quoteNav">Quote Navigation</b-dropdown-item>
        <b-dropdown-item @click="existingQuote">Existing Quotes</b-dropdown-item>
        <b-dropdown-item @click="newQuote">Create New Quote</b-dropdown-item>
      </b-dropdown>
    </b-navbar>
  </div>
</template>

<script>
  export default {
		data() {
			return {
			}
		},
		methods: {
			stockTable() {
				this.$router.push('StockTable');
			},
			quoteNav() {
				this.$router.push('QuoteNavigation');
			},
			existingQuote() {
				this.$router.push('ExistingQuotes');
			},
			newQuote() {
				this.$router.push('CustomerInformation');
			},
		}
  }
</script>

<style scoped>

.navbar {
  padding-top:    0.25rem; 
  padding-bottom: 0.25rem;
}

</style>