// Main imports
import Vue from 'vue'
import Vuetify from 'vuetify'

// // Vuetify locales
import en from 'vuetify/es5/locale/en'
import es from 'vuetify/es5/locale/es'

const colors = {
  primary: '#001E60',
  secondary: '#00205B',
  accent: '#FF8200'
}

// Create component
Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { en, es },
    current: 'es'
  },

  icons: {
    iconfont: 'mdi',
    values: {
      cancel: 'mdi-close',
      prev: 'mdi-chevron-left',
      next: 'mdi-chevron-right'
    }
  },

  theme: {
    dark: false,
    themes: {
      dark: colors,
      light: colors
    },

    options: {
      customProperties: true
    }
  }
})
