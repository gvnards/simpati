<template>
  <div>
    <div class="text-not-found">
      <h1>Oops..</h1>
      <h2>Page Not Found</h2>
    </div>
    <img src="./../assets/blank_page.svg" alt="">
  </div>
</template>

<style lang="less" scoped>
.text-not-found {
  position: relative;
  padding-left: 4%;
  height: 110px;
  color: #BCB8FE;
  h1 {
    font-weight: 600 !important;
  }
  h2 {
    font-weight: 500 !important;
  }
}
img {
  max-width: calc(100vw - 110px);
  max-height: calc(100vh - 110px);
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
