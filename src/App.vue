<template>
  <div id="app">
    <left-nav></left-nav>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const utils = require("./utils/utils");
import LeftNav from "@/commonComponents/leftNav";
import tcb from 'tcb-js-sdk';
export default {
  name: "App",
  components: {
    LeftNav
  },
  mounted() {
    var that = this
    const tcb_app = tcb.init({
      env: "radio528-1aaaf6"
    });
    const auth = tcb_app.auth()
    async function login() {
      await auth.signInAnonymously()
      // 匿名登录成功检测登录状态isAnonymous字段为true
      const loginState = await auth.getLoginState()
      var db = tcb_app.database()
      // 获取到商品信息，放到localStorage里面去
      db.collection("CS_GOODS").limit(10000).get().then((res) => {
        that.$store.commit("POS_INIT_GOODS_DATA", res.data)
        localStorage.setItem('goods_data', JSON.stringify(res.data))
      })
      // 获取到订单信息，放到localStorage里面去
      db.collection('CS_ORDERS').limit(10000).get().then((res) => {
        that.$store.commit("UPDATE_STA_SALE_DATA", res.data)
        that.$store.commit("UPDATE_STA_SALE_WILL_SHOW", res.data[0])
        localStorage.setItem('sale_data', JSON.stringify(res.data))
      })
      // 获取到会员信息，放到localStorage里面去
      db.collection("CS_VIP").limit(10000).get().then((res) => {
        that.$store.commit("INIT_VIP_TABLE_DATA", res.data)
        that.$store.commit("UPDATE_VIP_WILL_SHOW", res.data[0])
        localStorage.setItem('vip_data', JSON.stringify(res.data))
      })
    }
    login()
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: "Microsoft YaHei", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  height: 100%;
  .main {
    float: left;
    width: 95%;
    background-color: #eff2f7;
    height: 100%;
    overflow: auto;
  }
}
</style>
