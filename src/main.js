import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/svg-fontawesome-v6'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)
app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
    iconSet: quasarIconSet,
  })
app.mount('#app')