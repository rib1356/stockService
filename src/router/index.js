import Vue from 'vue'
import Router from 'vue-router'

//Components

//Views
import StartPage from '@/views/StartPage'
import StockTable from '@/views/StockTable'
import BatchInformation from '@/views/BatchInformation'
import newBatch from '@/views/newBatch'
import Login from '@/views/Login'
import SignUp from '@/views/SignUp'
import ResetPassword from '@/views/ResetPassword'
import ContactPage from '@/views/ContactPage'

//Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(BootstrapVue);

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'StockTable' 
    },
    {
      path: '/StartPage',
      name: 'StartPage',
      component: StartPage
    },
    {
      path: '/StockTable',
      name: 'StockTable',
      component: StockTable
    },
    {
      path: '/BatchInformation',
      name: 'BatchInformation',
      component: BatchInformation,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/newBatch',
      name: 'newBatch',
      component: newBatch,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/ResetPassword',
      name: 'ResetPassword',
      component: ResetPassword
    },
    {
      path: '/ContactPage',
      name: 'ContactPage',
      component: ContactPage
    },
  ]
})

//This method is checked before each route is made
router.beforeEach((to, from, next) => {

  let currentUser = firebase.auth().currentUser; //Get the current user from firebase if auth (null if not logged in)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth); //To check if the route we need to go to requires "requiresAuth"
  let logged = localStorage.getItem("logged");

  if(requiresAuth && !logged) { //If the page requires authentication and user isnt logged in redirect
    alert("Please Sign in to access this page");
    next('/');
  } else if(requiresAuth && (currentUser || logged)){ //If page requires authentication and users logged in continue to that page
    next();
  } else { //Otherwise allow for normal navigation
    next();
  }
});

export default router;