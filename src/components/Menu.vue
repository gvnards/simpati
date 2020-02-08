<template>
  <div id="menu-wrapper">
    <div class="logo">
      <div class="logo-wrapper">
        <a class="ahreflogo" href="https://cuti.bkpsdmsitubondo.id"></a>
        <img src="./../assets/ico/create.svg" alt="" srcset="">
        <p class="text-wrapper">
          <span class="text-layanan">Layanan</span>
          <br>
          <span class="text-simpati">SIMPATI</span>
        </p>
      </div>
    </div>
    <div class="profile">
      <div class="profile-wrapper text-white" @click="isChangePassword = !isChangePassword; changePassword = ''">
        <img v-if="admin" src="./../assets/ico/user_shield.svg" alt="icon picture">
        <img v-else :src="dataPegawai.JENIS_KELAMIN === 'M' ? require('./../assets/ico/private_account_male.svg') : require('./../assets/ico/private_account_female.svg')" alt="icon picture">
        <div class="text-wrapper">
          <span v-if="admin" class="name">Admin</span>
          <span v-else class="name">{{ dataPegawai.nama | capitalizeName }}</span>
          <div class="status">
            <div class="circle"></div>
            <span class="status-text">Online</span>
          </div>
        </div>
      </div>
      <div class="change-password" :style="isChangePassword ? '' : 'display: none'">
        <button type="button" class="close" @click="isChangePassword = false;">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="form-group">
          <label for="changePassword">Ganti Password</label>
          <input type="password" class="form-control" id="changePassword" v-model="changePassword">
        </div>
        <div class="btn btn-block btn-primary btn-sm" @click="onChangePassword(); isChangePassword = false;">Ganti</div>
      </div>
    </div>
    <div class="menu">
      <div class="menu-wrapper">
        <p>Menu Utama</p>
      </div>
      <div class="menu-item text-white" v-for="(mainMenu, iMainMenu) in menu.main.text" :key="iMainMenu" >
        <div class="main-menu" :class="currMenu.includes(mainMenu) ? 'active' : ''" @click="changeCurrMenu(mainMenu, 'main')">
          <img :src="require(`./../assets/ico/${menu.main.icon[iMainMenu]}`)" alt=""><span>{{ mainMenu }}</span>
          <a class="ahref" href="https://cuti.bkpsdmsitubondo.id" v-if="mainMenu === 'Keluar'"></a>
        </div>
        <div v-if="currMenu.includes(mainMenu)">
          <div class="sub-menu" :class="currMenu.includes(subMenu) ? 'active' : ''" v-for="(subMenu, iSubMenu) in menu.sub[iMainMenu]" :key="iSubMenu" @click="changeCurrMenu(subMenu, 'sub')">
            {{ subMenu }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../store'
export default {
  name: 'Menu',
  props: {
    dataPegawai: {},
    currMenu: '',
    admin: false
  },
  data () {
    return {
      isChangePassword: false,
      changePassword: '',
      menu: {
        main: {
          icon: [
            'rocket.svg',
            'add_database.svg',
            'shutdown.svg'
          ],
          text: [
            'Dasbor', 'Usulan', 'Keluar'
          ]
        },
        sub: [
          [], ['Cuti'], []
        ]
      }
    }
  },
  filters: {
    capitalizeName (str) {
      let temp1 = str.split(',')
      let temp2 = temp1[0].split(' ')
      let strTemp = ''
      temp2.forEach(element => {
        let t = element
        if (t.toLowerCase() !== 'dr.' || t.toLowerCase() !== 'drs.' || t.toLowerCase() !== 'h.' || t.toLowerCase() !== 'hj.' || t.toLowerCase() !== 'ir.') {
          t = t.charAt(0) + t.slice(1).toLowerCase()
        }
        strTemp += t + ' '
      })
      strTemp = temp1[1] === undefined ? strTemp.trim() : strTemp.trim() + ', ' + temp1[1]
      return strTemp
    }
  },
  methods: {
    changeCurrMenu (item, mode) {
      mode === 'main' ? this.$emit('changeCurrMenu', [item]) : this.$emit('changeCurrMenu', [this.currMenu[0], item])
    },
    onChangePassword () {
      if (this.changePassword === '') {
        //
      } else {
        axios({
          method: 'post',
          url: store.state.build === 'dev' ? 'http://127.0.0.1/php_class/' : 'https://server.cuti.bkpsdmsitubondo.id',
          data: {
            onPost: 'UpdatePassword',
            nip: this.dataPegawai.user,
            password: this.changePassword
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.$emit('onPopupOpen')
            this.$emit('isSuccess', true)
          } else {
            this.$emit('onPopupOpen')
            this.$emit('isSuccess', false)
          }
        })
      }
    }
  },
  created () {
    if (this.dataPegawai.opd_id === '5') {
      this.menu.main.icon.splice(2, 0, 'account.svg')
      this.menu.main.text.splice(2, 0, 'Akun')
    }
  }
}
</script>

<style lang="less" scoped>
#menu-wrapper {
  width: 240px;
  background-color: #222D32;
  min-height: 100vh;
  .logo {
    color: white;
    background-color: #1E6E8F;
    height: 80px;
    overflow: hidden;
    .logo-wrapper {
      cursor: pointer;
      margin-top: 8px;
      display: inline-block;
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        display: inline-block;
        width: 60px;
        vertical-align: top;
      }
      .text-wrapper {
        vertical-align: middle;
        display: inline-block;
        font-weight: 600;
        .text-layanan {
          font-size: 14px;
        }
        .text-simpati {
          font-size: 24px;
          letter-spacing: 2px;
        }
      }
    }
  }
  .profile {
    position: relative;
    min-height: 60px;
    padding: 4px 14px;
    transition: background-color 0.2s;
    &:hover {
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.05);
    }
    .change-password {
      z-index: 4;
      position: absolute;
      top: 0;
      left: calc(100% + 4px);
      min-height: 60px;
      min-width: 100%;
      background-color: white;
      padding: 8px 18px;
      border-radius: 4px;
      .form-group {
        input {
          max-height: 24px;
        }
        margin-bottom: 8px;
      }
    }
    .profile-wrapper {
      display: flex;
      align-items: center;
      justify-content: left;
      img {
        width: 60px;
      }
      .text-wrapper {
        max-width: 160px;
      }
      .name {
        max-width: 148px;
        font-weight: 600;
        font-size: 12px;
      }
      .status {
        display: flex;
        align-items: center;
        .circle {
          width: 12px;
          height: 12px;
          background-color: #3C763D;
          border-radius: 50%;
        }
        .status-text {
          font-size: 12px;
          font-weight: 600;
          padding-left: 5px;
        }
      }
    }
  }
  .menu {
    .menu-wrapper {
      height: 40px;
      background-color: #1A2226;
      p {
        color: #C4C4C4;
        font-size: 12px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        padding-left: 10px;
      }
    }
    .menu-item {
      padding-left: 10px;
      .main-menu {
        position: relative;
        cursor: pointer;
        height: 40px;
        border-left: 4px solid transparent;
        padding-left: 14px;
        transition: all 0.4s;
        display: flex;
        align-items: center;
        &.active, &:hover {
          border-color: white;
        }
      }
      img {
        width: 24px;
      }
      span {
        font-size: 18px;
        margin-left: 10px;
      }
      .sub-menu {
        position: relative;
        height: 40px;
        padding-left: 20px;
        display: flex;
        align-items: center;
        margin-left: 30px;
        border-left: 2px solid #707070;
        transition: all 0.4s;
        cursor: pointer;
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: -6.5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #707070;
          transition: all 0.4s;
        }
        &:hover, &.active {
          border-left-color: white;
          &::before {
            background-color: white;
          }
        }
      }
    }
  }
}
.ahref {
  &logo {
    width: 100%;
    height: calc(100% - 8px);
    position: absolute;
  }
  right: 0px;
  width: calc(100% + 14px);
  height: 100%;
  position: absolute;
}
</style>
