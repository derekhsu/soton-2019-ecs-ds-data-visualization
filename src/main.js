import Vue from 'vue'
import BoostrapVue from 'bootstrap-vue'
import App from './App.vue'
import VueFullPage from 'vue-fullpage.js'
import VueTour from 'vue-tour'

import 'vue-tour/dist/vue-tour.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'c3/c3.min.css'


Vue.config.productionTip = false
Vue.use(VueTour)
Vue.use(VueFullPage);
Vue.use(BoostrapVue);
// Vue.use(VueIntro)

new Vue({
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
}).$mount('#app')
