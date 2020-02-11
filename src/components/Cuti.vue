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
    <div class="tab">
      <div class="tab-nav">
        <div v-for="(nav, index) in tabs.nav" :key="index" :style="((dataPegawai.eselon === '' || dataPegawai.eselon.includes('4')) && nav === 'Pengesahan') ? 'cursor: not-allowed;':''" :class="nav===tabs.active ? 'active':''" @click="tabActive(nav)">{{ nav }}</div>
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
  </div>
</template>

<script>
import ModalCuti from '@/components/modals/Cuti.vue'
import allPangkat from '@/store/pangkat.json'
import bupati from '@/store/bupati.json'
import axios from 'axios'
import PopupInfo from '@/components/modals/PopupInfo.vue'
import store from '../store'

export default {
  components: {
    ModalCuti,
    PopupInfo
  },
  props: ['currMenu', 'dataPegawai'],
  data () {
    return {
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
      statusUsulan: ['Belum Terproses', 'Terproses', 'Terkirim ke BKPSDM', 'Selesai']
    }
  },
  watch: {
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
        this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
      } else {
        this.dataSurat = store.state.dataSurat.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
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
    getJumlahCuti () {
      axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          onGet: 'GetJumlahCuti',
          idPegawai: this.dataPegawai.id
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
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
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
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
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
          url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
          params: {
            onGet: 'GetPegawaiDataPengesahan',
            pegawai: idPegawai
          }
        }).then(res => {
          this.dataPegawaiPengesahan = res.data.pegawai
        })
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
      axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          onGet: 'AllPegawai',
          nip: data.idPegawai
        }
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
            alasan_pengesahan_pejabat: data.alasanPengesahanPejabat === null ? '' : data.alasanPengesahanPejabat
          }
        })
      }).then(res => {
        let urls = window.URL.createObjectURL(res.data)
        this.usulan.url = urls
      })
    },
    deleteUsulan (data) {
      axios({
        method: 'post',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
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
