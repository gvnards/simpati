<template>
  <div>
    <PopupLogin :success="popupLoginStatus" />
    <Login @login="login($event)" :button="button"/>
  </div>
</template>

<script>
import Login from '@/components/Login.vue'
import PopupLogin from '@/components/modals/PopupLogin.vue'
import bupati from './../store/bupati.json'
import axios from 'axios'
import store from '../store/index.js'
import $ from 'jquery'

export default {
  name: 'home',
  data () {
    return {
      button: {
        masuk: {
          disable: false
        }
      },
      popupLoginStatus: ''
    }
  },
  components: {
    Login, PopupLogin
  },
  methods: {
    login (login) {
      this.button.masuk.disable = true
      axios({
        methods: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
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
              url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
              params: {
                onGet: 'GetDataAdmin',
                nip: login.username
              }
            }).then(res => {
              this.button.masuk.disable = false
              this.$session.set('onLogin', login.username)
              this.$router.push({
                name: 'admin-simpati',
                params: {
                  userId: this.$session.get('onLogin'),
                  data: res.data.dataAdmin
                }
              })
            }).catch(res => {
              $('#modalPopupLogin').trigger('click')
              this.popupLoginStatus = 'gagal'
            })
          } else {
            axios({
              method: 'get',
              url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
              params: {
                onGet: 'AllPegawai',
                nip: login.username
              }
            }).then(res => {
              $('#modalPopupLogin').trigger('click')
              this.popupLoginStatus = 'sukses'
              store.commit('SET_PEGAWAI', res.data.pegawai)
              let atasan = res.data.atasan
              atasan.push(bupati)
              store.commit('SET_ATASAN', atasan)
              this.$session.set('onLogin', login.username)
              return axios({
                method: 'post',
                url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
                data: {
                  onPost: 'InsertJumlahCuti',
                  idPegawai: store.state.pegawai.nip
                }
              })
            }).then(_ => {
              setTimeout(() => {
                this.button.masuk.disable = false
                $('#closeModalPopupLogin').trigger('click')
                this.$router.push({
                  name: 'simpati',
                  params: {
                    userId: this.$session.get('onLogin'),
                    data: store.state.pegawai,
                    atasan: store.state.atasan
                  }
                })
              }, 750)
            }).catch(_ => {
              this.button.masuk.disable = false
            })
          }
        } else {
          this.button.masuk.disable = false
          $('#modalPopupLogin').trigger('click')
          this.popupLoginStatus = 'salah'
        }
      }).catch(res => {
        this.button.masuk.disable = false
        $('#modalPopupLogin').trigger('click')
        this.popupLoginStatus = 'gagal'
      })
    }
  }
}
</script>
