<template>
  <div id="home">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6">
          <div class="content">
            <img class="logo" src="https://cuti.bkpsdmsitubondo.id/img/logo-situbondo.png" alt="">
            <div class="logo-text">
              <p class="title">{{ $lang.aplikasi.title }}</p>
              <p class="sub-title">{{ $lang.aplikasi.subTitle }}</p>
              <p class="government">{{ $lang.aplikasi.government }}</p>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="login-wrapper">
            <div class="container">
              <p class="title">{{ $lang.login.title }}</p>
              <p class="subTitle">{{ $lang.login.subTitle }}</p>
              <div class="form-container">
                <div class="form-group">
                  <input v-model="login.username" type="text" class="form-control" :placeholder="$lang.input.placeholder.username">
                  <input v-model="login.password" type="password" class="form-control" :placeholder="$lang.input.placeholder.password">
                </div>
                <button type="button" class="btn btn-primary btn-md btn-block text-uppercase" :disabled="button.masuk.disable" @click="$emit('login', login)">{{ $lang.button.masuk }}</button>
              </div>
              <div class="catatan-wrapper">
                <p class="catatan">{{ $lang.login.catatan }} :</p>
                <p class="catatanDesc">{{ $lang.login.catatanDesc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['button'],
  data () {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    changeLang (lang) {
      this.$setLang(lang)
      this.$store.commit('CHANGE_LANG', lang)
    }
  }
}
</script>

<style lang="less" scoped>
#home {
  position: relative;
  width: 100%;
  background-image: url("https://cuti.bkpsdmsitubondo.id/img/bg-login.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  .col-lg-6 {
    min-height: 100vh;
    .content {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      color: white;
      .logo {
        width: 80px;
        box-sizing: border-box;
      }
      p {
        margin: 0;
      }
      .title {
        padding: 0px 8px;
        font-weight: 700;
        font-size: 32px;
        letter-spacing: 6px;
        margin-top: 20px;
        display: inline-block;
        border-bottom: 3px solid white;
      }
      .sub-title {
        font-weight: 600;
        font-size: 28px;
        margin-top: 10px;
      }
      .government {
        font-weight: 400;
        font-size: 24px;
        margin-top: 20px;
      }
    }
  }
  .login-wrapper {
    max-width: 520px;
    height: 542px;
    background-color: white;
    position: relative;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%);
    border-radius: 4px 4px 0px 0px;
    .container {
      padding: 40px;
      color: #1E6E8F;
      p {
        margin: 0;
      }
      .title {
        font-weight: 700;
        font-size: 28px;
      }
      .subTitle {
        font-size: 18px;
        margin-top: 10px;
      }
      .form-container {
        margin-top: 60px;
        input {
          height: 40px;
          font-size: 18px;
          &:focus {
            border-color: transparent;
          }
          &::placeholder {
            font-size: 18px;
            color: #1E6E8F;
          }
          margin-top: 20px;
          border-color: #1E6E8F;
          color: #1E6E8F;
        }
        button {
          height: 40px;
          font-weight: 700;
          font-size: 18px;
          margin-top: 30px;
        }
      }
      .catatan-wrapper {
        margin-top: 20px;
        font-size: 14px;
        .catatan {
          font-weight: 700;
        }
      }
    }
  }
}

@media screen and (max-width: 991px) {
  #home {
    max-height: 100vh;
  }
}
</style>
