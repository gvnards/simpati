<template>
  <div>
    <Login @login="login($event)" :button="button"/>
    <PopupInfo :onShow="popup.onShow">
      <template v-slot:title>
        Terjadi Kesalahan
      </template>
      <p>Username / Password salah !</p>
      <template v-slot:footer>
        <button type="button" class="btn btn-secondary" @click="popup.onShow = !popup.onShow">Tutup</button>
      </template>
    </PopupInfo>
  </div>
</template>

<script>
import Login from '@/components/Login.vue'
import PopupInfo from '@/components/modals/PopupInfo.vue'
import bupati from './../store/bupati.json'
import axios from 'axios'
import store from '../store/index.js'

export default {
  name: 'home',
  data () {
    return {
      allPegawai: [],
      button: {
        masuk: {
          disable: false
        }
      },
      popup: {
        onShow: false
      },
      pdf: ''
    }
  },
  components: {
    Login, PopupInfo
  },
  methods: {
    login (login) {
      this.button.masuk.disable = true
      axios({
        methods: 'get',
        // url: 'https://server.cuti.bkpsdmsitubondo.id/',
        url: 'http://127.0.0.1/php_class/',
        params: {
          onGet: 'UserLogin',
          nip: login.username,
          password: login.password
        }
      }).then(res => {
        return res.data.loggedIn
      }).then(res => {
        if (res) {
          if (login.username.includes('admin')) {
            axios({
              method: 'get',
              // url: 'https://server.cuti.bkpsdmsitubondo.id/',
              url: 'http://127.0.0.1/php_class/',
              params: {
                onGet: 'GetDataAdmin',
                nip: login.username
              }
            }).then(res => {
              this.$session.set('onLogin', login.username)
              this.$router.push({
                name: 'admin-simpati',
                params: {
                  userId: this.$session.get('onLogin'),
                  data: res.data.dataAdmin
                }
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
              store.commit('SET_PEGAWAI', res.data)
              this.allPegawai = store.state.pegawai

              let aPegawai = this.allPegawai.find(el => { return el.nip === login.username })
              let atasan = []
              if (aPegawai.nama_opd.includes('Pendidikan') || aPegawai.nama_opd.includes('SMPN')) {
                atasan.push(this.allPegawai.find(el => { return el.nama_jabatan.includes('Kepala Dinas Pendidikan') }))
              } else if (aPegawai.nama_opd.includes('UPTD Puskesmas')) {
                let kepalaDinkes = this.allPegawai.find(el => { return el.nama_jabatan === 'Kepala Dinas Kesehatan' })
                if (kepalaDinkes === undefined) {
                  atasan.push(this.allPegawai.find(el => { return parseInt(el.id) === parseInt(this.allPegawai.find(el => { return el.nama_jabatan === 'Kepala UPT Laboratorium Kesehatan' }).atasan) }))
                } else {
                  atasan.push(kepalaDinkes)
                }
              } else {
                atasan.push(this.allPegawai.find(el => { return el.id === aPegawai.atasan }))
              }
              if (atasan[0].atasan !== null) {
                do {
                  atasan.push(this.allPegawai.find(el => { return el.id === atasan[atasan.length - 1].atasan }))
                } while (atasan[atasan.length - 1].atasan !== null)
              }
              atasan = atasan.filter(el => { return parseInt(el.eselon) < 40 })
              atasan.push(bupati)
              if (atasan.filter(el => { return el.nama_jabatan === 'Asisten Administrasi Umum' }).length === 0) {
                atasan.push(this.allPegawai.find(el => { return el.nama_jabatan === 'Asisten Administrasi Umum' }))
              }
              if (atasan.filter(el => { return el.nama_jabatan === 'Asisten Pemerintahan dan Kesejahteraan Rakyat' }).length === 0) {
                atasan.push(this.allPegawai.find(el => { return el.nama_jabatan === 'Asisten Pemerintahan dan Kesejahteraan Rakyat' }))
              }
              this.$session.set('onLogin', login.username)
              this.$router.push({
                name: 'simpati',
                params: {
                  userId: this.$session.get('onLogin'),
                  data: aPegawai,
                  atasan: atasan
                }
              })
              this.button.masuk.disable = false
            }).catch(_ => {
              this.button.masuk.disable = false
            })
          }
        } else {
          this.popup.onShow = !this.popup.onShow
        }
      })
    }
  },
  created () {
    // this.allPegawai = store.state.pegawai
  }
}
</script>
