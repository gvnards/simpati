<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
      <div class="modal-dialog" :class="!edit || window.width > 960 && (edit && data.kirimSurat !== '1') ? 'data-pribadi' : 'data-usulan'">
        <div class="modal-content" style="overflow: hidden;">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalScrollableTitle">
              <span v-if="edit || pengesahan">Usulan Cuti</span>
              <span v-else>DATA PRIBADI</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="edit || pengesahan">
              <div class="tab">
                <div class="tab-nav">
                  <div v-for="(nav, index) in tabs.nav" :key="index" :class="nav===tabs.active ? 'active':''" @click="tabs.active=nav">{{ nav }}</div>
                </div>
              </div>
              <!-- <embed :src="tabs.active==='Surat Usulan' ? url:'https://cuti.bkpsdmsitubondo.id/upload/berkas/cuti/'+data.berkas" type="application/pdf" style="width: 100%; height: 360px;"> -->
              <embed :src="tabs.active==='Surat Usulan' ? url:'http://127.0.0.1/upload/berkas/cuti/'+data.berkas" type="application/pdf" style="width: 100%; height: 360px;">
            </div>
            <div v-else class="data-asn-wrapper">
              <div class="form-group">
                <input type="text" class="form-control" :placeholder="dataPegawai.nip" readonly>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" :placeholder="dataPegawai.nama" readonly>
              </div>
              <div class="form-group">
                <textarea class="form-control" id="alasanCuti" rows="2" :placeholder="dataPegawai.nama_jabatan" readonly></textarea>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" :placeholder="`${pangkat} (${dataPegawai.GOL_NAMA})`" readonly>
              </div>
              <div class="form-group">
                <textarea class="form-control" id="alasanCuti" rows="3" :placeholder="dataPegawai.nama_opd" readonly></textarea>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" :placeholder="masaKerja" readonly>
              </div>
            </div>
          </div>
          <div class="modal-footer text-footer row">
            <p class="text-secondary col-sm-12" v-if="!edit && !pengesahan">* Jika ada kesalahan data, silakan hubungi Admin BKPSDM</p>
          </div>
        </div>
      </div>

      <div class="modal-dialog modal-dialog-scrollable" v-if="(!edit || (edit && data.kirimSurat !== '1'))" :class="window.width > 960 ? 'data-cuti' : ''" role="document" :style="pengesahan ? 'max-height: 486px;' : ''">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalScrollableTitle">
              <span v-if="pengesahan">PERTIMBANGAN DAN KEPUTUSAN</span>
              <span v-else>DATA CUTI</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="pengesahan" class="data-cuti-wrapper">
              <div class="form-group">
                <label for="jenisCuti">Status Pengesahan</label>
                <select class="form-control" id="jenisCuti" v-model="dataPengesahan.status" required>
                  <option value="" hidden selected>&lt;Pilih Status Pengesahan&gt;</option>
                  <option v-for="(status, index) in dataStatusPengesahan" :key="index" :value="index+1">{{ status }}</option>
                </select>
              </div>
              <div class="form-group" v-if="dataPengesahan.status !== 1 && dataPengesahan.status !== ''">
                <label for="lamaCuti">Lama Cuti</label>
                <div id="lamaCuti">
                  <Datepicker class="datepicker" :bootstrap-styling="true" :placeholder="'Tanggal awal'" :language="id" v-model="dataPengesahan.lamaCuti.tglAwal"></Datepicker>
                  <span>s/d</span>
                  <Datepicker class="datepicker" :bootstrap-styling="true" :language="id" :placeholder="'Tanggal akhir'" v-model="dataPengesahan.lamaCuti.tglAkhir"></Datepicker>
                  <span>=</span>
                  <input type="text" class="form-control" :placeholder="hariCuti" readonly>
                  <span>hari</span>
                </div>
              </div>
              <div class="form-group" v-if="dataPengesahan.status !== 1 && dataPengesahan.status !== ''">
                <label for="alamatCuti">Alasan {{ dataStatusPengesahan[dataPengesahan.status - 1] }}</label>
                <textarea class="form-control" id="alamatCuti" rows="2" v-model="dataPengesahan.alasan"></textarea>
              </div>
            </div>
            <div v-else class="data-cuti-wrapper">
              <div class="form-group">
                <label for="jenisCuti">Jenis Cuti Yang Diambil</label>
                <select class="form-control" id="jenisCuti" v-model="cutiPegawai.jenisCuti" required>
                  <option value="" hidden selected>&lt;Pilih Jenis Cuti&gt;</option>
                  <option v-for="(cuti, index) in dataCuti.jenisCuti" :key="index" :value="index+1">{{ cuti }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="alasanCuti">Alasan Cuti</label>
                <textarea class="form-control" id="alasanCuti" rows="2" v-model="cutiPegawai.alasanCuti"></textarea>
              </div>
              <div class="form-group">
                <label for="lamaCuti">Lama Cuti</label>
                <div id="lamaCuti">
                  <Datepicker class="datepicker" :bootstrap-styling="true" :placeholder="'Tanggal awal'" :language="id" v-model="cutiPegawai.lamaCuti.tglAwal"></Datepicker>
                  <span>s/d</span>
                  <Datepicker class="datepicker" :bootstrap-styling="true" :language="id" :placeholder="'Tanggal akhir'" v-model="cutiPegawai.lamaCuti.tglAkhir"></Datepicker>
                  <span>=</span>
                  <input type="text" class="form-control" :placeholder="hariCuti" readonly>
                  <span>hari</span>
                </div>
              </div>
              <div class="form-group">
                <label for="alamatCuti">Alamat Selama Menjalankan Cuti</label>
                <textarea class="form-control" id="alamatCuti" rows="2" v-model="cutiPegawai.alamatCuti"></textarea>
              </div>
              <div class="form-group">
                <vue-tel-input v-model="cutiPegawai.teleponCuti" :placeholder="'Nomor telepon yang dapat dihubungi selama cuti'"></vue-tel-input>
              </div>
              <div class="form-group">
                <label for="atasanLangsung">Atasan Langsung</label>
                <select class="form-control" id="atasanLangsung" v-model="cutiPegawai.atasanLangsung" required>
                  <option value="" hidden selected>&lt;Pilih Atasan&gt;</option>
                  <option v-for="(atasan, index) in atasanLangsung" :key="index" :value="atasan.id">{{ atasan.nama }} - {{ atasan.nama_jabatan }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="atasanLangsung">Pejabat Berwenang</label>
                <select class="form-control" id="atasanLangsung" v-model="cutiPegawai.pejabatBerwenang" required>
                  <option value="" hidden selected>&lt;Pilih Pejabat&gt;</option>
                  <option v-for="(pejabat, index) in pejabatBerwenang" :key="index" :value="pejabat.id">{{ pejabat.nama }} - {{ pejabat.nama_jabatan }}</option>
                </select>
              </div>
              <div class="form-group" v-if="cutiPegawai.jenisCuti !== '' && cutiPegawai.jenisCuti !== 1">
                <label>Pilih Berkas Pendukung</label>
                <div class="custom-file">
                  <input type="file" accept="application/pdf" class="custom-file-input" id="customFile" ref="berkasPendukung" @change="uploadBerkasPendukung()">
                  <label class="custom-file-label" for="customFile">{{ cutiPegawai.berkasPendukung.name === undefined ? cutiPegawai.berkasPendukung : cutiPegawai.berkasPendukung.name }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div v-if="edit">
              <button type="button" class="btn btn-primary" @click="showPopup()">Perbarui</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="kirim()">Kirim</button>
            </div>
            <div v-else-if="pengesahan">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
              <button type="button" class="btn btn-success" :disabled="dataPengesahan.status === ''" data-dismiss="modal" @click="setPengesahan()">Sahkan</button>
            </div>
            <div v-else>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
              <button type="button" class="btn btn-primary" @click="showPopup()">Buat Cuti</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PopupInfo :onShow="popup.onShow">
      <template v-slot:title>
        <span v-if="popup.isSuccess">Konfirmasi Data</span>
        <span v-else>Terjadi Kesalahan</span>
      </template>
      <p v-if="popup.isSuccess">Apakah data Anda sudah benar dan yakin untuk melanjutkan ?</p>
      <p v-else>Lengkapi data Anda terlebih dahulu !</p>
      <template v-slot:footer>
        <button type="button" class="btn btn-secondary" @click="popup.onShow = !popup.onShow" data-dismiss="exampleModalScrollable">Tutup</button>
        <div v-if="popup.isSuccess">
          <button type="button" class="btn btn-primary" @click="edit ? updateCuti():buatCuti()" data-dismiss="modal">Simpan</button>
        </div>
      </template>
    </PopupInfo>
  </div>
</template>

<script>
import allPangkat from './../../store/pangkat.json'
import Datepicker from 'vuejs-datepicker'
import { id } from 'vuejs-datepicker/dist/locale'
import axios from 'axios'
import PopupInfo from '@/components/modals/PopupInfo.vue'
import $ from 'jquery'

export default {
  components: {
    Datepicker,
    PopupInfo
  },
  props: {
    dataPegawai: {},
    tambahCutiModal: 0,
    edit: false,
    url: '',
    data: {},
    pengesahan: false
  },
  data () {
    return {
      tabs: {
        nav: ['Surat Usulan', 'Berkas Pendukung'],
        active: 'Surat Usulan'
      },
      dataAtasan: [],
      id: id,
      window: {
        width: 0,
        height: 0
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
      popup: {
        onShow: false,
        isSuccess: false
      },
      dataStatusPengesahan: ['Disetujui', 'Perubahan', 'Ditangguhkan', 'Tidak Disetujui'],
      dataPengesahan: {
        status: '',
        lamaCuti: {
          tglAwal: '',
          tglAkhir: '',
          totalHari: 0
        },
        alasan: ''
      }
    }
  },
  watch: {
    hariCuti (val) {
      this.cutiPegawai.lamaCuti.totalHari = val
      this.dataPengesahan.lamaCuti.totalHari = val
    },
    tambahCutiModal (val) {
      this.formReset()
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
      } else if (this.pengesahan) {
        this.dataPengesahan.lamaCuti.tglAwal = new Date(this.data.tglAwal)
        this.dataPengesahan.lamaCuti.tglAkhir = new Date(this.data.tglAkhir)
        this.dataPengesahan.lamaCuti.totalHari = this.data.totalHari
      }
    }
  },
  computed: {
    pangkat () {
      return allPangkat[this.dataPegawai.GOL_NAMA]
    },
    masaKerja () {
      let tmt = this.dataPegawai.nip.slice(8, 14)
      tmt = new Date(`${tmt.slice(4)}/01/${tmt.slice(0, 4)}`)
      let dateNow = new Date(Date.now())
      let diffTime = Math.abs(dateNow - tmt)
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return `${Math.floor(diffDays / 365)} Tahun ${Math.floor((diffDays % 365) / 30)} Bulan ${(diffDays % 365) % 30} Hari`
    },
    hariCuti () {
      if (this.pengesahan) {
        if ((this.dataPengesahan.lamaCuti.tglAwal === '' || this.dataPengesahan.lamaCuti.tglAkhir === '') || (this.dataPengesahan.lamaCuti.tglAwal > this.dataPengesahan.lamaCuti.tglAkhir)) return 0
      } else {
        if ((this.cutiPegawai.lamaCuti.tglAwal === '' || this.cutiPegawai.lamaCuti.tglAkhir === '') || (this.cutiPegawai.lamaCuti.tglAwal > this.cutiPegawai.lamaCuti.tglAkhir)) return 0
      }
      let diffTime = this.pengesahan ? Math.abs(this.dataPengesahan.lamaCuti.tglAkhir - this.dataPengesahan.lamaCuti.tglAwal) : Math.abs(new Date(this.tglCuti.tglAkhir) - new Date(this.tglCuti.tglAwal))
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      let tempCountDay = 0
      for (let i = 0; i < diffDays; i++) {
        let date = this.pengesahan ? new Date(new Date(this.dataPengesahan.lamaCuti.tglAwal).getTime() + (i * 86400000)).getDay() : new Date(new Date(this.tglCuti.tglAwal).getTime() + (i * 86400000)).getDay()
        if (date !== 0 && date !== 6) {
          tempCountDay++
        }
      }
      return tempCountDay
    },
    atasanLangsung () {
      if (this.dataPegawai.eselon !== '22') {
        return this.dataAtasan.filter(el => { return el.eselon !== '21' })
      }
      return this.dataAtasan
    },
    pejabatBerwenang () {
      if (this.dataPegawai.eselon !== '22' && this.dataPegawai.eselon !== '32' && this.dataPegawai.eselon !== '31') {
        return this.dataAtasan.filter(el => { return el.eselon !== '21' })
      }
      return this.dataAtasan
    },
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
    },
    isFormFullFilled () {
      if (this.cutiPegawai.jenisCuti !== '' && this.cutiPegawai.alasanCuti !== '' && this.cutiPegawai.lamaCuti.tglAwal !== '' && this.cutiPegawai.lamaCuti.tglAkhir !== '' && this.cutiPegawai.lamaCuti.totalHari !== 0 && this.cutiPegawai.alamatCuti !== '' && this.cutiPegawai.teleponCuti !== '' && this.cutiPegawai.atasanLangsung !== '' && this.cutiPegawai.pejabatBerwenang !== '') return true
      return false
    }
  },
  methods: {
    uploadBerkasPendukung () {
      console.log(this.$refs.berkasPendukung.files[0])
      this.cutiPegawai.berkasPendukung = this.$refs.berkasPendukung.files[0]
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    },
    formReset () {
      this.cutiPegawai = {
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
      }
      this.dataPengesahan = {
        status: '',
        lamaCuti: {
          tglAwal: '',
          tglAkhir: '',
          totalHari: 0
        },
        alasan: ''
      }
      this.tabs.active = 'Surat Usulan'
    },
    buatCuti () {
      let tgl = this.tglCuti
      axios({
        method: 'post',
        // url: 'https://server.cuti.bkpsdmsitubondo.id',
        url: 'http://127.0.0.1/php_class/',
        data: {
          onPost: 'InsertSurat',
          pegawai: parseInt(this.dataPegawai.id),
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
        // console.log(res)
        this.uploadBerkas()
        // console.log('SUKSES')
      }).catch(() => {
        // console.log('GAGAL')
      })
      this.popup.onShow = !this.popup.onShow
      $('#exampleModalScrollable').modal('hide')
    },
    uploadBerkas () {
      let formData = new FormData()
      formData.append('file', this.cutiPegawai.berkasPendukung)
      formData.append('onPost', 'InsertBerkas')
      formData.append('jenisCuti', this.cutiPegawai.jenisCuti)
      formData.append('pegawai', parseInt(this.dataPegawai.id))
      axios({
        method: 'post',
        // url: 'https://server.cuti.bkpsdmsitubondo.id',
        url: 'http://127.0.0.1/php_class/',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res)
        this.$emit('getSuratUsulan')
      })
    },
    updateCuti () {
      if (this.cutiPegawai.berkasPendukung.name !== undefined) {
        let formData = new FormData()
        let k = ['file', 'onPost', 'jenisCuti', 'pegawai', 'currentPath', 'oldFile', 'id']
        let v = [this.cutiPegawai.berkasPendukung, 'UpdateBerkas', this.cutiPegawai.jenisCuti, parseInt(this.dataPegawai.id), '../upload/berkas/cuti/', this.data.berkas, this.data.id]
        for (let i = 0; i < k.length; i++) {
          formData.append(k[i], v[i])
        }
        axios({
          method: 'post',
          // url: 'https://server.cuti.bkpsdmsitubondo.id',
          url: 'http://127.0.0.1/php_class/',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
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
        this.$emit('getSuratUsulan')
        // console.log('SUKSES')
      }).catch(() => {
        // console.log('GAGAL')
      })
      this.popup.onShow = !this.popup.onShow
      $('#exampleModalScrollable').modal('hide')
    },
    kirim () {
      axios({
        method: 'post',
        // url: 'https://server.cuti.bkpsdmsitubondo.id',
        url: 'http://127.0.0.1/php_class/',
        data: {
          onPost: 'SetKirimCuti',
          id: this.data.id
        }
      }).then(() => {
        this.$emit('getSuratUsulan')
      })
    },
    showPopup () {
      this.popup.isSuccess = this.isFormFullFilled
      this.popup.onShow = !this.popup.onShow
    },
    setPengesahan () {
      // KURANG UPDATE TANGGAL NYA
      axios({
        method: 'post',
        // url: 'https://server.cuti.bkpsdmsitubondo.id',
        url: 'http://127.0.0.1/php_class/',
        data: {
          onPost: 'SetPengesahan',
          id: this.data.id,
          pengesahan: this.dataPegawai.id,
          statusPengesahan: this.dataPengesahan.status,
          alasanPengesahan: this.dataPengesahan.alasan
        }
      }).then(() => {
        this.$emit('getSuratPengesahan')
      })
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.dataAtasan = this.$route.params.atasan
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
.data-asn-wrapper, .data-cuti-wrapper {
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
.data-cuti-wrapper {
  #lamaCuti {
    display: flex;
    .datepicker {
      width: 140px;
    }
    span {
      vertical-align: middle;
      position: relative;
      padding: 6px 10px 0px 10px;
    }
    input {
      width: 80px;
    }
  }
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
@media screen and (max-width: 960px) {
  .fade.show {
    display: initial !important;
  }
}
</style>
