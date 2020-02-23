<template>
  <div>
    <div class="header-wrapper">
      <p>{{ currMenu[0].split(" ")[0] + ' ' + currMenu[1] }} <span>Daftar {{ currMenu[1] }}</span></p>
    </div>
    <div class="tab" style="position: relative;">
      <div class="tab-nav">
        <div v-for="(nav, index) in tabs.nav" :key="index" class="active">{{ nav }}</div>
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col" class="text-center">No</th>
            <th scope="col" class="text-center">NIP</th>
            <th scope="col" class="text-center">Nama</th>
            <th scope="col" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataAkunPegawai" style="position: relative;" :style="dataActive === index ? 'height: 280px;' : ''" :key="index">
            <th scope="row" class="text-center">{{ ((pagination.current - 1) * pagination.fetch) + (index + 1) }}</th>
            <td class="text-center">{{ item.nip }}</td>
            <td class="text-center">{{ item.nama }}</td>
            <td class="text-center" @click="onDataActive(item, index)" style="cursor: pointer;"><img src="./../assets/ico/circled_chevron_down.svg" alt="" srcset="" style="width: 20px;"></td>
            <br />
            <br />
            <div style="position: absolute; left: 0; display: none; width: 100%;" :style="dataActive === index ? 'display: block;' : ''">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" class="text-center">Tahun</th>
                    <th scope="col" class="text-center">Jumlah Cuti Tahunan</th>
                    <th scope="col" class="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in jumlahCuti" :key="index">
                    <td class="text-center">{{ item.tahun }}</td>
                    <td class="text-center">
                      <div class="form-group" style="margin: auto; margin-left: calc(50% - 34px);">
                        <input type="text" :readonly="Boolean(parseInt(item.locked))" class="form-control text-center" id="jumlahCuti" style="max-width: 60px;" v-model="jumlahCuti[index].jumlah">
                      </div>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-primary btn-sm" :disabled="Boolean(parseInt(item.locked))" @click="onChangeJumlahCuti(item)">{{ Boolean(parseInt(item.locked)) ? 'Terkunci' : 'Ubah' }}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
</style>

<script>
import axios from 'axios'
import store from '@/store'
export default {
  props: ['dataPegawai', 'currMenu'],
  data () {
    return {
      jumlahCuti: [
        {
          tahun: '',
          jumlah: ''
        },
        {
          tahun: '',
          jumlah: ''
        },
        {
          tahun: '',
          jumlah: ''
        }
      ],
      dataActive: -1,
      pagination: {
        current: 1,
        max: 1,
        fetch: 10 // maksimal get surat
      },
      tabs: {
        nav: ['Pegawai']
      },
      dataAkunPegawai: []
    }
  },
  watch: {
    'jumlahCuti': {
      handler (val) {
        if (val.length > 0) {
          if (val[1].jumlah > 6) {
            val[1].jumlah = 6
          }
          if (val[2].jumlah > 6) {
            val[2].jumlah = 6
          }
        }
      },
      deep: true
    }
  },
  methods: {
    onDataActive (item, index) {
      if (this.dataActive === index) {
        this.dataActive = -1
      } else {
        this.dataActive = index
        axios({
          method: 'get',
          url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
          params: {
            onGet: 'GetJumlahCuti',
            idPegawai: item.nip
          }
        }).then(res => {
          this.jumlahCuti = res.data.eachYear
        })
      }
    },
    onChangeJumlahCuti (item) {
      axios({
        method: 'post',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
        data: {
          onPost: 'UpdateJumlahAdmin',
          jumlah: parseInt(item.jumlah),
          idPegawai: this.dataAkunPegawai[this.dataActive].nip,
          tahun: item.tahun
        }
      }).then(res => {
        return axios({
          method: 'get',
          url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
          params: {
            onGet: 'GetJumlahCuti',
            idPegawai: this.dataAkunPegawai[this.dataActive].nip
          }
        })
      }).then(res => {
        this.jumlahCuti = res.data.eachYear
      })
    }
  },
  created () {
    axios({
      method: 'get',
      url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
      params: {
        onGet: 'GetPegawaiAdmin',
        opd_id: this.dataPegawai.opd_id
      }
    }).then(res => {
      this.dataAkunPegawai = res.data.pegawai
    })
  }
}
</script>
