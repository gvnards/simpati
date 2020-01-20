<template>
  <div>
    <div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
      <div class="modal-dialog" :class="!edit || window.width > 960 && (edit && data.kirimSurat !== '1') ? 'data-pribadi' : 'data-usulan'">
        <div class="modal-content" style="overflow: hidden;">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalScrollableTitle">
              <span>Usulan Cuti</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <div class="tab">
                <div class="tab-nav">
                  <div v-for="(nav, index) in tabs.nav" :key="index" :class="nav===tabs.active ? 'active':''" @click="tabs.active=nav">{{ nav }}</div>
                </div>
              </div>
              <embed v-if="tambahCutiModal === 0" :src="tabs.active==='Surat Usulan' ? url:urlBerkasPendukung" type="application/pdf" style="width: 100%; height: 360px;">
            </div>
          </div>
        </div>
      </div>

      <div class="modal-dialog modal-dialog-scrollable" :class="window.width > 960 ? 'data-cuti' : ''" role="document" :style="edit ? 'max-height: 486px;' : ''">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalScrollableTitle">
              <span>DATA CUTI</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="data-cuti-wrapper">
              <div class="form-group">
                <label for="jenisCuti">Jenis Cuti Yang Diambil<span class="text-danger">*</span></label>
                <select class="form-control" id="jenisCuti" v-model="cutiPegawai.jenisCuti" required>
                  <option value="" hidden selected>&lt;Pilih Jenis Cuti&gt;</option>
                  <option v-for="(cuti, index) in dataCuti.jenisCuti" :key="index" :value="index+1">{{ cuti }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div v-if="edit">
              <button type="button" class="btn btn-outline-primary" @click="popup.onShow = !popup.onShow">Perbarui</button>
              <!-- <button type="button" class="btn btn-outline-primary" @click="showPopup(); isKirim = false;">Perbarui</button> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <PopupInfo :onShow="popup.onShow">
      <template v-slot:title>
        <span>Konfirmasi Data</span>
      </template>
      <p>Apakah data Anda sudah benar dan yakin untuk melanjutkan ?</p>
      <template v-slot:footer>
        <button type="button" class="btn btn-secondary" @click="popup.onShow = !popup.onShow" data-dismiss="exampleModalScrollable">Tutup</button>
        <button type="button" class="btn btn-primary" @click="updateCuti()" data-dismiss="modal">Simpan</button>
      </template>
    </PopupInfo>
  </div>
</template>

<script>
import axios from 'axios'
import PopupInfo from '@/components/modals/PopupInfo.vue'
import $ from 'jquery'

export default {
  components: {
    PopupInfo
  },
  props: {
    tambahCutiModal: '',
    url: '',
    edit: '',
    data: {}
  },
  watch: {
    'tabs.active' (val) {
      if (val === 'Berkas Pendukung') {
        this.getBerkasPendukung()
      }
    },
    tambahCutiModal () {
      this.cutiPegawai.jenisCuti = ''
      if (this.edit) {
        this.cutiPegawai = {
          jenisCuti: this.data.idCuti,
          alasanCuti: this.data.alasan,
          lamaCuti: {
            tglAwal: new Date(this.data.tglAwal),
            tglAkhir: new Date(this.data.tglAkhir),
            totalHari: this.data.totalHari
          },
          alamatCuti: this.data.alamat,
          teleponCuti: this.data.nomorTelepon,
          atasanLangsung: this.data.idAtasan,
          pejabatBerwenang: this.data.idPejabat,
          berkasPendukung: this.data.berkas
        }
      }
    }
  },
  data () {
    return {
      popup: {
        onShow: false,
        isSuccess: false
      },
      cutiPegawai: {
        jenisCuti: '',
        alasanCuti: '',
        lamaCuti: {
          tglAwal: '',
          tglAkhir: '',
          totalHari: 0
        },
        alamatCuti: '',
        teleponCuti: '',
        atasanLangsung: '',
        pejabatBerwenang: '',
        berkasPendukung: ''
      },
      dataCuti: {
        jenisCuti: [
          'Cuti Tahunan',
          'Cuti Sakit',
          'Cuti Karena Alasan Penting',
          'Cuti di Luar Tanggungan Negara',
          'Cuti Besar',
          'Cuti Melahirkan'
        ]
      },
      urlBerkasPendukung: '',
      window: {
        width: 0,
        height: 0
      },
      tabs: {
        nav: ['Surat Usulan', 'Berkas Pendukung'],
        active: 'Surat Usulan'
      }
    }
  },
  computed: {
    tglCuti () {
      let year, month, day
      let tglAwal = this.cutiPegawai.lamaCuti.tglAwal
      year = tglAwal.getFullYear().toString().length > 1 ? tglAwal.getFullYear().toString() : `0${tglAwal.getFullYear().toString()}`
      month = (tglAwal.getMonth() + 1).toString().length > 1 ? (tglAwal.getMonth() + 1).toString() : `0${(tglAwal.getMonth() + 1).toString()}`
      day = tglAwal.getDate().toString().length > 1 ? tglAwal.getDate().toString() : `0${tglAwal.getDate().toString()}`
      tglAwal = `${year}/${month}/${day} 00:00:00`

      let tglAkhir = this.cutiPegawai.lamaCuti.tglAkhir
      year = tglAkhir.getFullYear().toString().length > 1 ? tglAkhir.getFullYear().toString() : `0${tglAkhir.getFullYear().toString()}`
      month = (tglAkhir.getMonth() + 1).toString().length > 1 ? (tglAkhir.getMonth() + 1).toString() : `0${(tglAkhir.getMonth() + 1).toString()}`
      day = tglAkhir.getDate().toString().length > 1 ? tglAkhir.getDate().toString() : `0${tglAkhir.getDate().toString()}`
      tglAkhir = `${year}/${month}/${day} 23:59:59`

      return {
        tglAwal: tglAwal,
        tglAkhir: tglAkhir
      }
    }
  },
  methods: {
    updateCuti () {
      let tgl = this.tglCuti
      axios({
        method: 'post',
        // url: 'https://server.cuti.bkpsdmsitubondo.id',
        url: 'http://127.0.0.1/php_class/',
        data: {
          onPost: 'UpdateSurat',
          id: this.data.id,
          jenisCuti: this.cutiPegawai.jenisCuti,
          alasanCuti: this.cutiPegawai.alasanCuti,
          tglAwal: tgl.tglAwal,
          tglAkhir: tgl.tglAkhir,
          totalHari: this.cutiPegawai.lamaCuti.totalHari,
          alamatCuti: this.cutiPegawai.alamatCuti,
          teleponCuti: this.cutiPegawai.teleponCuti,
          atasanLangsung: parseInt(this.cutiPegawai.atasanLangsung),
          pejabatBerwenang: parseInt(this.cutiPegawai.pejabatBerwenang)
        }
      }).then((res) => {
        this.$emit('getSurat')
        this.$emit('getCountSurat')
      }).catch(() => {
      })
      this.popup.onShow = !this.popup.onShow
      $('#exampleModalScrollable').modal('hide')
    },
    getBerkasPendukung () {
      axios({
        method: 'get',
        // url: 'https://cuti.bkpsdmsitubondo.id/upload/berkas/cuti/',
        url: 'http://127.0.0.1/upload/berkas/cuti/',
        responseType: 'blob',
        params: {
          data: this.data.berkas
        }
      }).then(res => {
        let urls = window.URL.createObjectURL(res.data)
        this.urlBerkasPendukung = urls
      })
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="less" scoped>
.fade.show {
  display: flex !important;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: center;
  .data-pribadi {
    flex-basis: 420px;
    margin-left: 10px;
  }
  .data-usulan {
    flex-basis: 500px;
  }
  .text-footer {
    justify-content: center;
    align-items: flex-start;
    p {
      font-size: 12px;
      font-weight: 600;
    }
  }
  .data-cuti {
    flex-basis: 600px;
    margin-right: 0;
  }
}
.modal-title {
  font-weight: 600;
}
.tab {
  margin-bottom: 2px;
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
.data-cuti-wrapper {
  .form-group {
    margin-bottom: 8px;
  }
  padding-bottom: 2px;
}
input, textarea {
  &:read-only {
    cursor: default;
  }
}
@media screen and (max-width: 960px) {
  .fade.show {
    display: initial !important;
  }
}
</style>
