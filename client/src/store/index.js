import { createStore } from "vuex";

export default createStore({
  state: {
    departments: null,
    categories: null,
  },
  mutations: {
    setDeptList(state, payload) {
      state.departments = payload;
    },
    setCatList(state, payload) {
      state.categories = payload;
    },
  },
});
