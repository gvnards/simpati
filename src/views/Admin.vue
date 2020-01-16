<template>
  <div>

  </div>
</template>

<script>
export default {
  created () {
    this.$session.clear()
    this.$session.destroy()
    this.$router.push('/')
  }
}
</script>
