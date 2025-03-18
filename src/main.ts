import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import App from './App.vue'
import router from './router'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'
import clickAway from '@/directives/clickAway'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ar,
  },
})

const app = createApp(App)

app.directive('click-away', clickAway)

app.use(Vue3Toastify, {
  autoClose: 2000,
  position: toast.POSITION.BOTTOM_RIGHT,
})
app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')
