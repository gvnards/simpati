/* eslint-disable no-console */
import Vue from 'vue'
import VueRouter from 'vue-router'
import PageNotFound from '@/views/PageNotFound.vue'
import Home from '@/views/Home.vue'
import Simpati from '@/views/Simpati.vue'
import Admin from '@/views/Admin.vue'

import axios from 'axios'
import bupati from './../store/bupati.json'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (router.app.$session.get('session-id') !== undefined && router.app.$session.get('onLogin') !== undefined) {
        if (router.app.$session.get('onLogin').includes('admin')) {
          axios({
            method: 'get',
            url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
            params: {
              onGet: 'GetDataAdmin',
              nip: router.app.$session.get('onLogin')
            }
          }).then(res => {
            axios({
              method: 'get',
              url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
              params: {
                onGet: 'AllPegawai'
              }
            }).then(ress => {
              store.commit('SET_PEGAWAI', ress.data)
              next()
              router.push({
                name: 'admin-simpati',
                params: {
                  userId: router.app.$session.get('onLogin'),
                  data: res.data.dataAdmin
                }
              })
            })
          })
        } else {
          axios({
            method: 'get',
            url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
            params: {
              onGet: 'AllPegawai',
              nip: router.app.$session.get('onLogin')
            }
          }).then(res => {
            next()
            store.commit('SET_PEGAWAI', res.data.pegawai)
            let atasan = res.data.atasan
            atasan.push(bupati)
            store.commit('SET_ATASAN', atasan)
            if (store.state.pegawai !== undefined) {
              router.push({
                name: 'simpati',
                params: {
                  userId: router.app.$session.get('onLogin'),
                  data: store.state.pegawai,
                  atasan: atasan
                }
              })
            }
          })
        }
      } else {
        next()
      }
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
