import Vue from 'vue'
import Router from 'vue-router'

//Components

//Views
import StartPage from '@/views/StartPage'
import StockTable from '@/views/StockTable'
import BatchInformation from '@/views/BatchInformation'
import newBatch from '@/views/newBatch'

//Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue);

Vue.use(Router)

export default new Router({
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
      component: BatchInformation
    },
    {
      path: '/newBatch',
      name: 'newBatch',
      component: newBatch
    },
  ]
})
