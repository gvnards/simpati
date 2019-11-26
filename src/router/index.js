/* eslint-disable no-console */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Simpati from '@/views/Simpati.vue'

import allPegawai from './../store/pegawai.json'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (this.a.app.$session.get('session-id') !== undefined && this.a.app.$session.get('onLogin') !== undefined) {
        if (allPegawai.find(e => e.nip === this.a.app.$session.get('onLogin')) !== undefined) {
          next(`/${this.a.app.$session.get('onLogin')}/layanan-simpati`)
        }
      }
      console.log('================ TO ================')
      console.log(to)
      console.log('================ FROM ================')
      console.log(from)
      console.log('================ NEXT ================')
      console.log(next)
      next()
    }
  },
  {
    path: '/:userId/layanan-simpati',
    name: 'layanan-simpati',
    component: Simpati,
    beforeEnter: (to, from, next) => {
      let pegawaiExist = allPegawai.find(e => e.nip === this.a.app.$session.get('onLogin'))
      if (from.name !== 'home') {
        if (this.a.app.$session.get('session-id') !== undefined && this.a.app.$session.get('onLogin') !== undefined) {
          if (pegawaiExist !== undefined) {
            to.params.data = pegawaiExist
            next()
          }
        } else {
          next('/')
        }
      } else {
        to.params.data = pegawaiExist
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
