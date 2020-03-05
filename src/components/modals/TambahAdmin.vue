<template>
  <div>
    <PopupTambahAdmin :success="popup.isSuccess" />
    <div class="modal fade" id="modalTambahAdmin" tabindex="-1" role="dialog" aria-labelledby="modalTambahAdminLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTambahAdminLabel">Akun Admin</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row" v-for="(item, index) in admin" :key="index">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="userOPD">ID</label>
                  <input type="text" class="form-control" id="userOPD" v-model="item.user">
                </div>
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="jenisCuti">OPD</label>
                  <select class="form-control" id="jenisCuti" v-model="item.opd_id" required>
                    <option value="" hidden selected>&lt;Pilih OPD&gt;</option>
                    <option v-for="(each_opd, index) in opd" :key="index" :value="each_opd.id">{{ each_opd.nama_opd }}</option>
                  </select>
                </div>
              </div>
            </div>
            <button class="btn btn-sm btn-block btn-success btn-add" @click="admin.push({user: 'admin', opd_id: ''})"><img src="./../../assets/ico/add.svg" alt="" srcset=""></button>
          </div>
          <div class="modal-footer">
            <button type="button" id="closeModalTambahAdmin" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" @click="buatAdmin()">Buat</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.modal-content {
  max-height: 90vh;
  overflow: auto;
  scrollbar-width: thin;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  &::-webkit-scrollbar-track {
    background: #EEEEEE;
  }
  &::-webkit-scrollbar-thumb {
    background: #DADADA;
    &:hover {
      background-color: #AAAAAA;
    }
  }
}
.btn-add {
  cursor: pointer;
  padding: 0;
  img {
    margin-top: -5px;
    width: 18px;
    height: 18px;
  }
}
</style>

<script>
import axios from 'axios'
import store from '@/store'
import $ from 'jquery'
import PopupTambahAdmin from '@/components/modals/PopupTambahAdmin.vue'
export default {
  components: {
    PopupTambahAdmin
  },
  props: ['onShow'],
  watch: {
    'admin': {
      handler (val) {
        this.admin.forEach(el => {
          if (el.opd_id !== '') {
            el.nama = `Admin ${this.opd.find(elem => { return elem.id === el.opd_id }).nama_opd}`
          }
        })
      },
      deep: true
    },
    onShow (val) {
      if (val) {
        this.admin = [
          {
            user: 'admin',
            opd_id: ''
          }
        ]
        axios({
          method: 'get',
          url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
          params: {
            onGet: 'GetAllOPD'
          }
        }).then(res => {
          this.opd = res.data
        })
      }
    }
  },
  data () {
    return {
      admin: [
        {
          user: 'admin',
          opd_id: ''
        }
      ],
      opd: [],
      popup: {
        isSuccess: false
      }
    }
  },
  methods: {
    buatAdmin () {
      axios({
        method: 'post',
        url: store.state.build === 'dev' ? 'http://127.0.0.1/server/' : 'https://server.cuti.bkpsdmsitubondo.id',
        data: {
          onPost: 'CreateAdmin',
          admin: this.admin
        }
      }).then(res => {
        $('#closeModalTambahAdmin').trigger('click')
        $('#modalPopupTambahAdmin').trigger('click')
        this.popup.isSuccess = true
        this.$emit('getAkun')
      }).catch(res => {
        $('#modalPopupTambahAdmin').trigger('click')
        this.popup.isSuccess = false
      })
    }
  }
}
</script>
