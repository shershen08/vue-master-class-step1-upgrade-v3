// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import AppDate from '@/components/AppDate'

const app = createApp(App)
  .use(store)
  .use(router)

app.component('AppDate', AppDate)

app.mount('#app')
