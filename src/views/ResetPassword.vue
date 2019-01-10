<template>
  <div class="ResetPass">
    <h3>Reset Password</h3>
			<p>Password reset will be sent to entered email</p>
			<input name="email" 
						 v-validate="'required|email'" 
						 type="text" 
						 placeholder="Email" 
						 v-model="email"
						 :class="{'has-error': errors.has('email')}"><br>
			<p v-if="errors.has('email')" class="alert-danger">{{ errors.first('email') }} </p>
			<b-button @click="resetPassword" variant="outline-primary">Reset Password</b-button>
			<p>Go back to <router-link to="/Login">Login</router-link></p>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
	import 'firebase/auth';
	
	export default {
		name: 'ResetPass',
		data() {
			return {
				email: '',
			};
		},
		methods: {
			resetPassword() {
				firebase.auth().sendPasswordResetEmail(this.email).then(
					() =>{
					alert("A reset password email has been sent")
					this.$router.push('Login');
        }).catch(function(error) {
          alert("There was an " + error);
        });
			}
		}

  }
</script>

<style scoped>  
 .ResetPass {
	 margin-top: 40px;
 }
 input {
	 margin: 10px 0;
	 width: 20%;
	 padding: 15px;
 }
 button {
	 cursor: pointer;
 }
 p {
	 margin-top: 20px;
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