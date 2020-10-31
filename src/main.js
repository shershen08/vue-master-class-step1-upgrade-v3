// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import AppDate from '@/components/AppDate'

import connectionData from './firebase-connection'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

firebase.initializeApp(connectionData)

export const db = firebase.firestore()
export const auth = firebase.auth()

const app = createApp(App)
  .use(store)
  .use(router)

app.component('AppDate', AppDate)

app.mount('#app')

