<template>
  <div class="login">
      <h3>Sign In</h3>
			<input name="email" 
						 v-validate="'required|email'" 
						 type="text" 
						 placeholder="Email" 
						 v-model="email"
						 :class="{'has-error': errors.has('email')}"><br>
			<input name="password"
						 v-validate="'required|min:6'" 
						 type="password" 
						 placeholder="Password" 
						 v-model="password"
						 @keyup.enter="validate"
						 :class="{'has-error': errors.has('password')}"><br>
			<p v-if="errors.has('email')" class="alert-danger">{{ errors.first('email') }} </p>
			<p v-if="errors.has('password')" class="alert-danger">{{ errors.first('password') }} </p>
			<p class="alert-danger">{{errorMsg}}</p>
			<b-button @click="signOut" variant="outline-danger">Sign Out</b-button>
			<b-button @click="validate" variant="outline-primary" @keyup.enter="validate">Sign In</b-button>
			<!-- <p>Dont have an account ? <router-link to="/SignUp">Create one</router-link></p> -->
			<p>Forgot Password ? <router-link to="/ResetPassword">Reset</router-link></p>
			<p><router-link to="/Stocktable">Back to stock table</router-link></p>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
	import 'firebase/auth';
	
	export default {
		name: 'Login',
		data() {
			return {
				email: '',
				password: '',
				errorMsg: '',
			};
		},
		methods: {
			validate() {
      this.$validator.validateAll().then(() => {
        this.signIn();
      }).catch(() => {
				alert(this.errors.all());
      })
    	},	
			signIn() {
				firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
					(user) => {
						localStorage.setItem("logged", true);
						this.$router.replace('StockTable');
					},
					(err) => {
						this.errorMsg = err.message;
					}
				);
			},
			signOut() {
				firebase.auth().signOut().then(() => {
          localStorage.removeItem("logged");
          this.$router.replace('StockTable');
				});
			}
	}
  }
</script>

<style scoped>  
 .login {
	 margin-top: 40px;
 }
 input {
	 margin: 5px 0;
	 width: 20%;
	 padding: 15px;
 }
 button {
	 cursor: pointer;
 }
 p {
	 margin-top: 5px;
	 font-size: 13px;
 }
 p a {
	 text-decoration: underline;
	 cursor: pointer;
 }
 .alert-danger {
  color: red;
	background-color: white;
}
.has-error {
  border-color: red;
}

@media only screen and (max-width : 768px) {
	input {
	 width: 80%;
  }
}

</style>