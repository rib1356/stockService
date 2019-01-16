<template>
  <div class="contactPage">
		<h3>Contact Information</h3>
		<gmap-map
      :center="center"
      :zoom="17"
      style="width:100%;  height: 400px;">
    	<gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position">
			</gmap-marker>
    </gmap-map>
		<h5>
			<address>
				Visit us at:<br>
				<a href="http://www.hillandsons.co.uk/">www.hillandsons.co.uk</a><br> 
				Station Road<br>
				Stokesley<br>
				Middlesbrough <br>
				TS9 7AB
			</address>
		</h5>
		<h5>
			<address>
				Contact us at:<br>
				Phone: 01642 711281<br>
				Email: enquiries@hillandsons.co.uk
			</address>
		</h5>
		<p><router-link to="/Stocktable">Back to stock table</router-link></p>
  </div>
</template>

<script>
export default {
  name: "ContactPage",
  data() {
    return {
      center: { lat: 54.457005, lng: -1.178871 },
      markers: [],
      places: [],
			currentPlace: null
    };
  },

  mounted() {
		this.addMarker();
  },

  methods: {
		//Move to location
    addMarker() {
        const marker = {
          lat: 54.456788, 
          lng: -1.179474
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
    },
  }
};
</script>

<style scoped>  
 .contactPage {
	 margin-top: 10px;
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