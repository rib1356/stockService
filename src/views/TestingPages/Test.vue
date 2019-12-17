<template>
  <div>
    <li v-for="batches in hillsBatches" v-bind:key="batches.id">
		  	<ul style="display: inline;">
          <!-- Correspond to value name in object -->
          {{batches.Id}} {{batches.Name}} {{batches.FormSize}} 
				</ul>
    </li>
  </div>
</template>

<script>
  export default {
    Name: 'Test',
    data() {
      return {
        hillsBatches: [],
      }
    },
    methods: {
      getHillsBatches () {
      this.axios.get('https://ahillsbatchservice.azurewebsites.net/api/Batches') //Call the database to retrieve the current batches
        .then((response) => {
            this.hillsBatches = response.data;
        }).catch((error) => {
            console.log(error);
        });
      },
    },
    mounted() //Call this method on page load
    {
      this.getHillsBatches();
    }
  }
</script>

<style scoped>

</style>