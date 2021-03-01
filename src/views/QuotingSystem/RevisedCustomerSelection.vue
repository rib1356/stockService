<template>
    <div>
			<quote-navbar class="navbar-custom" v-bind:pageName='pageName'></quote-navbar>
        <div class="content">
            <div class="search_bar">
                <input id="searchbar" type="text" v-model="search" placeholder="Search for a customer, postcode or plant">
								<i class="fas fa-search"></i>
                <!-- <img src="../assets/search.png" /> -->

            </div>
            <div id="search_results"></div>
            <div class="customer_table">
                <button class="customer_name"  v-for="customer in filteredCustomers" v-bind="customer" v-bind:key="customer.id" v-on:click="addActiveCustomer(customer)">
                    {{customer.CustomerName}} <br /> {{customer.CustomerAddress}}
            </button>
            </div>

        <div class="customer_form hide" id="customer_form">
            <form>
                <!-- <img id="cross" v-on:click="classToggle" src="../assets/x-mark-32.png" /> -->
								<i id="cross" v-on:click="classToggle" class="fas fa-times"></i>
                <label class="form_field" for="name">Name:  </label>
                <input class="form_field" type="text" id="name" name="name" v-model="name" required> <br />
                <label class="form_field" for="email">Email Address:  </label>
                <input class="form_field" type="text" id="email" name="email" v-model="email" required> <br />
                <label class="form_field" for="number">Phone Number:  </label>
                <input class="form_field" type="text" id="number" name="number" v-model="number" maxlength="11" size="11" required>  <br />
                <label class="form_field" for="address">Address:  </label>
                <textarea class="form_field" name="address:" id="address" v-model="address" cols="40" rows="5"></textarea> <br />
                <input class="form_field" type="checkbox"  v-model="customerIsWholesale" @click="check" >
                <label class="form_field" for="wholesaler">  {{newCustomerValue}}</label><br>

            </form>
            <input type="submit" id="submit_button" v-on:click="postCustomer" value="Add New Customer"/>
        </div>
        </div>
        <footer>
            <div class="footer_buttons">
                <a class="button left_button" v-on:click.stop="classToggle">New Customer</a>
                <a class="button right_button" v-on:click="navigateToQuote">Next</a>
                <div id="selectedCustomerName"></div>
                <div id="selectedCustomerAddress"></div>
            </div>
        </footer>
    </div>
</template>

<script>
    import axios from 'axios'
		import QuoteNavbar from '@/components/QuoteNavbar.vue'
    export default {
			components: {
				QuoteNavbar,
			},
        data() {
            return {
							pageName: 'Customer Selection',
                app: null,
                customer: null,
                customers: [],
                search: '',
                loading: true,
                errored: false,
                response: '',
                name: null,
                email: null,
                number: null,
                address: null,
								customerIsWholesale: true,
                newCustomerValue: 'wholesale',
            }
        },
        mounted() { //get request to pull customer list
            this.getCustomers();
        },
        methods: {
            addActiveCustomer(customer) { //selects the customers name, displays it and adds the selected customer to local storage

                document.getElementById("selectedCustomerName").innerHTML = customer.CustomerName;
                document.getElementById("selectedCustomerAddress").innerHTML = customer.CustomerAddress;
                localStorage.setItem("selectedCustomer", JSON.stringify(customer));
            },
            postCustomer() { //adds a new customer to the database api
                var custRef = '';
                    axios.post('https://ahillsquoteservice.azurewebsites.net/api/Customer', {
                        CustomerReference: custRef,
                        CustomerName: this.name, 
                        CustomerTel: this.number, 
                        CustomerAddress: this.address, 
                        CustomerEmail: this.email, 
                        SageCustomer: false,
												CustomerIsWholesale: this.customerIsWholesale,
                    })
                        .then((response) => {
                            console.log(response);
														this.classToggle();
														this.getCustomers();
														this.name = null;
														this.email = null;
														this.number = null;
														this.address = null;
                        })
                        .catch((error) => {
                            alert("Error saving customer");
                            console.log(error);
                        });
            },
            classToggle() { //hides and shows the customer form
                var element = document.getElementById("customer_form");
                element.classList.toggle("hide");
            },
						getCustomers()
						{
							axios
                .get('https://ahillsquoteservice.azurewebsites.net/api/customer/all')
                .then(response => {
                    this.customers = response.data
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true;
                })
                .finally(() => this.loading = false)
						},
						navigateToQuote()
						{
							this.$router.push('QuoteCreation');
						},
						check()
						{
							if (this.customerIsWholesale)
							{
								this.newCustomerValue = 'retail';
								this.customerIsWholesale = false;
							} else {
								this.newCustomerValue = 'wholesale';
								this.customerIsWholesale = true;
							}
						}
        },
        computed: {
            filteredCustomers() { //filtered search
                let tempCustomers = this.customers
                if (this.search == '') {
                    return tempCustomers;
                }
                else {
                    tempCustomers = tempCustomers.filter((item) => item.CustomerName.toLowerCase().includes(this.search.toLowerCase()))
                }
                return tempCustomers;
            }
        }
    };
</script>

<style scoped>
		@import "https://use.fontawesome.com/releases/v5.7.2/css/all.css";
    * {
        margin: 0;
        font-family: 'Roboto', sans-serif;
    }
    .content {
        max-width: 90%;
        margin: 0 auto;
    }
    .hide {
        display: none;
    }
    #cross {
        top: 20px;
        left: 20px;
        position: absolute;
        max-width: 25px;
    }
    .search_bar {
        margin-top: 30px;
        padding: 4px;
    }
    .customer_table {
        display: grid;
        grid-template-columns: auto auto;
        padding-top: 10px;
        z-index: 0;
        padding-left: 0;
    }
    .customer_form {
        z-index: 1;
        position: absolute;
        top: 160px;
        left: 30%;
        background: white;
        border: 1px solid grey;
        border-radius: 5px;
        padding: 80px;
    }
    #submit_button {
        float: right;
        margin-top: 20px;
        color: white;
        background: #A4BF18;
        text-align: center;
        border: none;
        padding: 10px;
        border-radius: 5px;
        text-decoration: none;
    }
    .form_field {
        margin-top: 15px;
    }
    .customer_name {
        font-size: 14px;
        color: #0b3d1b;
        text-align: center;
        border: solid 1px #9fafa5;
        border-radius: 5px;
        margin: 5px;
        padding: 5px;
    }
        .customer_name:hover {
            color: white;
            background: #a4bf18;
            border: solid 1px #9fafa5;
        }

				.customer_name:focus {
            color: white;
            background: #0B3D1B;
            border: solid 1px #9fafa5;
        }
    .search_bar input {
        min-width: 96%;
        height: 23px;
        border-radius: 12px;
        border: 1px solid #9fafa5;
        padding: 2px;
    }
    .search_bar img {
        height: 23px;
        float: right;
        margin-top: 3px;
    }
    .button {
        color: white;
        background: #A4BF18;
        text-align: center;
        width: 300px;
        padding: 10px;
        border-radius: 5px;
        text-decoration: none;
    }
        .button:hover {
            background: #0B3D1B;
        }
    .footer_buttons {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: white;
        min-height: 63px;
        max-height:63px;
        text-align: center;
        box-shadow: 0px -10px 10px #e5e5e5;
    }
    .left_button {
        float: left;
        width: 150px;
        margin-left: 30px;
        margin-top: 12px;
    }
    .right_button {
        float: right;
        width: 150px;
        margin-right: 30px;
        margin-top: 12px;
    }
    #selectedCustomerName {
        text-align: center;
        padding-top: 10px;
    }

		.navbar-custom {
			background-color: #A4BF18;
	}
</style>