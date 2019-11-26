<template>
  <div id="simpati">
    <Menu :dataPegawai="dataPegawai" :currMenu="currMenu"  @changeCurrMenu="changeCurrMenu($event)"/>
    <Content :dataPegawai="dataPegawai" :currMenu="currMenu" />
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
import Content from '@/components/Content.vue'

export default {
  name: 'simpati',
  components: {
    Menu, Content
  },
  data () {
    return {
      dataPegawai: {
        // 'id': '493',
        // 'opd_id': '11',
        // 'unit_kerja': null,
        // 'nama': 'TOTOK SUPRIYADI',
        // 'nip': '196909202006041004',
        // 'jabatan_struktural': '493',
        // 'atasan': '513',
        // 'kelas_jabatan': '6',
        // 'status_pegawai': '1',
        // 'kode_opd': '00011',
        // 'nama_opd': 'Dinas Kesehatan',
        // 'nama_jabatan': 'Pengelola Kepegawaian',
        // 'kelas_jabatan_id': '6',
        // 'jenis_pns': 'PNS',
        // 'TEMPAT_LAHIR_NAMA': 'PORONG',
        // 'TGL_LAHIR': '1969-09-20',
        // 'JENIS_KELAMIN': 'M',
        // 'AGAMA_NAMA': 'Islam',
        // 'JENIS_KAWIN_NAMA': 'Menikah',
        // 'ALAMAT': 'KP. KOM UTARA RT. 005 / RW. 001 DESA WRINGIN ANOM KEC. PANARUKAN KAB. SITUBONDO',
        // 'GOL_NAMA': 'III/a',
        // 'JENIS_JABATAN_NAMA': 'Jabatan Fungsional Umum',
        // 'PENDIDIKAN_ID': 'A5EB03E218F0F6A0E040640A040252AD',
        // 'PENDIDIKAN_NAMA': 'S-1 ILMU ADMINISTRASI NEGARA',
        // 'STATUS_CPNS_PNS': 'P',
        // 'TINGKAT_PENDIDIKAN_ID': '40',
        // 'TINGKAT_PENDIDIKAN_NAMA': 'S-1/Sarjana',
        // 'jenis_jabatan': 'jfu',
        // 'eselon': '',
        // 'TMT_CPNS': '01-04-2006'
      },
      currMenu: ['Dasbor']
    }
  },
  methods: {
    changeCurrMenu (evMenu) {
      this.currMenu = evMenu
      if (this.currMenu.includes('Keluar')) {
        this.$session.clear()
        this.$session.destroy()
        this.$router.push('/')
      }
      console.log(this.currMenu)
    }
  },
  beforeMount () {
    this.dataPegawai = this.$route.params.data
  }
}
</script>

<style lang="less" scoped>
#simpati {
  display: inline-grid;
  grid-template-columns: auto auto;
}
</style>
