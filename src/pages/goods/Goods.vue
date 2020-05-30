<template>
  <div>
    <div>
      <ul class="cookList">
        <li v-for="(item, index) in goods_data" :key="item._Id">
          <div class="cookList-left">
            <div class="left-Img">
              <img :src="item.goods_img" />
            </div>
          </div>
          <div class="cookList-right">
            <div class="right-top">
              <span class="good-name">{{item.goods_name}}</span>
              <span class="good-price" v-show="!(change_item_index === index)">￥{{item.goods_price}}元</span>
              <span 
                v-show="!(change_item_index === index)" class="good-storage" 
              >
                库存：
                <span
                  :class="[(item.goods_amount <= 20 || item.goods_amount > 100)? 'redFont' : '']"
                >
                  {{item.goods_amount}}
                </span>
              </span>
              <div v-show="change_item_index === index" class="show-price-change">
                <span @click="on_decrese_price(item)">-</span>
                <span>￥{{item.goods_price}}</span>
                <span @click="on_increse_price(item)">+</span>
              </div>
              <div v-show="change_item_index === index" class="show-amount-change">
                <label>库存：</label>
                <input type="text" :value="item.goods_amount" @input="on_change_amount" />
              </div>
            </div>
            <div class="right-bottom">
              <el-button
                size="medium"
                type="primary"
                icon="el-icon-edit"
                circle
                key="btn0"
                @click="on_toggle_change(item, index)"
              ></el-button>
              <transition name="toggle1">
                <el-button
                  size="medium"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="on_remove_goods(item)"
                  v-show="change_item_index === index"
                ></el-button>
              </transition>
              <transition name="toggle2">
                <el-button
                  size="medium"
                  type="success"
                  icon="el-icon-check"
                  circle
                  key="btn2"
                  v-show="change_item_index === index"
                  @click="on_update_goods(item)"
                ></el-button>
              </transition>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
const utils = require('../../utils/utils')
const tcb_app = utils.tcbInit()
import { mapState } from 'vuex'
export default {
  data() {
    return {
      change_item_index: undefined,
      entered_amount: 0,
      entered_price: 0,
      changing_item: {
        id: '',
        amount: undefined,
        price: undefined
      },
      okNext: true
    }
  },
  computed: {
    ...mapState({
      goods_data: state => state.PosStore.goods_data
    })
  },
  methods: {
    on_toggle_change(item, index) {
      var changgingInfo = this.goods_data[index]
      if (this.change_item_index === undefined) {
        this.changing_item = {
          id: changgingInfo._id,
          amount: changgingInfo.goods_amount,
          price: changgingInfo.goods_price
        }
        this.change_item_index = index
        this.changing_item.price = item.goods_price
      } else {
        this.change_item_index = undefined
      }
    },
    on_decrese_price(item) {
      item.goods_price -= 1
      item.goods_price < 1
        ? (this.changing_item.price = 1)
        : (this.changing_item.price = item.goods_price)
    },
    on_increse_price(item) {
      item.goods_price += 1
      this.changing_item.price = item.goods_price
    },
    on_change_amount(e) {
      this.changing_item.amount = Number(e.target.value)
    },
    on_update_goods(item) {
      // 在防抖的基础上做了一个前摇：1秒内多次点击保存圆钮的时候，只发送一次请求
      const _this = this
      let timer = null
      if (_this.okNext) {
        _this.okNext = false
        update_goods(item)
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        _this.okNext = true
      }, 2000)
      // 更新商品数量以及价格
      function update_goods(item){ 
        _this.changing_item.id = item._id
        tcb_app
          .callFunction({
            name: "updateCSGOODS",
            data:  _this.changing_item
          })
          .then(() => {
            utils.dbGetData('CS_GOODS').then(({data}) => {
               _this.$store.commit('POS_INIT_GOODS_DATA', data)
            })
            _this.change_item_index = undefined
          })
          .catch(err => {console.log(err)})
      } 
    },
    on_remove_goods(item) {
      this.$message({
        type: 'danger',
        message: '操作风险较高，暂不提供',
        duration: 1000,
        center: true
      })
    }
  }
}
</script>


<style scoped lang="less">
.right-bottom /deep/ .el-button--primary{
  transition: all 2s;
}
.redFont{
  color: #e64340;
  font-weight: 800;
}
.cookList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  li {
    width: 23%;
    height: 200px;
    list-style: none;
    border: 1px solid #e5e9f2;
    overflow: hidden;
    background-color: #fff;
    margin: 8px;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    &:hover {
      transform: scale(1.03);
    }
    .cookList-left {
      width: 40%;
      overflow: hidden;
      .left-Img {
        width: 100%;
        height: 100%;
        position: relative;
        img {
          width: 80%;
          height: 80%px;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
    .cookList-right {
      width: 60%;
      overflow: hidden;
      .right-top {
        height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .good-name {
          font-size: 20px;
          box-sizing: border-box;
          font-weight: 500;
          color: #e64340;
        }
        .good-price {
          font-size: 18px;
          box-sizing: border-box;
        }
        .good-storage{
          font-size: 18px;
          box-sizing: border-box;
        }
        .show-price-change {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          span {
            height: 20px;
            line-height: 20px;
            margin-right: 6px;
          }
          :nth-child(odd) {
            display: inline-block;
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            color: #fff;
            border-radius: 50%;
            background-color: rgb(118, 212, 146);
          }
        }
        .show-amount-change {
          input {
            width: 60px;
            height: 20px;
          }
        }
      }
      .right-bottom {
        height: 40%;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
.toggle1-enter, .toggle1-leave-to{
  opacity: 0;

}
.toggle1-enter-active, .toggle1-leave-active{
  transition: all 1s;
}
.toggle1-enter-to, .toggle1-leave{
  opacity: 1;
}

.toggle2-enter, .toggle2-leave-to{
  opacity: 0;
}
.toggle2-enter-active, .toggle2-leave-active{
  transition: all 1s;
}
.toggle2-enter-to, .toggle2-leave{
  opacity: 1;
}
</style>