import { createStore } from 'vuex'
import { DemoConstructStore } from '../views/demo-construct'

export default createStore({
  state: {
    loading: false,
    storeCount: 0
  },
  mutations: {
    // loading
    setLoading (state, data) {
      state.loading = data
    },
    increment (state, data) {
      state.storeCount++
    }
  },
  getters: {
    storeCount (state, getters, rootState, rootGetters) {
      return state.storeCount + rootState.storeCount
    }
  },
  actions: {
    // loading
    setActionsLoading ({ dispatch, commit, getters, rootGetters }, data) {
      commit('setLoading', data)
    }
  },
  modules: {
    DemoConstructStore
  }
})
