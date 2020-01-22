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
            // url: 'https://server.cuti.bkpsdmsitubondo.id/',
            url: 'http://127.0.0.1/php_class/',
            params: {
              onGet: 'GetDataAdmin',
              nip: router.app.$session.get('onLogin')
            }
          }).then(res => {
            axios({
              method: 'get',
              // url: 'https://server.cuti.bkpsdmsitubondo.id/',
              url: 'http://127.0.0.1/php_class/',
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
            // url: 'https://server.cuti.bkpsdmsitubondo.id/',
            url: 'http://127.0.0.1/php_class/',
            params: {
              onGet: 'AllPegawai'
            }
          }).then(res => {
            next()
            let allPegawai = res.data
            store.commit('SET_PEGAWAI', res.data)
            let aPegawai = allPegawai.find(el => { return el.nip === router.app.$session.get('onLogin') })
            let atasan = []
            if (aPegawai.nama_opd.includes('Pendidikan')) {
              atasan.push(allPegawai.find(el => { return el.nama_jabatan.includes('Kepala Dinas Pendidikan') }))
            } else {
              atasan.push(allPegawai.find(el => { return el.id === aPegawai.atasan }))
            }
            if (atasan[0].atasan !== null) {
              do {
                atasan.push(allPegawai.find(el => { return el.id === atasan[atasan.length - 1].atasan }))
              } while (atasan[atasan.length - 1].atasan !== null)
            }
            atasan = atasan.filter(el => { return parseInt(el.eselon) < 40 })
            atasan.push(bupati)
            if (atasan.filter(el => { return el.nama_jabatan === 'Asisten Administrasi Umum' }).length === 0) {
              atasan.push(allPegawai.find(el => { return el.nama_jabatan === 'Asisten Administrasi Umum' }))
            }
            if (atasan.filter(el => { return el.nama_jabatan === 'Asisten Pemerintahan dan Kesejahteraan Rakyat' }).length === 0) {
              atasan.push(allPegawai.find(el => { return el.nama_jabatan === 'Asisten Pemerintahan dan Kesejahteraan Rakyat' }))
            }
            if (aPegawai !== undefined) {
              router.push({
                name: 'simpati',
                params: {
                  userId: router.app.$session.get('onLogin'),
                  data: aPegawai,
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
