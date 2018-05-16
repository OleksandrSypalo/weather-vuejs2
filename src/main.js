import Vue from 'vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from '@/App'
import Application from '@/components/Application'
import Navbar from '@/components/Navbar.vue'

Vue.component('component-navbar', Navbar);

// Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(BootstrapVue);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/:city?',
      name: 'Application',
      component: Application
    }
  ]
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
