<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    userIdle () {
      let idleTime = 0
      setInterval(() => {
        idleTime = idleTime + 1
        if (idleTime > 14) {
          this.$session.clear()
          this.$session.destroy()
          this.$router.push('/')
        }
      }, 60000)
      document.addEventListener('keypress', (ev) => {
        idleTime = 0
      })
      document.addEventListener('mousemove', (ev) => {
        idleTime = 0
      })
    }
  },
  created () {
    this.userIdle()
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .btn-primary {
    background-color: #1E6E8F !important;
    border-color: #1E6E8F !important;
    &:hover {
      border-color: rgb(23, 93, 122) !important;
      background-color: rgb(23, 93, 122) !important;
    }
    &:active {
      border-color: rgb(16, 67, 88) !important;
      background-color: rgb(16, 67, 88) !important;
    }
  }
  button {
    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
