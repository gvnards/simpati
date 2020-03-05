<template>
  <div>
    <PopupResetPassword :success="resetPasswordStatus" />
    <TambahAdminModal :onShow="showTambahAdminModal" @getAkun="getAkun()" />
    <div class="header-wrapper">
      <p>{{ currMenu[0] }} <span>Daftar {{ currMenu[0] }}</span></p>
      <button class="btn btn-sm btn-primary btn-add" v-if="currMenu[1] === 'Pegawai'" @click="syncAccount()"><img src="./../assets/ico/sync.svg" alt="" srcset="">Sinkron Akun</button>
      <button class="btn btn-sm btn-primary btn-add" v-if="currMenu[1] === 'Admin'" data-toggle="modal" data-target="#modalTambahAdmin" @click="showTambahAdminModal = true"><img src="./../assets/ico/add.svg" alt="" srcset="">Tambah</button>
    </div>
    <div class="tab" style="position: relative;">
      <div class="tab-nav">
        <div v-for="(nav, index) in tabs.nav" :key="index" :class="nav === tabs.active ?'active' : ''" @click="tabs.active = nav">{{ nav }}</div>
      </div>
      <div class="input-group" style="max-width: 240px; position: absolute; bottom: 0; right: 0;" v-if="currMenu[1] === 'Admin'">
        <input type="text" class="form-control text-left" placeholder="Cari" v-model="search.find">
        <div class="input-group-text bg-white"><img src="./../assets/ico/search.svg" alt="" srcset="" style="width: 20px;"></div>
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col" class="text-center">No</th>
            <th scope="col" class="text-center">{{ currMenu[1] === 'Pegawai' ? 'NIP' : 'ID' }}</th>
            <th scope="col" class="text-center">Nama</th>
            <th scope="col" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataAkun" :key="index">
            <th scope="row" class="text-center">{{ ((pagination.current - 1) * pagination.fetch) + (index + 1) }}</th>
            <td class="text-center">{{ currMenu[1] === 'Pegawai' ? item.nip : item.user }}</td>
            <td class="text-center" style="max-width: 160px;">{{ item.nama }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-info" @click="resetPassword(item)">Reset Password</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="search-wrapper" v-if="currMenu.includes('Pegawai')">
      <div class="form-group">
        <input type="text" class="form-control" id="searchAccount" placeholder="Masukkan NIP Pegawai" v-model="search.nip">
        <div class="btn btn-sm btn-block btn-primary" @click="getAkun()">Cari</div>
      </div>
    </div>
    <!-- pagination -->
    <nav aria-label="Page navigation example" v-if="tabs.active !== 'Akun Pegawai'">
      <ul class="pagination justify-content-center">
        <li class="page-item" v-for="(item, index) in pagination.max" :key="index" :class="pagination.current === item ? 'disabled':''" @click="pagination.current = item">
          <a class="page-link" href="#" :tabindex="pagination.current === item ? '-1':''">{{ item }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store'
import PopupResetPassword from '@/components/modals/PopupResetPassword.vue'
import TambahAdminModal from '@/components/modals/TambahAdmin.vue'
import $ from 'jquery'
export default {
  components: {
    PopupResetPassword,
    TambahAdminModal
  },
  props: {
    currMenu: ''
  },
  watch: {
    'search.find' (val) {
      this.pagination.current = 1
      if (val === '') {
        this.dataAkun = store.state.dataAkun.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
        this.pagination.max = store.state.dataAkun.length <= this.pagination.fetch ? 0 : Math.ceil(store.state.dataAkun.length / this.pagination.fetch)
      } else {
        this.tempDataAkun = store.state.dataAkun.filter(el => { return (el.nama.toLowerCase().includes(val) || el.user.toLowerCase().includes(val)) })
        this.dataAkun = this.tempDataAkun
        this.pagination.max = this.dataAkun.length <= this.pagination.fetch ? 0 : Math.ceil(this.dataAkun.length / this.pagination.fetch)
      }
    },
    showTambahAdminModal (val) {
      if (val) {
        setTimeout(() => {
          this.showTambahAdminModal = false
        }, 1)
      }
    },
    currMenu (val) {
      this.dataAkun = []
      this.tabs.nav = [`Akun ${val[1]}`]
      this.tabs.active = `Akun ${val[1]}`
      if (val.includes('Admin')) {
        this.getAkun()
      }
    },
    'pagination.current' (val) {
      if (this.search.find === '') {
        this.dataAkun = store.state.dataAkun.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
      } else {
        this.dataAkun = this.tempDataAkun.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
      }
    },
    'tabs.active' (val) {
      this.search.nip = ''
    }
  },
  data () {
    return {
      showTambahAdminModal: false,
      tabs: {
        nav: [],
        active: ''
      },
      pagination: {
        current: 1,
        max: 1,
        fetch: 10 // maksimal get surat
      },
      tempDataAkun: [],
      dataAkun: [],
      search: {
        nip: '',
        find: ''
      },
      resetPasswordStatus: ''
    }
  },
  methods: {
    syncAccount () {
      store.commit('SET_SYNC', true)
      axios({
        method: 'post',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        data: {
          onPost: 'SyncUser'
        }
      }).then(res => {
        store.commit('SET_SYNC', false)
      })
    },
    resetPassword (item) {
      axios({
        method: 'post',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        data: {
          onPost: 'ResetPassword',
          id: this.currMenu[1].includes('Pegawai') ? item.nip : item.user
        }
      }).then(res => {
        if (res.data.status === 'success') {
          this.resetPasswordStatus = true
          $('#modalPopupResetPassword').trigger('click')
        } else {
          this.resetPasswordStatus = false
          $('#modalPopupResetPassword').trigger('click')
        }
      }).catch(res => {
        this.resetPasswordStatus = false
        $('#modalPopupResetPassword').trigger('click')
      })
    },
    getAkun () {
      axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        params: {
          onGet: 'GetAllAccounts',
          account: this.currMenu[1].toLowerCase(),
          nip: this.search.nip
        }
      }).then(res => {
        if (this.currMenu[1] === 'Pegawai') {
          this.dataAkun = res.data.pegawai
        } else {
          store.commit('SET_DATA_AKUN', res.data)

          this.dataAkun = store.state.dataAkun.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)

          this.pagination.max = store.state.dataAkun.length <= this.pagination.fetch ? 0 : Math.ceil(store.state.dataAkun.length / this.pagination.fetch)
        }
      })
    }
  },
  created () {
    this.tabs.nav = [`Akun ${this.currMenu[1]}`]
    this.tabs.active = `Akun ${this.currMenu[1]}`
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
.search-wrapper {
  .form-group {
    margin-left: 50%;
    transform: translateX(-50%);
    max-width: 240px;
    .btn {
      margin-top: 4px;
    }
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
</style>
