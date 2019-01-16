// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });
Vue.use(VueAxios, axios)

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyD0AMlMV4a3uaJ1VZMerOMrHVXSKS-Qzjo",
    libraries: "places" // necessary for places input
  }
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDdnzoBXA4ltHDfHrWptPcPVh6_pfOvOwg",
  authDomain: "ahills-stockservice.firebaseapp.com",
  databaseURL: "https://ahills-stockservice.firebaseio.com",
  projectId: "ahills-stockservice",
  storageBucket: "ahills-stockservice.appspot.com",
  messagingSenderId: "638712816739"
};
firebase.initializeApp(config);

Vue.config.productionTip = false
window.event = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
