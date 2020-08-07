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
    <div class="tab" style="position: relative;">
      <div class="tab-nav">
        <div v-for="(nav, index) in tabs.nav" :key="index" class="active">{{ nav }}</div>
      </div>
      <div class="input-group" style="max-width: 240px; position: absolute; bottom: 0; right: 0;">
        <input type="text" class="form-control text-left" placeholder="Cari" v-model="search.find">
        <div class="input-group-text bg-white"><img src="./../assets/ico/search.svg" alt="" srcset="" style="width: 20px;"></div>
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
            <td class="text-center">{{ dataPegawaiAdmin.length === 0 ? '' : namaPegawai(item) }}</td>
            <td class="text-center">{{ item.jenis.split('Cuti')[1] }}</td>
            <td>{{ item.alasan }}</td>
            <td class="text-center">{{ item.tglAwal.split(' ')[0] }} <i>s/d</i> {{ item.tglAkhir.split(' ')[0] }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-info" data-toggle="modal" @click="onShowUsulan(item)" data-target="#exampleModalScrollable">Lihat Usulan</button>
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
    'search.find' (val) {
      if (store.state.dataSurat.length > 0) {
        if (val === '') {
          this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
          this.pagination.max = store.state.dataSurat.length <= this.pagination.fetch ? 0 : Math.ceil(store.state.dataSurat.length / this.pagination.fetch)
        } else {
          this.tempDataSurat = store.state.dataSurat.filter(el => { return (el.jenis.toLowerCase().includes(val) || el.nama.toLowerCase().includes(val)) })
          this.dataSurat = this.tempDataSurat
          this.pagination.max = this.dataSurat.length <= this.pagination.fetch ? 0 : Math.ceil(this.dataSurat.length / this.pagination.fetch)
        }
      }
    },
    'saring.tahun' (val) {
      this.getSurat()
    },
    'pagination.current' () {
      if (this.search.find === '') {
        this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
      } else {
        this.dataSurat = this.tempDataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
      }
    }
  },
  data () {
    return {
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
        nav: ['Usulan Cuti']
      },
      usulan: {
        edit: false,
        data: {},
        url: ''
      },
      dataPegawaiAdmin: [],
      tempDataSurat: [],
      dataSurat: [],
      search: {
        find: ''
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
      return this.dataPegawaiAdmin.find(el => { return el.nip === item.idPegawai }).nama
    },
    getSurat () {
      axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          nocache: new Date().getTime(),
          onGet: 'GetSuratAdmin',
          opd_id: parseInt(this.dataPegawai.opd_id),
          filterTahun: this.saring.tahun === '' ? new Date(Date.now()).getFullYear() : this.saring.tahun
        }
      }).then(res => {
        this.dataPegawaiAdmin = res.data.pegawai

        let tempSurat = res.data.surat

        tempSurat.forEach(el => {
          el.nama = this.dataPegawaiAdmin.find(elm => { return elm.nip === el.idPegawai }).nama
        })

        store.commit('SET_DATASURAT', tempSurat)

        this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)

        this.pagination.max = store.state.dataSurat.length <= this.pagination.fetch ? 0 : Math.ceil(store.state.dataSurat.length / this.pagination.fetch)
      })
    },
    getRekapCutiPegawai (data) {
      return axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          nocache: new Date().getTime(),
          onGet: 'GetRekapCutiPegawai',
          id_pegawai: data.idPegawai
        }
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

      let cutiTahunanN = 0
      let cutiTahunanN1 = 0
      let cutiTahunanN2 = 0
      let cutiBesar = 0
      let cutiSakit = 0
      let cutiMelahirkan = 0
      let cutiAlasanPenting = 0
      let cltn = 0

      this.getRekapCutiPegawai(data).then(res => {
        let rekapCutiNonTahunan = res.data.rekapCuti
        let rekapCutiTahunan = res.data.rekapCutiTahunan

        cutiTahunanN += parseInt(rekapCutiTahunan[0].jumlah)
        cutiTahunanN1 += parseInt(rekapCutiTahunan[1].jumlah)
        cutiTahunanN2 += parseInt(rekapCutiTahunan[2].jumlah)

        cutiBesar = rekapCutiNonTahunan.filter(el => el.id_cuti === '5')
        if (cutiBesar.length > 0) {
          let temp = 0
          cutiBesar.forEach(el => {
            temp += parseInt(el.totalHari)
          })
          cutiBesar = temp
        } else {
          cutiBesar = 0
        }
        cutiSakit = rekapCutiNonTahunan.filter(el => el.id_cuti === '2')
        if (cutiSakit.length > 0) {
          let temp = 0
          cutiSakit.forEach(el => {
            temp += parseInt(el.totalHari)
          })
          cutiSakit = temp
        } else {
          cutiSakit = 0
        }
        cutiMelahirkan = rekapCutiNonTahunan.filter(el => el.id_cuti === '6')
        if (cutiMelahirkan.length > 0) {
          let temp = 0
          cutiMelahirkan.forEach(el => {
            temp += parseInt(el.totalHari)
          })
          cutiMelahirkan = temp
        } else {
          cutiMelahirkan = 0
        }
        cutiAlasanPenting = rekapCutiNonTahunan.filter(el => el.id_cuti === '3')
        if (cutiAlasanPenting.length > 0) {
          let temp = 0
          cutiAlasanPenting.forEach(el => {
            temp += parseInt(el.totalHari)
          })
          cutiAlasanPenting = temp
        } else {
          cutiAlasanPenting = 0
        }
        cltn = rekapCutiNonTahunan.filter(el => el.id_cuti === '4')
        if (cltn.length > 0) {
          let temp = 0
          cltn.forEach(el => {
            temp += parseInt(el.totalHari)
          })
          cltn = temp
        } else {
          cltn = 0
        }
        return axios({
          method: 'get',
          url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
          params: {
            nocache: new Date().getTime(),
            onGet: 'AllPegawai',
            nip: data.idPegawai
          }
        })
      }).then(res => {
        let pegawai = res.data.pegawai
        let atasan = res.data.atasan.find(el => { return el.nip === data.idAtasan })
        let pejabat = res.data.atasan
        pejabat.push(bupati)
        pejabat = pejabat.find(el => { return el.nip === data.idPejabat })
        let tanggalSurat = new Date(data.createdAt)
        this.usulan.url = ''
        return axios({
          url: store.state.build === 'dev' ? 'http://127.0.0.1/fpdf/' : 'https://cuti.bkpsdmsitubondo.id/pdf/',
          method: 'get',
          responseType: 'blob',
          params: {
            nocache: new Date().getTime(),
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
            pangkat_atasan: data.idAtasan === ' ' ? '' : allPangkat[atasan.GOL_NAMA],
            pengesahan_atasan: data.statusPengesahanAtasan,
            alasan_pengesahan_atasan: data.alasanPengesahanAtasan === null ? '' : data.alasanPengesahanAtasan,
            nip_pejabat: pejabat.nip,
            nama_pejabat: pejabat.nama,
            jabatan_pejabat: pejabat.nama_jabatan,
            pangkat_pejabat: data.idPejabat === ' ' ? '' : allPangkat[pejabat.GOL_NAMA],
            eselon_pejabat: parseInt(pejabat.eselon),
            pengesahan_pejabat: data.statusPengesahanPejabat,
            alasan_pengesahan_pejabat: data.alasanPengesahanPejabat === null ? '' : data.alasanPengesahanPejabat,
            CTN: cutiTahunanN,
            CTN1: cutiTahunanN1,
            CTN2: cutiTahunanN2,
            CB: cutiBesar,
            CS: cutiSakit,
            CM: cutiMelahirkan,
            CKAP: cutiAlasanPenting,
            CLTN: cltn
          }
        })
      }).then(res => {
        let urls = window.URL.createObjectURL(res.data)
        this.usulan.url = urls
        if (data.suratUpload !== null) {
          this.usulan.url = store.state.build === 'dev' ? `http://127.0.0.1/upload/berkas/cuti-ttd/${data.suratUpload}` : `https://cuti.bkpsdmsitubondo.id/upload/berkas/cuti-ttd/${data.suratUpload}`
        }
      })
    }
  },
  created () {
    this.getSurat()
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
