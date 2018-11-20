<template>
  <div>
      <b-container>
      <h4>Batch Number: {{batchNo}}</h4>
      <h4>Plant Name: {{genera}} {{species}} {{variety}} </h4>
      <b-row>
        <b-col cols="2"><label for="location">Location: {{location}}</label></b-col>
        <b-col cols="10"><location-change-modal></location-change-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="formSize">Size: {{formSize}} </label></b-col>
        <b-col cols="10"><form-size-change-modal></form-size-change-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="quantity">Quantity: {{quantity}} </label></b-col> 
        <b-col cols="10"><quantity-change-modal></quantity-change-modal></b-col> 
      </b-row>
      <b-row>
        <b-col cols="2"><label for="price">Price: £ </label></b-col> 
        <b-col cols="10"><price-change-modal></price-change-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="image">Add/Edit Picture: </label></b-col>
        <b-col cols="10"><picture-modal></picture-modal></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"><label for="deletion">Delete Batch: </label></b-col> 
        <b-col cols="10"><delete-batch-modal></delete-batch-modal></b-col>
      </b-row>
      <br>
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="10"><b-button @click="saveChanges" style="position: absolute;" 
                                   variant="outline-primary">
                                   Save Changes</b-button>
        </b-col>
      </b-row>
    </b-container> 
  </div>
</template>

<script>

  import LocationChangeModal from '@/components/LocationChangeModal';
  import FormSizeChangeModal from '@/components/FormSizeChangeModal';
  import QuantityChangeModal from '@/components/QuantityChangeModal';
  import PriceChangeModal from '@/components/PriceChangeModal';
  import PictureModal from '@/components/PictureModal';
  import DeleteBatchModal from '@/components/DeleteBatchModal';

export default {
  name: 'BatchInformation',
  data () {
    return {
      genera: '',
      species: '',
      variety: '',
      location: '',
      quantity: '',
      formSize: '',
      batchNo: '',
    }
  },
  components: {
    LocationChangeModal,
    FormSizeChangeModal,
    QuantityChangeModal,
    PriceChangeModal,
    PictureModal,
    DeleteBatchModal,
  },
  methods: {
    displayBatchInformation(selectedBatchInformation) {
      this.genera = selectedBatchInformation.genera;
      this.species = selectedBatchInformation.species;
      this.variety = selectedBatchInformation.variety;
      this.location = selectedBatchInformation.location;
      this.quantity = selectedBatchInformation.quantity;
      this.formSize = selectedBatchInformation.formSize;
      this.batchNo = selectedBatchInformation.batchNo;
    },
    saveChanges(){
      this.$router.push('StockTable');
    }
  },
  mounted() {
    var selectedBatchInformation = JSON.parse(sessionStorage.getItem('selectedBatchInformation'));
    this.displayBatchInformation(selectedBatchInformation);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h4 {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: normal;
  text-align: left;
}
p {
  font-family: Georgia, "Times New Roman", Times, serif;
  text-align: left;
  margin-left: 15%;
  font-size: 18px;
  height: 40px;
  margin-right: 55%;
}
label {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 18px;
    /* text-align: left; */
    float:left;
    white-space: nowrap;
    overflow: hidden;
}

</style>
