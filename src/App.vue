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

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
