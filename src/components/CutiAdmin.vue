<template>
  <div>
    <div class="header-wrapper">
      <p>{{ currMenu[1] }} <span>Daftar {{ currMenu[1] }}</span></p>
    </div>
    <div class="saring-wrapper">
      <p>Saring</p>
      <div class="form-group saring-tahun">
        <select class="form-control" id="atasanLangsung" v-model="saring.tahun" required>
          <option value="" hidden selected>Pilih Tahun</option>
          <option v-for="(tahun, index) in listYear" :key="index" :value="tahun">{{ tahun }}</option>
        </select>
      </div>
    </div>
    <div class="tab">
      <div class="tab-nav">
        <div v-for="(nav, index) in tabs.nav" :key="index" class="active">{{ nav }}</div>
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col" class="text-center">No</th>
            <th scope="col" class="text-center">Nama Pegawai</th>
            <th scope="col" class="text-center">Cuti</th>
            <th scope="col" class="text-center">Alasan</th>
            <th scope="col" class="text-center">Tanggal</th>
            <th scope="col" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataSurat" :key="index">
            <th scope="row" class="text-center">{{ ((pagination.current - 1) * pagination.fetch) + (index + 1) }}</th>
            <td class="text-center">{{ namaPegawai(item) }}</td>
            <td class="text-center">{{ item.jenis.split('Cuti')[1] }}</td>
            <td>{{ item.alasan }}</td>
            <td class="text-center">{{ item.tglAwal.split(' ')[0] }} <i>s/d</i> {{ item.tglAkhir.split(' ')[0] }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-info" data-toggle="modal" @click="onShowUsulan(item)" data-target="#exampleModalScrollable">Lihat Usulan</button>
              <button class="btn btn-sm btn-danger" @click="delUsulan = item; popup.onShow = true" v-if="tabs.active === 'Usulan Cuti'">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- pagination -->
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item" v-for="(item, index) in pagination.max" :key="index" :class="pagination.current === item ? 'disabled':''" @click="pagination.current = item">
          <a class="page-link" href="#" :tabindex="pagination.current === item ? '-1':''">{{ item }}</a>
        </li>
      </ul>
    </nav>
    <!-- end pagination -->
    <ModalCuti :tambahCutiModal="tambahCutiModal" :dataPegawai="dataPegawai" :edit="usulan.edit" :url="usulan.url" :data="usulan.data" @getSurat="getSurat"></ModalCuti>
  </div>
</template>

<script>
import axios from 'axios'
import allPangkat from '@/store/pangkat.json'
import bupati from '@/store/bupati.json'
import ModalCuti from '@/components/modals/CutiAdmin.vue'
import store from '../store'
export default {
  components: {
    ModalCuti
  },
  props: {
    currMenu: '',
    dataPegawai: {}
  },
  watch: {
    'saring.tahun' (val) {
      this.getSurat()
      this.getCountSurat()
    }
  },
  data () {
    return {
      allPegawai: [],
      tambahCutiModal: 0,
      saring: {
        tahun: ''
      },
      pagination: {
        current: 1,
        max: 1,
        fetch: 10 // maksimal get surat
      },
      tabs: {
        nav: ['Usulan']
      },
      dataSurat: [],
      usulan: {
        edit: false,
        data: {},
        url: ''
      }
    }
  },
  computed: {
    listYear () {
      let now = new Date(Date.now()).getFullYear()
      return [now, now - 1, now - 2]
    },
    listMonth () {
      return ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'Nopember', 'Desember']
    }
  },
  methods: {
    getCountSurat () {
      axios({
        method: 'get',
        // url: 'https://server.cuti.bkpsdmsitubondo.id',
        url: 'http://127.0.0.1/php_class/',
        params: {
          onGet: 'CountAllSurat',
          filterTahun: this.saring.tahun === '' ? new Date(Date.now()).getFullYear() : this.saring.tahun
        }
      }).then(res => {
        this.pagination.max = res.data.count <= this.pagination.fetch ? 0 : Math.ceil(res.data.count / this.pagination.fetch)
      })
    },
    masaKerja (data) {
      let tmt = data.nip.slice(8, 14)
      tmt = new Date(`${tmt.slice(4)}/01/${tmt.slice(0, 4)}`)
      let dateNow = new Date(Date.now())
      let diffTime = Math.abs(dateNow - tmt)
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return `${Math.floor(diffDays / 365)} Tahun ${Math.floor((diffDays % 365) / 30)} Bulan ${(diffDays % 365) % 30} Hari`
    },
    dateMonthToString (month) {
      return this.listMonth[month]
    },
    namaPegawai (item) {
      return this.allPegawai.find(el => { return parseInt(el.id) === item.idPegawai }).nama
    },
    getSurat () {
      axios({
        method: 'get',
        // url: 'https://server.cuti.bkpsdmsitubondo.id/',
        url: 'http://127.0.0.1/php_class/',
        params: {
          onGet: 'GetAllSurat',
          current: (this.pagination.current - 1) * this.pagination.fetch,
          fetch: this.pagination.fetch,
          filterTahun: this.saring.tahun === '' ? new Date(Date.now()).getFullYear() : this.saring.tahun
        }
      }).then(res => {
        this.dataSurat = res.data.surat
      })
    },
    onShowUsulan (data) {
      this.usulan.edit = false
      this.tambahCutiModal = 1
      setTimeout(() => {
        this.tambahCutiModal = 0
      }, 100)
      this.usulan.edit = true
      this.usulan.data = data

      let pegawais = this.allPegawai.filter(el => { return parseInt(el.id) === data.idPegawai || parseInt(el.id) === data.idAtasan || parseInt(el.id) === data.idPejabat })
      let pegawai = pegawais.find(el => { return parseInt(el.id) === data.idPegawai })
      let atasan = data.idAtasan === 0 ? bupati : pegawais.find(el => { return parseInt(el.id) === data.idAtasan })
      let pejabat = data.idPejabat === 0 ? bupati : pegawais.find(el => { return parseInt(el.id) === data.idPejabat })
      let tanggalSurat = new Date(data.createdAt)
      this.usulan.url = ''
      axios({
        // url: 'https://cuti.bkpsdmsitubondo.id/pdf/',
        url: 'http://127.0.0.1/fpdf/',
        method: 'get',
        responseType: 'blob',
        params: {
          tanggal_surat: `Situbondo, ${tanggalSurat.getDate()} ${this.dateMonthToString(tanggalSurat.getMonth())} ${tanggalSurat.getFullYear()}`,
          nip_pegawai: pegawai.nip,
          nama_pegawai: pegawai.nama,
          jabatan_pegawai: pegawai.nama_jabatan,
          pangkat_pegawai: allPangkat[pegawai.GOL_NAMA],
          golongan_pegawai: pegawai.GOL_NAMA,
          masa_kerja_pegawai: this.masaKerja(pegawai),
          opd_pegawai: pegawai.nama_opd,
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
          pangkat_atasan: data.idAtasan === 0 ? '' : allPangkat[atasan.GOL_NAMA],
          pengesahan_atasan: data.statusPengesahanAtasan,
          alasan_pengesahan_atasan: data.alasanPengesahanAtasan === null ? '' : data.alasanPengesahanAtasan,
          nip_pejabat: pejabat.nip,
          nama_pejabat: pejabat.nama,
          jabatan_pejabat: pejabat.nama_jabatan,
          pangkat_pejabat: data.idPejabat === 0 ? '' : allPangkat[pejabat.GOL_NAMA],
          eselon_pejabat: parseInt(pejabat.eselon),
          pengesahan_pejabat: data.statusPengesahanPejabat,
          alasan_pengesahan_pejabat: data.alasanPengesahanPejabat === null ? '' : data.alasanPengesahanPejabat
        }
      }).then(res => {
        let urls = window.URL.createObjectURL(res.data)
        this.usulan.url = urls
      })
    }
  },
  created () {
    this.allPegawai = store.state.pegawai
    this.getSurat()
    this.getCountSurat()
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
.table-wrapper {
  overflow: auto;
  height: 540px;
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
.saring-wrapper {
  margin: 10px 0px;
  display: flex;
  align-items: center;
  p {
    color: #747474;
  }
  .saring-bulan {
    width: 180px;
    margin-left: 10px;
  }
  .saring-tahun {
    width: 140px;
    margin-left: 20px;
  }
}
</style>
