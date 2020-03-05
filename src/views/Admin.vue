<template>
  <div id="simpati">
    <div class="loads" v-if="$store.state.sync">
      <div class="loading_ text-white">
        <img src="./../assets/ico/sync.svg" :class="$store.state.sync ? 'rotating' : ''" alt="" srcset="">
        <p>Sedang sinkronisasi akun pegawai...</p>
        <p>Membutuhkan waktu 10 - 15 menit, harap menunggu...</p>
      </div>
    </div>
    <Menu class="a" :admin="true" :dataPegawai="dataPegawai" :currMenu="currMenu"  @changeCurrMenu="changeCurrMenu($event)"/>
    <Content class="b" :dataPegawai="dataPegawai" :currMenu="currMenu" />
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
import Content from '@/components/ContentAdmin.vue'

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
      dataAtasan: [],
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
    }
  },
  beforeMount () {
    this.dataPegawai = this.$route.params.data
  }
}
</script>

<style lang="less" scoped>
#simpati {
  display: flex;
  .a {
    min-width: 240px;
  }
  .b {
    overflow: auto;
    max-height: 100vh;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }
    &::-webkit-scrollbar-track {
      background: #EEEEEE;
    }
    &::-webkit-scrollbar-thumb {
      background: #DADADA;
      &:hover {
        background-color: #AAAAAA;
      }
    }
  }
  .loads {
    min-width: 480px;
    width: 100vw;
    height: 100vh;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10;
    .loading_ {
      text-align: center;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      .rotating {
        animation-duration: 2s;
        animation-name: loops;
        animation-iteration-count: infinite;
        animation-direction: normal;
        @keyframes loops {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      }
    }
  }
}
</style>
