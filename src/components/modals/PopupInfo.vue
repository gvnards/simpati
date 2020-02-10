<template>
  <div>
    <div class="modal fade" :class="show" :style="displayBlock ? 'display: block;' : ''" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="PopupInfo" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content" :class="onShow ? 'bounceIn':''">
          <div class="modal-header">
            <h5 class="modal-title" id="PopupInfo">
              <slot name="title">
                Judul
              </slot>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot>
              Isi badan
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['onShow'],
  data () {
    return {
      show: '',
      displayBlock: false
    }
  },
  watch: {
    'onShow' (val) {
      if (val) {
        this.displayBlock = true
        setTimeout(() => {
          this.show = 'show'
        }, 100)
      } else {
        this.show = ''
        setTimeout(() => {
          this.displayBlock = false
        }, 200)
      }
    }
  }
}
</script>
