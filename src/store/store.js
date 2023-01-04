import Vuex from "vuex";

const store = new Vuex.Store({
  state: {
    viewer: null,
  },
  mutations: {
    initViewer(state, viewer) {
      state.viewer = viewer;
    },
  },
});

export default store;
