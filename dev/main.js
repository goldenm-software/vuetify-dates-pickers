import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'

import '$dev/assets/application.scss'

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
