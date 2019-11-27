<template>
  <div>
    <div class="info">
      <pick-list-info></pick-list-info>
      <hr>
      <b-form-group vertical label="Add a note to picklist:" >
        <b-form-input v-model="comment"
                      placeholder="Picklist Comment/Note" />
        </b-form-group>
      <b-form-group label="Delivery Details:">
        <!-- <b-form-checkbox-group> -->
          <b-form-checkbox v-model="packedIn">Packed In</b-form-checkbox>
          <b-form-checkbox v-model="inCrate">In Crate</b-form-checkbox>
          <b-form-checkbox v-model="inTrolly">In Trolly</b-form-checkbox>
          <b-form-checkbox v-model="loose">Loose</b-form-checkbox>
        <!-- </b-form-checkbox-group> -->
      </b-form-group> 
      <b-button variant="outline-primary" class="myBtn" @click="savePickList">Save Picklist</b-button>
      <!-- <b-button variant="outline-primary" class="myBtn" @click="createPDF">Create Picklist PDF</b-button>  -->
      <router-link :to="{name: 'PlantAllocation'}">
        <b-button variant="outline-success" class="myBtn">Change Allocation</b-button>
      </router-link>
      <router-link :to="{name: 'ExistingQuotes', params: { salesOrder: true } }">
        <b-button variant="outline-danger" @click="cancel" class="myBtn">Cancel Allocation</b-button>
      </router-link>
    </div>
    <div class="list">
      <b-table show-empty
             stacked="md"
             :items="pickListItems"
             :fields="fields"   
             outlined       
             >
      </b-table>       
      <p v-if="itemsToPick.length == 0">Theres nothing here</p>
      <!-- <ul v-for="items in itemsToPick" v-bind:key="items.batchId">
        <li>
          Name: {{items.plantName}} | FormSize: {{items.formSize}} | 
          Price: {{items.batchPrice}} | Location: {{items.location}} | <b>Amount To Pick: {{items.amountNeeded}}</b>
        </li>
      </ul> -->
    </div>
    <b-modal ref="createPDFModal" size="sm" title="Create a quote PDF?" centered hide-footer hide-header-close no-close-on-backdrop>
		    <div class="modal__footer">
          <router-link to="/PickLists">
      	    <b-button variant="outline-danger">Back to picklists</b-button>
    	    </router-link>
          <b-btn variant="outline-primary" @click="createPDF">Create PDF</b-btn>
        </div>
    </b-modal>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import PickListInfo from '@/views/PickingList/PickListComponents/PickListInfo.vue'
  export default {
    components: {
      PickListInfo,     
    },
    data() {
      return {
        itemsToPick: [],
        pickListItems: [],
        fields: [
          { key: 'plantName', label: 'Plant Name', sortable: true},
          { key: 'formSize', label: 'Form Size'},
          { key: 'comment', label: 'Comment'},
          { key: 'subFor', label: 'Subbed For (Original Item)'},
          { key: 'batchPrice', label: 'Item Price', sortable: true},
          { key: 'location', label: 'Location', sortable: true},
          { key: 'amountNeeded', label: 'Amount to pick', sortable: true},
        ],
        picklistInfo: '',
        comment: '',
        packedIn: false,
        inCrate: false,
        inTrolly: false,
        loose: false,
        plantsForPDF: [],
      }
    },
    methods: {
      cancel() {
        sessionStorage.removeItem('tempBatchSave');
      },
      sortItemsToPick(items) {
        console.log(items);
        items.forEach(item => {
          var isSubbed;
          var subFor;
          if("subFor" in item) { //If subFor exists in the current item
            isSubbed = true;
            subFor = item.subFor;
          } else {
            isSubbed = false;
            subFor = null;
          }
          this.itemsToPick.push({
            "PlantForQuoteId": item.plantQuoteIdUsed,
            "BatchId": item.batchId,
            "PlantName": item.plantName,
            "FormSize": item.formSize,
            "QuantityToPick": parseInt(item.amountNeeded),
            "IsSubbed": isSubbed,
            "SubbedFor": subFor,
            "DispatchLocation": null,
          });
          this.plantsForPDF.push({
            "batchId": item.batchId,
            "plantName": item.plantName,
            "formSize": item.formSize,
            "comment": item.comment,
            "amountNeeded": item.amountNeeded,
            "location": item.location,
          });
        });
      },
      savePickList() {
        sessionStorage.removeItem('tempBatchSave');
        var address;
        if(this.picklistInfo.address == null) {
          address = this.picklistInfo.salesOrderInfo.customerAddress;
        } else {
          address = this.picklistInfo.address;
        }
        this.axios.post('https://ahillsquoteservice.azurewebsites.net/api/picklist', {
          QuoteId: this.picklistInfo.salesOrderInfo.quoteId,
          DispatchDate: this.picklistInfo.dispatchDate,
          DeliveryAddress: address,
          DeliveryNeeded: this.picklistInfo.deliveryNeeded,
          IsPicked: false,
          IsAllocated: true,
          IsDelivered: false,
          Comment: this.comment,
          EstimatedDelivery: this.picklistInfo.estDeliv,
          PickListPlants: this.itemsToPick,
        }) 
        .then((response) => {
          alert("PickList saved");
          this.$refs.createPDFModal.show()
          console.log(response);
        })
        .catch((error) => {
          alert("Please check values before submitting: " + error)
          console.log(error);
        });
		  },
      createPDF() {
        let pdfName = 'Picklist' + this.picklistInfo.salesOrderInfo.quoteId;
        var doc = new jsPDF('p', 'pt');
        var columns = [
          {title: "Batch Id", dataKey: "batchId"},
          {title: "Plant Name", dataKey: "plantName"},
          {title: "Form Size", dataKey: "formSize"},
          {title: "Comment", dataKey: "comment"},
          {title: "Qty Needed", dataKey: "amountNeeded"},
          {title: "Location", dataKey: "location"},
        ];
        // var companyLogo = {
        //   src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAABxCAYAAACawUJxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAY30lEQVR4Xu2dC3xVxZ3Hf/edxyUJ4REeCQFEKiKKxbWiKNqKgmjVrtLu2t1a2639rJ/q6ra21KXadtVarW5ta2vrc33Uom2xVdC6akVEbEWREESIkAeQhJCEPO69ue+d39wzycnNuclNcq96zXz5HM5j5syZM+c3//nPnDk3trgAGk0OYzfWGk3OokWcJbp93YjFYontwE4cOvJXbNnxDD7/n1egua1FHtdkBi3iLNATDGL3vhrYbDa5/1r1j/H038/G4cBqXHHJPPzi8QcRF/80mUGLOAts27kdrZ3tvULt9E1GnrMErV118Iz7K0LhFhF+RIZpRo8WcYZp93Xg7zu3IhqN9roTHR0ROBwxOOx56OppgNcbRcvhVhmmGT1axBnmpS0bcXTFbNTU7oXyGGrr6+F0OOW2LW5HJJpwOTSZQYs4g/SEenDHfXejbNIUHGg+KN0JjmD6wj1infCPWeLczs/LS+xrRo0WcQZ5bdsWxG1hUah2FBUVC/fBgVg8hmAkKNbCLIttR9yNYysXoHLqdOluRA2XQzNytIgzRDQWxW333oXzP7NSdNzCcLqccnQiGAyhq8MHGxzCLseEFc7HaSeeiHdr/o4n/vQIfvDzW3D1D67HO7u3GylphosWcYbYtrsKJcXFmFtxFEIIIhCkCxFHOBKW2xS03eZGR6AOW+u/hCb/VSit+CWWLqnCWUsL8PU138C9f3jQSE0zHLSIMwBdhXUvbsBFZ5+PgD+IaCQmrTF94mAoBF8wLGIlfOJoLIgu/360+RpxqLMGDUeeQ9T5K9x+47m488F78bedW2U8TfpoEWeA+oMNWHLCyXC53YnOnHBzQ0HhB9PnjcaENY4aMRNSttlcYnHCIdZOuxf+SAQd/t/ihq/9I6688XrpmmjSR4t4lNBliAgRTi6dgI7uLnHElrDA0bAQcVwIMiItM48b4xNJxOCMedDeuR/lFbvgC/tR39hghGnSQYt4lNDXnTKpDDve3yW3OTRsE/9FhIjjNMlCpHzJAThlmBVxm4hndyIQ/Rs+OWcCnnruz0aIJh20iDPArpr3EBIdOIccCxZSFSu6EXQnKGyno0B26mRYShwIRrpx2qI5eK+2xjimSQct4lHi7/FjZ+1u4d86xJ5NFKhNdvToYsgxYKFbl3OcWLxik5bZGso/GunB9OlT4Pf5Ewc1aaFFPEp21OxCKBox9qjZhLVl50y6E0KddrjhsheIwNSWmCF8Je2x52Pu7LmJg5q00CIeBRwD3tPwvvB5+7ps0qEQ4vXm58PtcoswlxBnPhwOT6/ALRECd7m9CAbz8cn5JxgHNemgRTwKdtIXDvWfyEOZcsTC5XLB4XQI8YoitjmFX5wvhZqKWDyCwrxy7NjVhFNPPMk4qkkHLeIR8lbVNmzbtV1YWZtcFOzI0R7TH6aYuc8jDluBYYmthUxjHo/MQeW0YzCxpNQ4qkkHLeIREBY+8MtbN8IprG3CgTAhNSr+M7Rqt9uFFfYYw2zWAuYwnMdTgMONs3HxsvOkm6JfeKSPFvEIeOGNVxAV/+IpZqDRa6AV5kIRAy6xzhcSpoiTRC+PRmCLjccJ847Hvv3b8fym5/GbJx7Hmru+j911erhtKLSIhwmt8Nr1v8f0idMQiVpYS6nRxJs69WVHTAjeYS9IBPFNSD/obrgRjLSh6sA3UNd5FYon3Yezlh7B8rOX4N9u+DbeqH7TiKuxQot4mKzf+AJKS0vgtLukXR2AtMJC7OGItMREeMewOxiforc4K84x5oioIJ3o8DVgX9Mr2LJzNcK2n+L2G76Ia25cjUBSB1LThxbxMPAFfPjxA3fhE7Pmwh8NDHAMFKFwCH5OxRTbahKQ3c7Pk/jyg4JNwkZx0yI7RAfPBYcjT/jb44SYX0LU8Tg+u+xs/P65PybiagagRTwM1r74NObOnIXx3qKU/jBHI3qEgH1+n7TE4XAYoWBYyDNfilQKOU34lm9/8yYsPC6OjW+9ZRzVJKNFnCa+YABvvr0VX1x5GQL+HtitLKq0vVF0BTrQ0t4i/GCHHCsOhULG3AkK2MKdSImoEJEgPPmtohXo+zEWTX+0iNPk0fVP4fPLPycscBSxQXTIYWKf34+Ork7pbtAycx6FwyFEn8r/GBRxMSMNPexmjRZxGhzp7kQ8FMbsipmoPXRgEC0yxC4sJlc26U40Nh2UoxOcipmwwsNQsohqd9iEJc+TZ6rP/jX90SJOg6dffBbnn7kc+w7UCTfCOJgKm11YTA6xJd7YdQqLzNEJFrUarUiXeDwKb34ZDreVYOrEidKqawaiRTwEhzvbMX3yFNHJcmJ33V44hEiHRog4GpGiKxk/HlHhCoCvptM6lyQsdjzWg5LCBXjupWqsXHp2IkgzAC3iIXhj21acvGARtr1bJd++pWtLI5GoFPGECRMQCQcR5RwLOTqRDvxCJIrC/HFoOTgfW6uqsGTRYiNMk4wW8SAcEa7AvNlz0NXjR4PwhTnhPR0YiwLm5PgwrTBFybnFQ7oTIpyfKgls8GOC90Lc+cAWfP+6b6LAky+PawaiRTwIhw41YdqkKdi6fathhdOww9ShELDbKTp40SgO7N8Ph9MtRCk6d/KlxmCIxxF3CH+6W/jAZ2DdegcWLzwZq5ZdaoRrrNAiTkEwFMSM8hk4eLgZLe2taVthRrPbHb2dMI4Vk8RHo0PBV88dmDphKepqlmPZpy7AHdff1JuWxhot4hTwqwwOab1dvQ12jvGmKWKOQNjt/LUf/mwVkJeXh5gQZyQWEmJMYcl53MbOnwsLKq9CmXsN5s04BSvPPEdcVQt4KLSIU0Drx2mQHCMelpCEHmmJ4zxHCLqwoFBsxxGJBqRIrYs8JlwPOyrLzkHlxM+ifGqpsODAHQ/cg18//jDe27dHzjHWWKNFnAJO4nnnvarEm7Zh4hT+M18Rs2PnLSxMzPuJU4QsbitrbBeideFg6yZseGsVXt5xIQKu27D0tBAqZ7pw/1O/xeeu/jJ++bv75SQkTX+0iFOw90Cd/BzfNuSIQn9odSl8ByfDC2Ps8eSJQuYLkB6xz46dhW8cTwyphaKdwopH4Q+3orb5Rbx74PsIOL+Hi1buwXeu/AccOLgPy6+4FBu3vW6cqCFaxEn4AwEEg0FU1eySbsGwEZp3ChHneTxydKK7u1umE47QnWCE1EXOX61gOP1ph71QVAYPuv2d2N30LOo7b8PyZXvwvesuxA9+djtuu+8O6X9rtIj7wTHdg82NONDSiM7ODikq6dsOA2WJ8zxuusTwuD0oLCwwREyfOB0oTmG1xYovSFz2PESjcbzf/Bd0R36Mn6w5E5u2bcVdj9yTiD7G0SI2caC1CcFQADtqqkfkCyt4rtdbBJvdJn3i4iKv8LE7DHdiOJVCxU1UJacjD93BduxuuBWr/30J7n74N2L7/USUMYwWsQH/LMGWN7fI6Y6tHW1CN8NvquO2OCL2CJxuF0q842Vz73a6UeC2IxwXlt2mZrKNHM5LDoSFVXe8irNOPRlrN/zBCBm7aBEbHDjUiF37dqNRWONR6ky+4Jg9Y7b8qoNDdeGIH7FYt7CmGShuzsEQaQaDHSifNgE79rxnBIxdtIgNHn76CeSLpv+Q8IXjac826w/fWThiYhHrWWXTe+vCtEkTEQh2SvGNGPlCRCQukuBH1hOLjkM4lI9xheOMCGMXLWJBW2c7/vDCOswqnyl84r4/TTBS7KISFBV45Zs74nQ60BPqGqUlZpXgwjRjKCtZgardO7H4hEUMHNNoEQueeuGPuOyCVdLQcdK7WcKUDUd2OR1YyaiPgUd4Lv+a6LhCr7C8ieLlJ012mmc5FbN//LSJMy0HQtHDOLrsArS0luG1Nzdj+RnLEuFjmDEv4g5fF7ZXV+HCs85HV6ArUSCxuOyUcYkK0VHAXEdFoNRSL5S3lLjcS2CTb+u8XiFivjsWlAvXIhTuETFDcn/4QmbV4FhzF0rzFuJT82/GD+/5Kb751WswbUJZIsoYxiYe1AhNw8eDp154Gicccxz8vh5U792J4oJiFPBnWd2eXhHza2XOXQiGQ+gJ+BGOhhHlrDT5MR2LjyLjDAtu81XzOMydNRczp82QbsWjf34Cx87fi/rmdejyHxR1JCAqBucZU+Rx+bWIPJtrY1umK6/PH2Hhh6YezJx8Do6vXIP/efhZvFtThYd+9Gt4XPyKemwzpkXc4evEnQ/8DP/xpavw8uZXEBaCKSookm/cfD0+tLW1SdegtLQUxeOK5aw2DsW5XR7ke/IREaKORCLoCvnQ0dWBbr9fSI8/6+rGWYtOx7TJZfKczW+/iU8dv1C4FKIShNpEZWhDKNIiBN2Inkgd/KFG+Hv2C2vdKSqIT4qcv9+W5y4V1ykVzUCpqDxHobl5Kh5b9wzmHzMH/3319+B2pvvy5OPNmBbx+w21eObl9ZhcUoaS0hIpxL31dcIVKIQn3w2Pxw2n3SksoXAEgmF0dfkwvqgE5UKcJeNKMKF4vLC6XowvGS/F3eXrFksXwuEoKqZME+d75HX21L6PyukVcnqnGRZ9KBxEINQtrH2PqDitaGqpxZHOI0LkQFBUoOaDnXhhyxuoO9iIeUcdhVUrLsLFnzl/dCMdHzPGvDsxGuj70hK73QObdFrprkPNGC/EGwz2SHeEboYZ/iBhWLgqza2HhHA7hE/uQ0t7O/bv3w9/MAC3qASzKmdgSukkzKmYjUmlE4wzNWa0iLNE7a538MbDd+DT/3ItHN5itPn8mDNvgRGqyST9+tqazNHadBA24SM/851/xf9+7Ry0NOwzQjSZRos4S7QJF8Hl9sDhEZ2vuA3B7nYjRJNptIizBP8mXdgoXf4aUCjQndjRZBwt4izRXL8Pzjyv6HQADpcTjfX1Rogm02gRZwl+IcIpmRwI4xce5r91p8ksWsRZYtLEMsSdTvnizeN041BjrRGiyTRaxFmioLAQDoqYxBPzMDTZQYs4SxxuPyx/c4LwM6VAVwdi+keys4IWcZZoaT4AVx5FbINTWOTDLU0I+PRvRmQDLeIsEItG0HOkE478QsTYobM7EA344HKO/ONTTWq0iLMA/2i5X7gPnsIiOa3SYXfCJr+308WdDXSpZgGK1em0w1U4DrZYDG459zgqfz1ek3m0iLOAJy8PcxeeAm/JBNiKCjHn3Euw+OLL5VxjTebRIs4KNpy2chWqq7ejuXgqSk5aivMuvwZu/WvvWUFPxdTkPNoSa3IeLWJNzqNFrMl5tIg1Oc/HpmO3fU81KqdWoNhbZBwBXn37dbxq/Kr6ZSsuReWUCrn96Ia1qG/aL7e/++Xr5Frz0eSWB++U6xlTyvHFFavk9gAo4qG48pZr48uvvkQu3M4Gj6z/Xe813tm9wzjan1Rxbn7gJ/HC06fHp62YFz/S1WEc7TvOZeNbm42jcXm+Op4uf9q4Ib74inN6z/vCd78Sr22sN0LTh/ljvsxpcZvlOpL0Piyuv/vG3meRTVQZDXadId2JuqYGabmkVRMLt3ks09Ayqmt0dHcaR/uTKk5VzU655rG6xsznjff8Tzd8VVr7009cLC36n199DqdecW7KvFrB849ddYq0LtxWcJvX6OhKP60Pm+011b3PIh2UjrKhnSFF/Myrz8v18UfPl2uSbsY/KFZffi0uOH25dA3M+cwU3/7ZTXLN9Df89ElsfuB56bZQwBRzunz9R9f1il6lxeW2b9wkK0c28v5RgJV2/qrF+Pqt16G+MeHGZZIhRfzYc0/K9ekL+wr52U1/keuPCszXb2++Lyv+rdnqswwIBazKQvnWQ0Frq6zvVZd+VeaVwuXCfYpZMzIGFTFNvyr4JQtP6X2ItD7DaUazDYXG2s4l083VjKnlxlaiPAjLRLVGC+YcK9dDMdLy4nnKnVlxzaXSmnHfCh5nGai8mc/7xZP3pcwD4zFdxmP8weIOF5kf058so1HkseR74PV4XeZhqPwOwPCNLfn52t/0OtbskLAzpfbZycokqTphZlLFGe7x4XbsVCeMHUd28LjmPjt3w0Gdx4VlOxQsb/M55oV5Mndiibov1RFP5xzGTY7HJVXnWpFuGZrTNC/mjlqq+zR3fs3xkxnUEitXgv6makLVMFU2XYpv//ym3hppXh7b8OE0ub/6TmKYh5aBloprugB0YdRxWj+z62GF2d2hn00/MZXFodXnPTOMZf+r1XdKl0OlwdaA4VbQyjEvHJJifPXMeA6vp2AcZREZj+nznnhvmfLPldukUHm6bHlf3lWZEpUP3m+6nfSUImaiypVYueQcuSYqQ9l0KVRznbxko2c7FMwLO2RmWKnZGVNQCKqimcepk6E4+HBUHN4PxcwRi+QO4j1P3t9bvk/cfL98+Cx7PmQuhHlLbpYVzB+vxbjr7+6LYzYE5maeeWP6yfc2Wnh95YYSipfH1Jgv86+eq7o35oPhzH86pBRxcqEqIXHQWTGcnvlwULU1eTHX6A8CiogCplhomfigCe+bPqRi07Ytck0BDAXvbefaLVIoykLyOrRGLF+FEhjjJN83X9wo1LWTUXkl5jTMhsDsz3O4MJO+cLqY82++L5JOeZKUIja7C8rp50KnXJEtl0LV1gEiNtXoDwJaCQqYllMNhZktCBc+dFWZzS3WYDA9iqx67ev9rN4tD/WVLa9LzB1LhRI/GU3rRJGo+zG3CuZnnG3M+Tff13CwFLH5wahabF5Uc8g4H3TN/SB5ZlPfGLm6ZzZxyqqxcn/hhq/IbYanaznMUMzK/zRb4nQp8RYbWyOD98MKqvLO52k1evBRxlLEZjdh9ZevlTdpXsxNlTkuYc36uAk7eYCePmqy8GhRldBHivl8VVGYfnJ5msucQ5+jhddih44tg8rDB/UuwNy6Jlcc1RoNhaWIzTdgZV3OX3KusdU/LguXPW42Selm4KOMuk9WTHMTywdtLgNy/Jyhe/N0x8ytl7J6qqzMZW3uvas3hoTn3PrQXXJb5uP0/vkYDryv5Oack6iGCyua1aIw96NU66Yw+8G8T3Ue85XcoU7FABGzkFRNN7sOZmiFlP9itgr3PHW/XDON5MzmIvQXlcWl2FhBKcTp5x3bK2pVPuZhIivUg2U8nu89o3xAOmb/mNc2+9/q2mYDYe4cjgSOVDDdU79yrkyb2yrtf15+iVynA8+1WhSqVSHsPPLeVTjzr1p2lh+PM5x54RBbOvc3QMQb395sbPW3uMmYLYASstl6DHZurkBh0X0yd34oRBY2H8zm+5+X4SqMD8Bs2cwwrVQ+M9PniEWywVBDZDyefG1zvkYLhcu0eQ2KhtcdiX+fCpVm8v0pWBl5n2Z4Du/RXAFSkfH5xCyQ4nFFadWgXILiUVbK3NEbCRSMIp2HRHht5mG017ZCpc10VcuTDcxlaHXfKny4+dBfO2tyHsuOnUaTS2gRa3IeLWJNzqNFrMl5tIg1OY8WsSbnySkRb6+9Heu2LEIo0mEcAf5v28VoPvKasZeA8biYeeyvk42tPtq7d+DJTUfLNNa/+Wm8vutqI6QPX08DNu74koxjdS3CtFU4l2R4PtNnGNfJaXDffB6vmXyfhHGS88h9q2uqsmIYl71NTxghfTDfu/bfa+wNzEeukJOWuKr2DmNrdFAk473H4eyFf8R5J72EsNhPftgUw6wpX5BxuJSVnGaE9EeFc0kmFOnEojk/lGGLj7l7gBBVmkrcvObxM78Ft3PgDDUK3Az3u3us/9DjbFO+uW3F3qbfDUgz18g5EfNhNBxeL61opinMmzHA+pFDR/pexY+WwrwKUVkGzrFYMPObsnJSUFysRMd7ZqVrOLxB7nPN/dGI8Jjyr2FrzX8Ze7lJTlpiK2s2UmjFaPmYHgV8TPmVRkgCWlCfiMOm2apJVqhme2vNGuNIf2jxeJ2NOy7HGcc9ZBztg9bY7SzCK8L14DWtYP7KJy7HPiMfXM+e8nm5bQXzq/KVqtKzsrClUBUjF8lJEfOBe4VFM/tzI4VNdlnJqdJCWlk0hp9x3MNYtnCduN6vpRCtUM12KgGO986XVtPK0is+Iawir8d4VvC+ubQZguSacVPFN7sTqeIQ5pnWmGLORXJSxOQUYY0pKitRUOBmQXI71UNMiPg06YMyrVQWiyLnwx6pa8HrV0xcIdyGb+E9ke/RwPzS4tMVILyHwSrHUDBvFPxo8/VhkbMi5oPjQ7SynuVCLBQjLTU7S2yiKZ6hoDiSRw5UGlwoHFpLK1QcLoMJila/eQQVgekqeH/MV8XE84wjCX85GZaNylOqyqlgWY6mInyYOG4SGNs5Aa2sV3TAyMSik+CwezBJrClqhcOeh8rJF8mH2N5djRNnrxFxFxmhffBvzNEPVVY6381hOBuKC46W+yQaC0rRMa35M66WQreC4Wrh+eb8kFLvAnmMeWOei0QcbptJzo8Zc1gi/SJMK/20EdqXvhm6BypPMXEfVumq+2FeWEYsA6t4H2X0VExNzpOz7oRGo9Ai1uQ8WsSanEeLWJPzaBFrch4tYk3Oo0WsyXGA/wd3qjkxMR+q+wAAAABJRU5ErkJggg=='
        // }
        var companyInfo = "Station Nurserys\n" +
                          "Stokesley\n" +
                          "Middlesbrough\n" +
                          "TS9 7AB\n" +
                          "Tel: 01642 711281\n" +
                          "Email: enquiries@hillandsons.co.uk\n" +
                          "Web: hillandsons.co.uk\n" +
                          "Stock: hillsstock.co.uk"
        var deliveryNeeded;
        if(this.picklistInfo.deliveryNeeded){
          deliveryNeeded = "Yes"
        } else {
          deliveryNeeded = "No"
        }
        var testAdd = "17 Test Road Stockton On Tees TS"    
        var splitAdd = doc.splitTextToSize(this.picklistInfo.salesOrderInfo.customerAddress, 150);       
        var orderTo =	  "Customer Ref: " + this.picklistInfo.salesOrderInfo.customerRef + "\n" +
                        "Customer Name: " + this.picklistInfo.salesOrderInfo.customerName + "\n" +
                        "Customer Tel: " + this.picklistInfo.salesOrderInfo.customerTel + "\n"	
        var delivStr;                
        if(this.picklistInfo.estDeliv) {
          delivStr = "Estimated Delivery: "
        } else {
          delivStr = "Exact Delivery: "
        }                

        var deliveryStuff =	"Delivery Needed: " + deliveryNeeded + "\n" +
                            delivStr + this.picklistInfo.dispatchDate + "\n"
        doc.setFontSize(20);
        doc.text("PICKING LIST", 240, 20);
        doc.setFontSize(10);
        doc.text("Order To:", 40, 35);
        doc.text(orderTo, 90, 35);
        doc.text("Customer Address:", 90, 70);
        doc.setFontStyle("bold");
        doc.text(splitAdd, 90, 80); //---------------------------------------------------Customer Address
        doc.setFontStyle("normal");
        doc.text("Deliver To:", 300, 35);
        doc.setFontStyle("bold");
        if(this.picklistInfo.address != null) {
          var splitDelivAdd = doc.splitTextToSize(this.picklistInfo.address, 200); 
          doc.text(splitDelivAdd, 360, 35); //---------------------------------------------Delivery Address
        } else {
          doc.text(splitAdd, 360, 35);
        }
        doc.setFontStyle("normal");
        doc.text(deliveryStuff, 40, 130);
        doc.setLineWidth(1);
        doc.line(0,160,700,160) 
        doc.autoTable(columns, this.plantsForPDF, {theme: 'striped', startY: 170,
                                                  styles: {
                                                      overflow: 'linebreak',
                                                      },
                                                  columnStyles: {
                                                    0: {cellWidth: 50},
                                                    1: {cellWidth: 100},
                                                    2: {cellWidth: 100},
                                                    3: {cellWidth: 100},
                                                    4: {cellWidth: 50},
                                                    5: {cellWidth: 75},
                                                    }    
                                                  });
        let finalY = doc.autoTable.previous.finalY;
        doc.text("Comment: " + this.comment, 40, finalY+10);
        doc.text("Packed In: " + this.packedIn, 40, finalY+25);
        doc.text("In Crates: " + this.inCrate, 40, finalY+40);
        doc.text("In Trolly: " + this.inTrolly, 40, finalY+55);
        doc.text("Loose: " + this.loose, 40, finalY+70);
        
        // let quotePrice = (this.totalPrice/100).toFixed(2);
        // let quoteVAT = (quotePrice/100*this.VAT).toFixed(2);
        // let priceAfterVAT = (parseFloat(quotePrice)+parseFloat(quoteVAT)).toFixed(2);
        // doc.setFontSize(12);
        // doc.text("Total Exc. VAT: £" + quotePrice, 380, finalY+20);
        // doc.text("VAT:                  £" + quoteVAT, 380, finalY+35);
        // doc.text("Total Inc. VAT:  £" + priceAfterVAT, 380, finalY+50);
        doc.save(pdfName + '.pdf');
        this.$router.push('PickLists');
      },
    },
    created() {
      this.pickListItems = this.$route.params.itemsToPick;
      this.sortItemsToPick(this.$route.params.itemsToPick);
      console.log(this.$route.params.itemsToPick)
      this.picklistInfo = JSON.parse(sessionStorage.getItem('pickListInfo'));
    }
  }
</script>

<style scoped>

.info {
  width: 20%;
	height: 100%; 
	float:left;
  /* background-color: slategray; */
  text-align: center;
  color: black;
}

.myBtn
{
  width: 100%;
  float: left;
  margin-top: 5px;
  /* position: relative; */
  /* margin-top: 35px; */
}

.list {
	float: left;
  height: fit-content;
  max-height: 85vh;
	width: 80%;
  /* background-color:lightgray; */
  color: black;
  -webkit-overflow-scrolling: touch;
}


</style>