import Vue from 'vue'
import Router from 'vue-router'

//Views
import HomePage from '@/views/HomePage'
import StockTable from '@/views/StockTable'
import BatchInformation from '@/views/BatchInformation'
import newBatch from '@/views/newBatch'
import Admin from '@/views/Admin'

//User Pages
import Login from '@/views/UserPages/Login'
import SignUp from '@/views/UserPages/SignUp'
import ResetPassword from '@/views/UserPages/ResetPassword'
import ContactPage from '@/views/UserPages/ContactPage'

//Pricing Pages
import PricingSelection from '@/views/Pricing/PricingSelection'
import BatchPricing from '@/views/Pricing/BatchPricing'

//Quote Pages
import QuoteCreation from '@/views/QuotingSystem/QuoteCreation'
import CustomerInformation from '@/views/QuotingSystem/CustomerInformation'
import ExistingQuotes from '@/views/QuotingSystem/ExistingQuotes'
import EditQuote from '@/views/QuotingSystem/EditQuote'

//Picking List Pages 
import PlantAllocation from '@/views/PickingList/PlantAllocation'
import PickListFinalisation from '@/views/PickingList/PickListFinalisation'

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
      path: '/HomePage',
      name: 'HomePage',
      component: HomePage,
      meta: {
        requiresAuth: true
      }
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
    {
      path: '/QuoteCreation',
      name: 'QuoteCreation',
      component: QuoteCreation,
    },
    {
      path: '/CustomerInformation',
      name: 'CustomerInformation',
      component: CustomerInformation
    },
    {
      path: '/ExistingQuotes',
      name: 'ExistingQuotes',
      component: ExistingQuotes
    },
    {
      path: '/EditQuote',
      name: 'EditQuote',
      component: EditQuote
    },
    {
      path: '/Pricing',
      name: 'PricingSelection',
      component: PricingSelection
    },
    {
      path: '/BatchPricing',
      name: 'BatchPricing',
      component: BatchPricing
    },
    {
      path: '/PlantAllocation',
      name: 'PlantAllocation',
      component: PlantAllocation
    },
    {
      path: '/PickListFinalisation',
      name: 'PickListFinalisation',
      component: PickListFinalisation
    },
    {
      path: '/Admin',
      name: 'Admin',
      component: Admin,
      meta: {
        requiresAuth: true
      }
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