import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: 'id',
    pegawai: ['asd'],
    jabatan: [],
    opd: []
  },
  mutations: {
    CHANGE_LANG (state, lang) {
      state.lang = lang
    },
    SET_PEGAWAI (state, json) {
      state.pegawai = json
    },
    SET_JABATAN (state, json) {
      state.jabatan = json
    },
    SET_OPD (state, json) {
      state.opd = json
    }
  },
  actions: {
  },
  modules: {
  }
})
