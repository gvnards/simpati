<template>
  <div id="content">
    <Header :dataPegawai="dataPegawai" :currMenu="currMenu"></Header>
    <button class="btn btn-md btn-primary" @click="c()">Connect</button>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import axios from 'axios'

export default {
  props: ['currMenu', 'dataPegawai'],
  components: {
    Header
  },
  methods: {
    c () {
      axios({
        method: 'get',
        url: 'https://server.cuti.bkpsdmsitubondo.id/',
        params: {
          onGet: 'UserLogin',
          nip: 'admin',
          password: 'admin'
        }
      }).then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
#content {
  background-color: #ECF0F5;
  width: calc(100vw - 240px);
  min-width: 240px;
  padding: 10px 20px;
}
</style>
