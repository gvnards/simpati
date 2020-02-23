<template>
  <div id="content">
    <Header :dataPegawai="dataPegawai" :currMenu="currMenu"></Header>
    <div class="fill-content">
      <!-- Usulan -->
      <CutiAdmin :currMenu="currMenu" :dataPegawai="dataPegawai" v-if="currMenu.includes('Cuti')" />
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

export default {
  props: ['currMenu', 'dataPegawai'],
  components: {
    Header,
    CutiAdmin,
    Akun,
    CountCutiTahunan
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
