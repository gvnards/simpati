<template>
  <div>
    <!-- Button trigger modal -->
    <button type="button" id="btnModalInfoCuti" class="btn btn-primary" data-toggle="modal" data-target="#modalInfoCuti" hidden>
    </button>

    <!-- Modal -->
    <div class="modal fade" id="modalInfoCuti" tabindex="-1" role="dialog" aria-labelledby="modalInfoCutiLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <img :src="imgUrl[idx]" alt="" srcset="" style="width: 100%; height: 100%;">
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['idx'],
  data () {
    return {
      imgUrl: ['https://cuti.bkpsdmsitubondo.id/img/0.jpeg', 'https://cuti.bkpsdmsitubondo.id/img/1.jpeg', 'https://cuti.bkpsdmsitubondo.id/img/2.jpeg', 'https://cuti.bkpsdmsitubondo.id/img/3.jpeg', 'https://cuti.bkpsdmsitubondo.id/img/4.jpeg', 'https://cuti.bkpsdmsitubondo.id/img/5.jpeg']
    }
  }
}
</script>
