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
import allPegawai from './../store/pegawai.json'
import bupati from './../store/bupati.json'
import axios from 'axios'

export default {
  name: 'home',
  data () {
    return {
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
      this.button.masuk.disable = !this.button.masuk.disable
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
            this.$session.set('onLogin', login.username)
            this.$router.push({
              name: 'admin-simpati',
              params: {
                userId: this.$session.get('onLogin')
              }
            })
          } else {
            let aPegawai = allPegawai.find(el => { return el.nip === login.username })
            let atasan = []
            atasan.push(allPegawai.find(el => { return el.id === aPegawai.atasan }))
            if (atasan[0].atasan !== null) {
              do {
                atasan.push(allPegawai.find(el => { return el.id === atasan[atasan.length - 1].atasan }))
              } while (atasan[atasan.length - 1].atasan !== null)
            }
            atasan = atasan.filter(el => { return parseInt(el.eselon) < 40 })
            atasan.push(bupati)
            if (atasan.filter(el => { return el.nama_jabatan === 'Asisten Administrasi Umum' }).length === 0) {
              atasan.push(allPegawai.filter(el => { return el.nama_jabatan === 'Asisten Administrasi Umum' })[0])
            }
            if (atasan.filter(el => { return el.nama_jabatan === 'Asisten Pemerintahan dan Kesejahteraan Rakyat' }).length === 0) {
              atasan.push(allPegawai.filter(el => { return el.nama_jabatan === 'Asisten Pemerintahan dan Kesejahteraan Rakyat' })[0])
            }
            console.log(atasan)
            this.$session.set('onLogin', login.username)
            this.$router.push({
              name: 'simpati',
              params: {
                userId: this.$session.get('onLogin'),
                data: aPegawai,
                atasan: atasan
              }
            })
          }
        } else {
          this.popup.onShow = !this.popup.onShow
        }
        this.button.masuk.disable = !this.button.masuk.disable
      })
    }
  },
  beforeCreate () {
    if (this.$session.get('session-id') !== undefined && this.$session.get('onLogin') !== undefined) {
      if (this.$session.get('onLogin').includes('admin')) {
        this.$router.push({
          name: 'admin-simpati',
          params: {
            userId: this.$session.get('onLogin')
          }
        })
      } else {
        let aPegawai = allPegawai.find(el => { return el.nip === this.$session.get('onLogin') })
        let atasan = []
        atasan.push(allPegawai.find(el => { return el.id === aPegawai.atasan }))
        if (atasan[0].atasan !== null) {
          do {
            atasan.push(allPegawai.find(el => { return el.id === atasan[atasan.length - 1].atasan }))
          } while (atasan[atasan.length - 1].atasan !== null)
        }
        atasan = atasan.filter(el => { return parseInt(el.eselon) < 40 })
        atasan.push(bupati)
        if (atasan.filter(el => { return el.nama_jabatan === 'Asisten Administrasi Umum' }).length === 0) {
          atasan.push(allPegawai.filter(el => { return el.nama_jabatan === 'Asisten Administrasi Umum' })[0])
        }
        if (atasan.filter(el => { return el.nama_jabatan === 'Asisten Pemerintahan dan Kesejahteraan Rakyat' }).length === 0) {
          atasan.push(allPegawai.filter(el => { return el.nama_jabatan === 'Asisten Pemerintahan dan Kesejahteraan Rakyat' })[0])
        }
        if (aPegawai !== undefined) {
          this.$router.push({
            name: 'simpati',
            params: {
              userId: this.$session.get('onLogin'),
              data: aPegawai,
              atasan: atasan
            }
          })
        }
      }
    }
  },
  created () {
    // axios({
    //   url: 'https://cuti.bkpsdmsitubondo.id/pdf/',
    //   method: 'get',
    //   responseType: 'blob',
    //   params: {
    //     nip_pegawai: '002'
    //   }
    // }).then(res => {
    //   let x = window.URL.createObjectURL(res.data)
    //   console.log(x)
    //   this.pdf = x
    // })
  }
}
</script>
