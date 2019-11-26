/* eslint-disable no-console */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Simpati from '@/views/Simpati.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/:userId/layanan-simpati',
    name: 'layanan-simpati',
    component: Simpati,
    beforeEnter: (to, from, next) => {
      if (from.name !== 'home') {
        next('/')
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
