<template>
  <div>
    <div class="often-goods">
      <div class="title">常点菜品</div>
      <div class="often-goods-list">
        <ul class="clearfix">
          <li v-for="item in often_goods_data" :key="item._id" @click="add_to_orderList(item)">
            <span>{{item.goods_name}}</span>
            <span class="o-price">￥{{item.goods_price}}元</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import utils from '../../utils/utils'
export default {
  data() {
    return {
      often_goods_data: []
    }
  },
  methods: {
    add_to_orderList(choosedItem) {
      this.$store.commit('POS_ADD_TO_TABLE_LIST', choosedItem)
    }
  },
  mounted(){
    var that = this
    var goods_data = JSON.parse(localStorage.getItem('goods_data'))
    if (goods_data) {
      that.often_goods_data = goods_data.filter((item) => {
          return item.goods_hot
        })
    } else {
      const tcb_app = tcb.init({
        env: "radio528-1aaaf6"
        });
      const auth = tcb_app.auth()
      async function login() {
        await auth.signInAnonymously()
        // 匿名登录成功检测登录状态isAnonymous字段为true
        const loginState = await auth.getLoginState()
        var db = tcb_app.database()
        db.collection("CS_GOODS").limit(10000).get().then((res) => {
          that.often_goods_data = res.data.filter((item) => {
            return item.goods_hot
          })
        })
      }
      login()
    }
    
  }
}
</script>

<style scoped lang="less">
.often-goods {
  .title {
    height: 40px;
    line-height: 40px;
    padding: 0 1rem;
    box-sizing: border-box;
    border-bottom: 1px solid #d3dce6;
    background-color: #f9fafc;
    font-size: 1rem;
    color: #303133;
    font-weight: 500;
  }
  .clearfix::after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }
  .often-goods-list ul li {
    list-style: none;
    float: left;
    border: 1px solid #e5e9f2;
    padding: .8rem;
    margin: .5rem;
    font-size: 1rem;
    background-color: #fff;
    color: #606266;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, .1);
    border-radius: 5px;
    transition: all .3s;
    &:hover{
      transform: scale(1.03);
    }
  }
  .o-price {
    color: #409EFF;
  }
}
</style>