<template>
  <div id="content">
    <Header :dataPegawai="dataPegawai" :currMenu="currMenu"></Header>
    <div class="fill-content">
      <!-- Usulan -->
      <CutiAdmin :currMenu="currMenu" :dataPegawai="dataPegawai" v-if="currMenu.includes('Cuti')" />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import CutiAdmin from '@/components/CutiAdmin.vue'

export default {
  props: ['currMenu', 'dataPegawai'],
  components: {
    Header,
    CutiAdmin
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
