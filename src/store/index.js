import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

const PosStore = {
  state: () => ({
    goods_data: [], // 存放整个商品表中的信息
    goods_table_data: [], // 存放正在处理的订单信息
    handup_table_data: [], // 存放挂起的详细信息
    handup_table_items: [], // 存放挂起的每一条信息
  }),
  mutations: {
    // 更新全部的商品库存信息
    POS_INIT_GOODS_DATA(state, data){
      state.goods_data = data
      state.goods_data.sort(function(a,b){
        return a.goods_amount - b.goods_amount
      })
    },
    POS_DEAL_HANDUP_ITEM(state){
      let handupItem = {
        goods_name: this.getters.orderInfo.totalName,
        goods_count: this.getters.orderInfo.totalCount,
        goods_price: this.getters.orderInfo.totalPrice
      }
      state.handup_table_items.push(handupItem)
    },
    POS_CHANGETAB(state, index){
      // PosTab组件切换tab
      state.tab_title_number = index
    },
    POS_REMOVEALLGOODS(state){
      // 清空订单列表
      state.goods_table_data = []
    },
    POS_ADD_TO_TABLE_LIST(state, choosedItem){
      const orderItem = {
        _id: choosedItem._id,
        goods_name: choosedItem.goods_name,
        goods_price: choosedItem.goods_price,
        goods_count: 1
      }
      let hasAlreadyOrderedAry = state.goods_table_data.filter(item => {
        return item._id === choosedItem._id
      })
      if (hasAlreadyOrderedAry.length > 0) {
        hasAlreadyOrderedAry[0].goods_count += 1
      } else {
        state.goods_table_data.push(orderItem)
      }
    },
    POS_REMOVE_HANDUP_TABLE_ITEM(state, index){
       // 在handup组件中，结完账，要清除掉该项
      state.handup_table_data.splice(index, 1)
      state.handup_table_items.splice(index, 1)
    }
  },
  actions: {},
  getters: {
    orderInfo(state) {
      let totalName = "",
          totalPrice = 0,
          totalCount = 0
      // 根据商品列表中的数据生成一条放在挂起界面的订单
      state.goods_table_data.forEach((item, index) => {
        if (index === state.goods_table_data.length - 1) {
          totalName += item.goods_name
        } else {
          totalName = totalName + item.goods_name + "/"
        }
        totalPrice += item.goods_price * item.goods_count
        totalCount += item.goods_count
      })
      return {
        totalName: totalName,
        totalCount: totalCount,
        totalPrice: totalPrice
      }
    },
    totalMoney(state){
      let meal = state.goods_table_data
      let totalMoney = 0
      for(let i=0; i<meal.length; i++){
        totalMoney +=  meal[i].goods_count * meal[i].goods_price
      }
      return totalMoney
    },
    totalCount(state){
      let meal = state.goods_table_data
      let totalCount = 0
      for(let i=0; i<meal.length; i++){
        totalCount +=  meal[i].goods_count
      }
      return totalCount
    }
  }
}

const VipStore = {
  state: () => ({
    vip_table_data: [], // 存放会员列表所有信息
    vip_will_show: {}, // 存放展示会员的信息
    show_vip_recharge_records: false, //存放是否展开充值记录弹窗的开关
  }),
  mutations: {
    UPDATE_VIP_WILL_SHOW(state, vip){
      state.vip_will_show = vip
    },
    INIT_VIP_TABLE_DATA(state, data){
      state.vip_table_data = data
    },
    SHOW_VIP_RECHARGE_RECORDS(state){
      state.show_vip_recharge_records = true
    },
  },
  actions: {},
  getters: {}
}

const StaStore = {
  state: () => ({
    sta_sale_data: [], // 存放所有的订单信息
    sta_sale_will_show: {}, // 存放正在展示的订单信息
    sta_storage_will_show: {}, // 存放要正在展示的库存商品，
    sta_show_sale_index: 0
  }),
  mutations: {
    // STA的mutation
    UPDATE_STA_SALE_DATA(state, data){
      state.sta_sale_data = data
    },
    UPDATE_STA_SALE_WILL_SHOW(state, order){
      state.sta_sale_will_show = order
    },
    UPDATE_STA_STORAGE_WILL_SHOW(state, storage){
      state.sta_storage_will_show = storage
    },
    UPDATE_STA_SHOW_INDEX(state, index){
      console.log(index)
      state.sta_show_sale_index = index
    }

  }
}

const store = new Vuex.Store({
  modules: {
    PosStore,
    VipStore,
    StaStore
  },
  plugins: [createPersistedState()],
})

export default store