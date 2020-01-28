<template>
  <div id="content">
    <Header :dataPegawai="dataPegawai" :currMenu="currMenu"></Header>
    <div class="fill-content">
      <Dashboard :dataPegawai="dataPegawai" v-if="currMenu.includes('Dasbor')"></Dashboard>
      <!-- Usulan -->
      <Cuti :currMenu="currMenu" :dataPegawai="dataPegawai" v-else-if="currMenu.includes('Cuti')"></Cuti>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Dashboard from '@/components/Dashboard.vue'
import Cuti from '@/components/Cuti.vue'

export default {
  props: ['currMenu', 'dataPegawai'],
  components: {
    Header,
    Dashboard,
    Cuti
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
#content {
  background-color: #ECF0F5;
  width: calc(100vw - 240px);
  min-width: 240px;
  padding: 10px 20px;
  overflow: auto;
  .fill-content {
    margin-top: 20px;
  }
}
</style>
