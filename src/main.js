import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

import Lang from 'vue-lang'

import VueSession from 'vue-session'

import VueTelInput from 'vue-tel-input'

Vue.use(Lang, {
  lang: 'id',
  locales: {
    'id': require('./locale/id'),
    'en': require('./locale/en')
  }
})
Vue.use(VueSession, {
  persist: true
})
Vue.use(VueTelInput)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
