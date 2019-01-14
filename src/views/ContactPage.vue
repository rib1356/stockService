<template>
  <div class="contactPage">
		<h3>Contact Information</h3>
		<!-- <img src="@/assets/AHillsMap.png"> -->
		<h5><address>
			Visit us at:<br>
			<a href="http://www.hillandsons.co.uk/">www.hillandsons.co.uk</a><br> 
			Station Road<br>
			Stokesley<br>
			Middlesbrough <br>
			TS9 7AB
		</address></h5>
		<h5><address>
			Contact us at:<br>
			Phone: 01642 711281<br>
			Email: enquiries@hillandsons.co.uk
		</address></h5>
		<p><router-link to="/Stocktable">Back to stock table</router-link></p>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
	import 'firebase/auth';
	
	export default {
		name: 'ContactPage',
		data() {
			return {
			};
		},
		methods: {
		}
  }
</script>

<style scoped>  
 .contactPage {
	 margin-top: 40px;
	 text-align: center
 }
 p {
	 margin-top: 40px;
	 font-size: 13px;
	 text-align: center
 }
 p a {
	 text-decoration: underline;
	 cursor: pointer;
 }
 h5 {
	 text-align: center;
	 
 }
 address {
	 text-align: center;
 }
</style>