import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: 'id',
    pegawai: {},
    atasan: [],
    jabatan: [],
    opd: [],
    dataSurat: [],
    totalCutiTahunan: -1,
    dataAkun: [],
    build: 'dev'
  },
  mutations: {
    CHANGE_LANG (state, lang) {
      state.lang = lang
    },
    SET_PEGAWAI (state, pegawai) {
      state.pegawai = pegawai
    },
    SET_ATASAN (state, array) {
      state.atasan = array
    },
    SET_JABATAN (state, json) {
      state.jabatan = json
    },
    SET_OPD (state, json) {
      state.opd = json
    },
    SET_DATASURAT (state, arr) {
      state.dataSurat = arr
    },
    SET_TOTAL_CUTI_TAHUNAN (state, total) {
      state.totalCutiTahunan = total
    },
    SET_DATA_AKUN (state, data) {
      state.dataAkun = data
    }
  },
  actions: {
  },
  modules: {
  }
})
