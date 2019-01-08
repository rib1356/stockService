<template>
  <div class="login">
      <h3>Sign Up</h3>
			<input type="text" placeholder="Email" v-model="email"><br>
			<input type="password" placeholder="Password" v-model="password"><br>
			<button @click="signUp">Sign Up</button>
			<p>Go back to <router-link to="/Login">Login</router-link></p>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
	import 'firebase/auth';
	
	export default {
		name: 'SignUp',
		data() {
			return {
				email: '',
				password: '',
			};
		},
		methods: {
			signUp() {
				firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
					(user) => {
						alert('Account Created');
						this.$router.replace('Login');
					},
					function(err) {
						alert('There was an error: ' + err.message)
					}
				);
			}
		}

  }
</script>

<style scoped>  
 .login {
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
	 margin-top: 40px;
	 font-size: 13px;
 }
 p a {
	 text-decoration: underline;
	 cursor: pointer;
 }
</style>