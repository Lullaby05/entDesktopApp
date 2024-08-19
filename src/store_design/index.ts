import * as Vuex from 'vuex';

const storeDesign = Vuex.createStore({
  state: {
    nodeMap: new Map(),
    isEdit: null,
    loginUser: JSON.parse(localStorage.getItem('loginUser') || '{}'),
    selectedNode: {},
    selectFormItem: null,
    design: {},
  },
  mutations: {
    selectedNode(state, val) {
      state.selectedNode = val;
    },
    loadForm(state, val) {
      state.design = val;
    },
    setIsEdit(state, val) {
      state.isEdit = val;
    },
    setFormId(state, val) {
      state.design.formId = val;
    },
  },
  getters: {},
  actions: {},
  modules: {},
});

export default storeDesign;
