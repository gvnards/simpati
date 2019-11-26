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
      console.log(login)

      let cb = allPegawai.find(el => {
        return el.nip === login.username
      })

      if (cb !== undefined) {
        this.$session.set('onLogin', cb.nip)
        this.$router.push(`/${cb.nip}/layanan-simpati`)
      } else {
        //
      }
    }
  },
  created () {
    // console.log(this.$session.getAll())
  }
}
</script>
