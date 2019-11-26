import Vue from 'vue'
import Vuex from 'vuex'
import pegawai from './pegawai.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: 'id',
    pegawai: pegawai,
    jabatan: [],
    opd: []
  },
  mutations: {
    CHANGE_LANG (state, lang) {
      state.lang = lang
    },
    GET_PEGAWAI (state, json) {
      state.pegawai = json
    },
    GET_JABATAN (state, json) {
      state.jabatan = json
    },
    GET_OPD (state, json) {
      state.opd = json
    }
  },
  actions: {
  },
  modules: {
  }
})
