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
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : '/home/cutibkpsdmsit/public_html/server/',
        params: {
          onGet: 'UserLogin',
          nip: login.username,
          password: login.password
        }
      }).then(res => {
        this.button.masuk.disable = false
        return res.data.loggedIn
      }).then(res => {
        if (res) {
          if (login.username.includes('admin')) {
            axios({
              method: 'get',
              url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : '/home/cutibkpsdmsit/public_html/server/',
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
              url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : '/home/cutibkpsdmsit/public_html/server/',
              params: {
                onGet: 'AllPegawai',
                nip: login.username
              }
            }).then(res => {
              store.commit('SET_PEGAWAI', res.data.pegawai)
              let atasan = res.data.atasan
              atasan.push(bupati)
              store.commit('SET_ATASAN', atasan)
              this.$session.set('onLogin', login.username)
              this.$router.push({
                name: 'simpati',
                params: {
                  userId: this.$session.get('onLogin'),
                  data: store.state.pegawai,
                  atasan: store.state.atasan
                }
              })
              return axios({
                method: 'post',
                url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : '/home/cutibkpsdmsit/public_html/server/',
                data: {
                  onPost: 'InsertJumlahCuti',
                  idPegawai: store.state.pegawai.id
                }
              })
            }).then(_ => {
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
  }
}
</script>
