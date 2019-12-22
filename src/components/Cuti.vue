<template>
  <div>
    <div class="header-wrapper">
      <p>{{ currMenu[1] }} <span>Daftar {{ currMenu[1] }} Pribadi</span></p>
      <button class="btn btn-sm btn-primary btn-add" @click="tambahCuti()" data-toggle="modal" data-target="#exampleModalScrollable"><img src="./../assets/ico/add.svg" alt="" srcset="">Tambah</button>
    </div>
    <div class="tab">
      <div class="tab-nav">
        <div v-for="(nav, index) in tabs.nav" :key="index" :style="((dataPegawai.eselon === '' || dataPegawai.eselon.includes('4')) && nav === 'Pengesahan') ? 'cursor: not-allowed;':''" :class="nav===tabs.active ? 'active':''" @click="tabActive(nav)">{{ nav }}</div>
      </div>
    </div>
    <div style="overflow: auto; max-height: 540px;">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col" class="text-center">No</th>
            <th scope="col" class="text-center" v-if="tabs.active!=='Usulan Cuti'">Nama Pegawai</th>
            <th scope="col" class="text-center">Cuti</th>
            <th scope="col" class="text-center">Alasan</th>
            <th scope="col" class="text-center">Tanggal</th>
            <th scope="col" class="text-center" v-if="tabs.active==='Usulan Cuti'">Status</th>
            <th scope="col" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataSurat" :key="index">
            <th scope="row" class="text-center">{{ index + 1 }}</th>
            <td class="text-center" v-if="tabs.active!=='Usulan Cuti'">{{ namaPegawai(item) }}</td>
            <td class="text-center">{{ item.jenis.split('Cuti')[1] }}</td>
            <td>{{ item.alasan }}</td>
            <td class="text-center">{{ item.tglAwal.split(' ')[0] }} <i>s/d</i> {{ item.tglAkhir.split(' ')[0] }}</td>
            <td class="text-center" v-if="tabs.active==='Usulan Cuti'">{{ item.kirimSurat === '1' ? 'Terkirim':'Belum Terkirim' }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-info" data-toggle="modal" @click="onShowUsulan(item)" data-target="#exampleModalScrollable">Lihat Usulan</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalCuti :tambahCutiModal="tambahCutiModal" :dataPegawai="dataPegawai" :edit="usulan.edit" :pengesahan="usulan.pengesahan" :url="usulan.url" :data="usulan.data" @getSuratUsulan="getSuratUsulan"></ModalCuti>
  </div>
</template>

<script>
import ModalCuti from '@/components/modals/Cuti.vue'
import ModalShowUsulan from '@/components/modals/ShowUsulan.vue'
import allPegawai from '@/store/pegawai.json'
import allPangkat from '@/store/pangkat.json'
import axios from 'axios'

export default {
  components: {
    ModalCuti,
    ModalShowUsulan
  },
  props: ['currMenu', 'dataPegawai'],
  data () {
    return {
      tambahCutiModal: 0,
      usulan: {
        edit: false,
        url: '',
        data: {},
        pengesahan: false
      },
      tabs: {
        active: 'Usulan Cuti',
        nav: ['Usulan Cuti', 'Pengesahan']
      },
      dataSurat: []
    }
  },
  watch: {
    'tabs.active' (val) {
      if (val === 'Usulan Cuti') {
        this.getSuratUsulan()
      } else {
        this.getSuratPengesahan()
      }
    }
  },
  methods: {
    namaPegawai (item) {
      return allPegawai.find(el => { return el.id === item.idPegawai }).nama
    },
    tambahCuti () {
      this.usulan.pengesahan = false
      this.usulan.edit = false
      this.tambahCutiModal = 1
      setTimeout(() => {
        this.tambahCutiModal = 0
      }, 100)
    },
    tabActive (tab) {
      if ((this.dataPegawai.eselon === '' || this.dataPegawai.eselon.includes('4')) && tab === 'Pengesahan') {
        return
      }
      this.tabs.active = tab
    },
    getSuratUsulan () {
      axios({
        method: 'get',
        // url: 'https://server.cuti.bkpsdmsitubondo.id',
        url: 'http://127.0.0.1/php_class/',
        params: {
          onGet: 'GetSurat',
          pegawai: this.dataPegawai.id
        }
      }).then(res => {
        this.dataSurat = res.data.surat
      })
    },
    getSuratPengesahan () {
      axios({
        method: 'get',
        // url: 'https://server.cuti.bkpsdmsitubondo.id',
        url: 'http://127.0.0.1/php_class/',
        params: {
          onGet: 'GetSurat',
          pegawai: this.dataPegawai.id,
          pengesahan: true
        }
      }).then(res => {
        console.log(res.data)
        this.dataSurat = res.data.surat
      })
    },
    onShowUsulan (data) {
      this.tambahCuti()
      if (this.tabs.active === 'Usulan Cuti') {
        this.usulan.edit = true
        this.usulan.pengesahan = false
      } else {
        this.usulan.edit = false
        this.usulan.pengesahan = true
      }
      this.usulan.data = data

      let pegawais = allPegawai.filter(el => { return el.id === data.idPegawai || el.id === data.idAtasan || el.id === data.idPejabat })
      let pegawai = pegawais.find(el => { return el.id === data.idPegawai })
      let atasan = pegawais.find(el => { return el.id === data.idAtasan })
      let pejabat = pegawais.find(el => { return el.id === data.idPejabat })
      console.log(data)
      axios({
        // url: 'https://cuti.bkpsdmsitubondo.id/pdf/',
        url: 'http://127.0.0.1/fpdf/',
        method: 'get',
        responseType: 'blob',
        params: {
          nip_pegawai: pegawai.nip,
          nama_pegawai: pegawai.nama,
          jabatan_pegawai: pegawai.nama_jabatan,
          pangkat_pegawai: allPangkat[pegawai.GOL_NAMA],
          golongan_pegawai: pegawai.GOL_NAMA,
          jenis_cuti: data.jenis,
          alasan_cuti: data.alasan,
          alamat_cuti: data.alamat,
          nomor_telepon_cuti: data.nomorTelepon,
          tgl_awal: data.tglAwal.split(' ')[0].split('-').reverse().join('-'),
          tgl_akhir: data.tglAkhir.split(' ')[0].split('-').reverse().join('-'),
          total_hari: data.totalHari,
          nip_atasan: atasan.nip,
          nama_atasan: atasan.nama,
          jabatan_atasan: atasan.nama_jabatan,
          nip_pejabat: pejabat.nip,
          nama_pejabat: pejabat.nama,
          jabatan_pejabat: pejabat.nama_jabatan
        }
      }).then(res => {
        let urls = window.URL.createObjectURL(res.data)
        this.usulan.url = urls
      })
    }
  },
  created () {
    axios({
      method: 'get',
      // url: 'https://server.cuti.bkpsdmsitubondo.id',
      url: 'http://127.0.0.1/php_class/',
      params: {
        onGet: 'GetSurat',
        pegawai: this.dataPegawai.id
      }
    }).then(res => {
      this.dataSurat = res.data.surat
    })
  }
}
</script>

<style lang="less" scoped>
.header-wrapper {
  p {
    display: inline-block;
    font-size: 20px;
    font-weight: 600;
    span {
      font-size: 14px;
      font-weight: 400;
    }
  }
  .btn-add {
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 10px;
    img {
      width: 16px;
      height: 16px;
      margin-bottom: 4px;
      margin-right: 6px;
    }
  }
}
.tab {
  .tab-nav {
    div {
      display: inline-block;
      padding-bottom: 10px;
      margin-right: 10px;
      font-size: 16px;
      font-weight: 600;
      color: #747474;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      &.active {
        color: black !important;
        border-bottom: 2px solid black;
      }
      &:hover {
        color: #4d4d4d;
      }
    }
  }
}
</style>
