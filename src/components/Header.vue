<template>
  <div>
    <div class="header">
      <div class="text-top">
        <p class="nama">Selamat datang, {{ dataPegawai.nama }}</p>
        <p class="jabatan">{{ dataPegawai.nama_jabatan }}</p>
      </div>
      <div class="icon">
        <img :src="require(`./../assets/ico/${icon}_content.svg`)" alt="" srcset="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['dataPegawai', 'currMenu'],
  computed: {
    icon () {
      if (this.currMenu.includes('Dasbor')) {
        return 'rocket'
      } else if (this.currMenu.includes('Usulan')) {
        return 'add_database'
      } else if (this.currMenu.includes('Akun')) {
        return 'account'
      } else if (this.currMenu.includes('Atur Cuti')) {
        return 'settings'
      }
      return ''
      // return this.currMenu.includes('Dasbor') ? 'rocket' : this.currMenu.includes('Usulan') ? 'add_database' : ''
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  padding-bottom: 23px;
  border-bottom: 2px solid #C4C4C4;
  position: relative;
  .text-top {
    p {
      &.nama {
        font-size: 18px;
        font-weight: 600;
      }
      &.jabatan {
        font-size: 14px;
        color: #747474;
      }
      margin: 0;
    }
  }
  .icon {
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(116, 116, 116, 0.4);
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    img {
      max-width: 30px;
      max-height: 30px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
