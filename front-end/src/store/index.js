import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    info: {},
    detail: {},
    // 用于触发api 表单验证
    validateAPIIndex: 1,
    // api 表单验证结果
    validateAPIResult: false,
    intervalList: []
  },
  mutations: {
    UPDATE_INFO(state, info) {
      state.info = info;
    },
    UPDATE_DETAIL(state, detail) {
      state.detail = detail;
    },
    doValidateApi(state) {
      state.validateAPIIndex++
    },
    updateValidateApiResult(state, result) {
      state.validateAPIResult = result
    },
    updateIntervalList(state, data) {
      state.intervalList = data
    },
    addInterval(state, item) {
      state.intervalList.push(item)
    },
    delInterval(state, id) {
      let index
      state.intervalList.some((l, i) => {
        if (l._id === id) {
          index = i
        }
      })
      if (typeof index === 'number') {
        state.intervalList.splice(index, 1)
      }
    }
  }
});
