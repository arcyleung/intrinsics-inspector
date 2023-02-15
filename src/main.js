import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import { Quasar } from 'quasar'
import iconSet from 'quasar/icon-set/svg-fontawesome-v6'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import "@quasar/extras/material-symbols-outlined/material-symbols-outlined.css";

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)
app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
    iconSet: iconSet,
  })
app.mount('#app')