<template>
  <div>
    <Login @login="login($event)"/>
  </div>
</template>

<script>
import Login from '@/components/Login.vue'
import allPegawai from './../store/pegawai.json'

export default {
  name: 'home',
  data () {
    return {
      //
    }
  },
  components: {
    Login
  },
  methods: {
    login (login) {
      let pegawaiExist = allPegawai.find(el => {
        return el.nip === login.username
      })

      if (pegawaiExist !== undefined) {
        this.$session.set('onLogin', pegawaiExist.nip)
        this.$router.push({
          name: 'layanan-simpati',
          params: {
            userId: this.$session.get('onLogin'),
            data: pegawaiExist
          }
        })
      } else {
        //
      }
    }
  },
  created () {
    console.log(this.$session.getAll())
  },
  beforeCreate () {
    if (this.$session.get('session-id') !== undefined && this.$session.get('onLogin') !== undefined) {
      let pegawaiExist = allPegawai.find(e => e.nip === this.$session.get('onLogin'))
      if (pegawaiExist !== undefined) {
        this.$router.push({
          name: 'layanan-simpati',
          params: {
            userId: this.$session.get('onLogin'),
            data: pegawaiExist
          }
        })
      }
    }
  }
}
</script>
