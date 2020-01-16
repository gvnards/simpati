/* eslint-disable no-console */
import Vue from 'vue'
import VueRouter from 'vue-router'
import PageNotFound from '@/views/PageNotFound.vue'
import Home from '@/views/Home.vue'
import Simpati from '@/views/Simpati.vue'
import Admin from '@/views/Admin.vue'

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
    name: 'simpati',
    component: Simpati,
    beforeEnter: (to, from, next) => {
      if (from.name !== 'home') {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/:userId/layanan-simpati',
    name: 'admin-simpati',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (from.name !== 'home') {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '*/page-not-found',
    name: 'page-not-found',
    component: PageNotFound
  },
  {
    path: '*',
    beforeEnter: (to, from, next) => {
      window.location.assign('/page-not-found')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
