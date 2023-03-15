// 全局数据
import { createStore } from "vuex";
// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      count: 0,
      isFullscreen: false,
      buycarts: [],
    };
  },
  // 计算同步方法
  mutations: {
    // payload表示第几个

    increment(state, payload) {
      state.count += payload;
    },
    setFullscreen(state, payload) {
      state.isFullscreen = payload;
    },
    // 点击加入购物车
    addBuycarts(state, payload) {
      state.buycarts.push(payload);
    },
    // 点击加数量
    addBuycartsNum(state, payload) {

      state.buycarts[payload].num++;
    },
    // 点击减数量，如果数量等于零，就从列表中删除
    minusBuycartsNum(state, payload) {
      state.buycarts[payload].num--;
      if (state.buycarts[payload].num == 0) {
        state.buycarts.splice(payload, 1);
      }
    },
  },
  // 计算属性
  getters: {
    totalPrice(state) {
      let total = state.buycarts.reduce((pre, item) => {
        return pre + item.price * item.num;
      }, 0);
      return total;
    },

  },
  actions: {
    asyncAdd(store, payload) {
      setTimeout(() => {
        store.commit("increment", payload);
      }, 1000);
    },
  },
});

export default store;
