<template>
  <div id="menu-wrapper">
    <div class="logo">
      <div class="logo-wrapper">
        <img src="./../assets/ico/create.svg" alt="" srcset="">
        <p class="text-wrapper">
          <span class="text-layanan">Layanan</span>
          <br>
          <span class="text-simpati">SIMPATI</span>
        </p>
      </div>
    </div>
    <div class="profile">
      <div class="profile-wrapper text-white">
        <img :src="dataPegawai.JENIS_KELAMIN === 'M' ? require('./../assets/ico/private_account_male.svg') : require('./../assets/ico/private_account_female.svg')" alt="icon picture">
        <div class="text-wrapper">
          <span class="name">{{ dataPegawai.nama | capitalizeName }}</span>
          <div class="status">
            <div class="circle"></div>
            <span class="status-text">Online</span>
          </div>
        </div>
      </div>
    </div>
    <div class="menu">
      <div class="menu-wrapper">
        <p>Menu Utama</p>
      </div>
      <div class="menu-item text-white" v-for="(mainMenu, iMainMenu) in menu.main.text" :key="iMainMenu" >
        <div class="main-menu" :class="currMenu.includes(mainMenu) ? 'active' : ''" @click="changeCurrMenu(mainMenu, 'main')">
          <img :src="require(`./../assets/ico/${menu.main.icon[iMainMenu]}`)" alt=""><span>{{ mainMenu }}</span>
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
export default {
  name: 'Menu',
  props: ['dataPegawai', 'currMenu'],
  data () {
    return {
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
    min-height: 60px;
    padding: 4px 14px;
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
</style>
