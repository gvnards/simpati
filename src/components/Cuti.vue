<template>
  <div>
    <div class="header-wrapper">
      <p>{{ currMenu[1] }} <span>Daftar {{ currMenu[1] }} Pribadi</span></p>
      <button class="btn btn-sm btn-primary btn-add" @click="tambahCuti()" data-toggle="modal" data-target="#exampleModalScrollable"><img src="./../assets/ico/add.svg" alt="" srcset="">Tambah</button>
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
    <div style="border-top: 1px solid #74747466; border-bottom: 1px solid #74747466; padding: 4px; margin-bottom: 3px;">
      <img src="./../assets/ico/info.svg" alt="" srcset="" style="width: 24px; opacity: 0.75;">
      <span class="text-muted">Tombol Unggah akan berfungsi jika usulan telah disahkan.</span>
    </div>
    <div class="tab" style="position: relative;">
      <div class="tab-nav">
        <div v-for="(nav, index) in tabs.nav" :key="index" :style="((dataPegawai.eselon === '' || dataPegawai.eselon.includes('4')) && nav === 'Pengesahan') ? 'cursor: not-allowed;':''" :class="nav===tabs.active ? 'active':''" @click="tabActive(nav)">{{ nav }}</div>
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
            <th scope="col" class="text-center" v-if="tabs.active!=='Usulan Cuti'">Nama Pegawai</th>
            <th scope="col" class="text-center">Cuti</th>
            <th scope="col" class="text-center">Alasan</th>
            <th scope="col" class="text-center">Tanggal Cuti</th>
            <th scope="col" class="text-center" v-if="tabs.active==='Usulan Cuti'">Status</th>
            <th scope="col" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataSurat" :key="index">
            <th scope="row" class="text-center">{{ ((pagination.current - 1) * pagination.fetch) + (index + 1) }}</th>
            <td class="text-center" v-if="tabs.active!=='Usulan Cuti'">{{ dataPegawaiPengesahan.length === 0 ? '' : namaPegawai(item) }}</td>
            <td class="text-center">{{ item.jenis.split('Cuti')[1] }}</td>
            <td style="max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.alasan }}</td>
            <td class="text-center">{{ item.tglAwal.split(' ')[0] }} <i>s/d</i> {{ item.tglAkhir.split(' ')[0] }}</td>
            <td class="text-center" v-if="tabs.active==='Usulan Cuti'">{{ statusUsulan[item.kirimSurat] }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-info" data-toggle="modal" @click="onShowUsulan(item)" data-target="#exampleModalScrollable">Lihat Usulan</button>
              <button class="btn btn-sm btn-info" :disabled="item.pengesahanAtasan === null && item.pengesahanPejabat === null" data-toggle="modal" @click="onUnggahFile(item)">Unggah</button>
              <input type="file" accept="application/pdf" ref="unggahFile" id="unggahFile" @change="unggahFile()" hidden>
              <button class="btn btn-sm btn-danger" @click="delUsulan = item; popup.onShow = true" v-if="tabs.active === 'Usulan Cuti' && (item.kirimSurat !== 1 && item.kirimSurat !== 2)">Hapus</button>
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
    <ModalCuti :tambahCutiModal="tambahCutiModal" :dataPegawai="dataPegawai" :edit="usulan.edit" :pengesahan="usulan.pengesahan" :url="usulan.url" :data="usulan.data" @getSuratUsulan="getSuratUsulan" @getSuratPengesahan="getSuratPengesahan"></ModalCuti>
    <PopupInfo :onShow="popup.onShow">
      <template v-slot:title>
        <span>Konfirmasi Data</span>
      </template>
      <p>Apakah Anda yakin untuk menghapus usulan ini ?</p>
      <template v-slot:footer>
        <button type="button" class="btn btn-secondary" @click="popup.onShow = !popup.onShow" data-dismiss="modal">Tutup</button>
        <button type="button" class="btn btn-danger" @click="popup.onShow = !popup.onShow; deleteUsulan(delUsulan);" data-dismiss="modal">Hapus</button>
      </template>
    </PopupInfo>
    <PopupUnggahFile :success="unggahFileSuccess" />
  </div>
</template>

<script>
import ModalCuti from '@/components/modals/Cuti.vue'
import allPangkat from '@/store/pangkat.json'
import bupati from '@/store/bupati.json'
import axios from 'axios'
import PopupInfo from '@/components/modals/PopupInfo.vue'
import store from '../store'
import $ from 'jquery'
import PopupUnggahFile from '@/components/modals/PopupUnggahFile.vue'

export default {
  components: {
    ModalCuti,
    PopupInfo,
    PopupUnggahFile
  },
  props: ['currMenu', 'dataPegawai'],
  data () {
    return {
      uploadSurat: '',
      saring: {
        tahun: ''
      },
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
      dataSurat: [],
      popup: {
        onShow: false
      },
      delUsulan: {},
      pagination: {
        current: 1,
        max: 1,
        fetch: 10 // maksimal get surat
      },
      sort: {
        by: 'jenisCuti',
        dir: true // true = ASC, false = DESC
      },
      dataPegawaiPengesahan: [],
      statusUsulan: ['Belum Terproses', 'Terproses', 'Terkirim ke BKPSDM', 'Selesai'],
      search: {
        find: ''
      },
      itemUpload: {},
      unggahFileSuccess: false
    }
  },
  watch: {
    'search.find' (val) {
      if (store.state.dataSurat.length > 0) {
        if (val === '') {
          this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
          this.pagination.max = store.state.dataSurat.length <= this.pagination.fetch ? 0 : Math.ceil(store.state.dataSurat.length / this.pagination.fetch)
        } else {
          if (store.state.dataSurat[0].nama !== undefined) {
            this.tempDataSurat = store.state.dataSurat.filter(el => { return (el.jenis.toLowerCase().includes(val) || el.nama.toLowerCase().includes(val)) })
          } else {
            this.tempDataSurat = store.state.dataSurat.filter(el => { return (el.jenis.toLowerCase().includes(val)) })
          }
          this.dataSurat = this.tempDataSurat
          this.pagination.max = this.dataSurat.length <= this.pagination.fetch ? 0 : Math.ceil(this.dataSurat.length / this.pagination.fetch)
        }
      }
    },
    'sort': {
      handler (val) {
        console.log(val)
        // sort((a, b) => {
        //   switch (this.sort.by) {
        //     case 'jenisCuti':
        //       if (this.sort.dir === true) {
        //         return ((a.jenis === b.jenis) ? 0 : ((a.jenis > b.jenis) ? 1 : -1))
        //       } else {
        //         return ((a.jenis === b.jenis) ? 0 : ((a.jenis < b.jenis) ? 1 : -1))
        //       }
        //       break
        //   }
        // })
      },
      deep: true
    },
    'tabs.active' (val) {
      if (val === 'Usulan Cuti') {
        this.pagination.current = 1
        this.getSuratUsulan()
      } else {
        this.pagination.current = 1
        this.getSuratPengesahan()
      }
    },
    'pagination.current' (val) {
      if (this.tabs.active === 'Usulan Cuti') {
        if (this.search.find === '') {
          this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
        } else {
          this.dataSurat = this.tempDataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
        }
      } else {
        if (this.search.find === '') {
          this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
        } else {
          this.dataSurat = this.tempDataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
        }
      }
    },
    'saring.tahun' () {
      if (this.tabs.active === 'Usulan Cuti') {
        this.getSuratUsulan()
      }
    }
  },
  computed: {
    listMonth () {
      return ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'Nopember', 'Desember']
    },
    listYear () {
      let now = new Date(Date.now()).getFullYear()
      return [now, now - 1, now - 2]
    }
  },
  methods: {
    onUnggahFile (item) {
      this.itemUpload = item
      $('#unggahFile').trigger('click')
    },
    unggahFile () {
      if (this.$refs.unggahFile[0].files[0].size > 204800) {
        alert('Ukuran file maksimal 200KB')
        return
      }
      this.uploadSurat = this.$refs.unggahFile[0].files[0]

      let formData = new FormData()
      formData.append('file', this.uploadSurat)
      formData.append('onPost', this.itemUpload.suratUpload === null ? 'UploadSuratTandaTangan' : 'UpdateSuratTandaTangan')
      formData.append('jenisCuti', this.itemUpload.idCuti)
      formData.append('pegawai', this.itemUpload.idPegawai)
      formData.append('id_surat', this.itemUpload.id)
      formData.append('oldFile', this.itemUpload.suratUpload)
      axios({
        method: 'post',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.unggahFileSuccess = true
        $('#modalPopupUnggahFile').trigger('click')
        this.getSuratUsulan()
      }).catch(res => {
        $('#modalPopupUnggahFile').trigger('click')
        this.unggahFileSuccess = false
      })
    },
    getJumlahCuti () {
      axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          onGet: 'GetJumlahCuti',
          idPegawai: this.dataPegawai.nip
        }
      }).then(res => {
        store.commit('SET_TOTAL_CUTI_TAHUNAN', res.data.totalCuti)
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
    namaPegawai (item) {
      return this.dataPegawaiPengesahan.find(el => { return el.nip === item.idPegawai }).nama
    },
    tambahCuti () {
      this.getJumlahCuti()
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
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          onGet: 'GetSurat',
          pegawai: this.dataPegawai.nip,
          filterTahun: this.saring.tahun === '' ? new Date(Date.now()).getFullYear() : this.saring.tahun
        }
      }).then(res => {
        store.commit('SET_DATASURAT', res.data.surat)

        this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)

        this.pagination.max = store.state.dataSurat.length <= this.pagination.fetch ? 0 : Math.ceil(store.state.dataSurat.length / this.pagination.fetch)
      })
    },
    getSuratPengesahan () {
      axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          onGet: 'GetSurat',
          pegawai: this.dataPegawai.nip,
          pengesahan: true,
          filterTahun: this.saring.tahun === '' ? new Date(Date.now()).getFullYear() : this.saring.tahun
        }
      }).then(res => {
        store.commit('SET_DATASURAT', res.data.surat)

        this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)

        this.pagination.max = store.state.dataSurat.length <= this.pagination.fetch ? 0 : Math.ceil(store.state.dataSurat.length / this.pagination.fetch)

        let idPegawai = []
        store.state.dataSurat.forEach(el => {
          if (!idPegawai.includes(el.idPegawai)) {
            idPegawai.push(el.idPegawai)
          }
        })
        return axios({
          method: 'get',
          url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
          params: {
            onGet: 'GetPegawaiDataPengesahan',
            pegawai: idPegawai
          }
        }).then(res => {
          this.dataPegawaiPengesahan = res.data.pegawai

          let tempSurat = store.state.dataSurat

          tempSurat.forEach(el => {
            el.nama = this.dataPegawaiPengesahan.find(elm => { return elm.nip === el.idPegawai }).nama
          })
          store.commit('SET_DATASURAT', tempSurat)
        })
      })
    },
    getRekapCutiPegawai (data) {
      return axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          onGet: 'GetRekapCutiPegawai',
          id_pegawai: data.idPegawai
        }
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
    },
    deleteUsulan (data) {
      axios({
        method: 'post',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        data: {
          onPost: 'DeleteUsulan',
          id: data.id
        }
      }).then(() => {
        this.getSuratUsulan()
      })
    },
    dateDayToString (day) {
      let listDay = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu']
      return listDay[day]
    },
    dateMonthToString (month) {
      return this.listMonth[month]
    }
  },
  created () {
    this.getSuratUsulan()
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
