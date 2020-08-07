<template>
  <div>
    <div class="row">
      <div class="col-lg-3 cuti-wrapper" v-for="(jenis, index) in cuti.jenis" :key="index">
        <div class="card" style="cursor: pointer;" @click="showInfoCuti(index)">
          <div class="row">
            <div class="col-sm-8 jenis-cuti" :style="`color: ${cuti.color[index]}`">
              {{ jenis.toUpperCase() }}
            </div>
            <div class="col-sm-4 sisa">
              <p class="text-center">
                <span>maksimal</span>
                <br>
                <span v-if="dataPegawai.user !== undefined && dataPegawai.user.includes('admin')" :style="`color: ${cutiAdmin.color[index]}`">{{ cutiAdmin.sisa[index] }}</span>
                <span v-else :style="`color: ${cuti.color[index]}`">{{ jenis.toUpperCase() === 'TAHUNAN' ? totalCutiTahunan : cuti.sisa[index] }}</span>
                <br>
                <span>hari</span>
              </p>
            </div>
          </div>
          <div class="cuti-footer">
            <img src="@/assets/ico/time.svg" alt="" srcset="">
            <span>terhitung pada tahun {{ currentYear }}</span>
          </div>
        </div>
      </div>
    </div>
    <PopupShowInfoCuti :idx="imgIdx" />
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store'
import PopupShowInfoCuti from '@/components/modals/PopupShowInfoCuti.vue'
import $ from 'jquery'
export default {
  components: {
    PopupShowInfoCuti
  },
  props: {
    dataPegawai: {}
  },
  data () {
    return {
      imgIdx: 0,
      totalCutiTahunan: 0,
      cuti: {
        jenis: ['Tahunan', 'Sakit', 'Karena Alasan Penting', 'Di Luar Tanggungan Negara', 'Besar', 'Melahirkan'],
        sisa: [12, '-', 30, '-', '-', '-'],
        color: ['#1E6E8F', '#1E8F5A', '#8F1E1E', '#8F571E', '#8F8F1E', '#b34700']
      },
      cutiAdmin: {
        jenis: ['Tahunan', 'Sakit', 'Karena Alasan Penting', 'Di Luar Tanggungan Negara', 'Besar', 'Melahirkan'],
        sisa: ['-', '-', '-', '-', '-', '-'],
        color: ['#1E6E8F', '#1E8F5A', '#8F1E1E', '#8F571E', '#8F8F1E', '#b34700']
      }
    }
  },
  computed: {
    currentYear () {
      return new Date(Date.now()).getFullYear()
    }
  },
  methods: {
    showInfoCuti (idx) {
      this.imgIdx = idx
      setTimeout(() => {
        $('#btnModalInfoCuti').trigger('click')
      }, 300)
    },
    getJumlahCuti () {
      return axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          nocache: new Date().getTime(),
          onGet: 'GetJumlahCuti',
          idPegawai: this.dataPegawai.nip
        }
      })
    }
  },
  created () {
    this.getJumlahCuti().then(res => {
      this.totalCutiTahunan = res.data.totalCuti
      store.commit('SET_TOTAL_CUTI_TAHUNAN', res.data.totalCuti)
    })
  }
}
</script>

<style lang="less" scoped>
.cuti-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.card {
  position: relative;
  min-height: 120px;
  width: 240px;
  padding: 0px 10px;
  &::before {
    content: "CUTI";
    position: absolute;
    bottom: -4px;
    font-size: 82px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 600;
    color: rgba(240, 240, 240, 0.4);
  }
}
.sisa {
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 14px;
    color: #C4C4C4;
  }
  p span:nth-child(3) {
    color: initial;
    font-size: 20px;
    font-weight: 600;
  }
}
.jenis-cuti {
  font-size: 20px;
  display: flex;
  align-items: center;
  font-weight: 600;
}
.cuti-footer {
  border-top: 1px solid #C4C4C4;
  font-size: 12px;
  color: #C4C4C4;
  img {
    width: 14px;
    vertical-align: sub;
  }
}
</style>
