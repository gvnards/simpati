<template>
  <div>
    <div class="header-wrapper">
      <p>{{ currMenu[0] }} <span>Daftar {{ currMenu[0] }}</span></p>
    </div>
    <div class="tab">
      <div class="tab-nav">
        <div v-for="(nav, index) in tabs.nav" :key="index" :class="nav === tabs.active ?'active' : ''" @click="tabs.active = nav">{{ nav }}</div>
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col" class="text-center">No</th>
            <th scope="col" class="text-center" v-if="currMenu.includes('Pegawai')">NIP</th>
            <th scope="col" class="text-center">Nama</th>
            <th scope="col" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataAkun" :key="index">
            <th scope="row" class="text-center">{{ ((pagination.current - 1) * pagination.fetch) + (index + 1) }}</th>
            <td class="text-center" v-if="currMenu.includes('Pegawai')">{{ item.nip }}</td>
            <td class="text-center">{{ item.nama }}</td>
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
export default {
  props: {
    currMenu: ''
  },
  watch: {
    currMenu (val) {
      this.dataAkun = []
      this.tabs.nav = [`Akun ${val[1]}`]
      this.tabs.active = `Akun ${val[1]}`
      if (val.includes('Admin')) {
        this.getAkun()
      }
    },
    'pagination.current' (val) {
      this.dataAkun = store.state.dataAkun.slice((this.pagination.current - 1) * this.pagination.fetch, this.pagination.current * this.pagination.fetch)
    },
    'tabs.active' (val) {
      this.search.nip = ''
    }
  },
  data () {
    return {
      tabs: {
        nav: [],
        active: ''
      },
      pagination: {
        current: 1,
        max: 1,
        fetch: 10 // maksimal get surat
      },
      dataAkun: [],
      search: {
        nip: ''
      }
    }
  },
  methods: {
    resetPassword (item) {
      axios({
        method: 'post',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : '/home/cutibkpsdmsit/public_html/server/',
        data: {
          onPost: 'ResetPassword',
          id: this.currMenu[1].includes('Pegawai') ? item.nip : item.user
        }
      }).then(res => {
        console.log(res)
      })
    },
    getAkun () {
      axios({
        method: 'get',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : '/home/cutibkpsdmsit/public_html/server/',
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

          this.dataAkun = store.state.dataAkun

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
</style>
