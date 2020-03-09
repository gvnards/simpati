<template>
  <div id="content">
    <Header :dataPegawai="dataPegawai" :currMenu="currMenu"></Header>
    <div class="fill-content">
      <Dashboard :dataPegawai="dataPegawai" v-if="currMenu.includes('Dasbor')"></Dashboard>
      <!-- Usulan -->
      <CutiAdmin :currMenu="currMenu" :dataPegawai="dataPegawai" v-if="currMenu.includes('Cuti')" />
      <ProsesBupati :currMenu="currMenu" :dataPegawai="dataPegawai" v-if="currMenu.includes('Proses ke Bupati')" />
      <!-- Akun -->
      <Akun :currMenu="currMenu" v-if="currMenu.includes('Akun')" />
      <!-- Atur Jumlah Cuti Tahunan -->
      <CountCutiTahunan :currMenu="currMenu" :dataPegawai="dataPegawai" v-if="currMenu.includes('Jumlah Cuti Tahunan')" />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import CutiAdmin from '@/components/CutiAdmin.vue'
import Akun from '@/components/Account.vue'
import CountCutiTahunan from '@/components/CountCutiTahunan.vue'
import ProsesBupati from '@/components/ProsesBupati.vue'
import Dashboard from '@/components/Dashboard.vue'

export default {
  props: ['currMenu', 'dataPegawai'],
  components: {
    Header,
    Dashboard,
    CutiAdmin,
    Akun,
    CountCutiTahunan,
    ProsesBupati
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
