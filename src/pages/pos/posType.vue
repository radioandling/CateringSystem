<template>
  <div>
    <div class="goods-type">
      <el-tabs class="type-tabs">
        <el-tab-pane label="咖啡">
          <ul class="cookList">
            <li v-for="item in coffee_goods" :key="item._Id" @click="add_to_orderList(item)">
              <div class="left-Img">
                <img :src="item.goods_img"/>
              </div>
              <div class="right-text">
                <span class="foodName">{{item.goods_name}}</span>
                <span class="foodPrice">￥{{item.goods_price}}元</span>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="雪冰">
          <ul class="cookList">
            <li v-for="item in ice_goods" :key="item._Id" @click="add_to_orderList(item)">
              <div class="left-Img">
                <img :src="item.goods_img" width="100%" />
              </div>
              <div class="right-text">
                <span class="foodName">{{item.goods_name}}</span>
                <span class="foodPrice">￥{{item.goods_price}}元</span>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="茶饮">
          <ul class="cookList">
            <li v-for="item in tea_goods" :key="item._Id" @click="add_to_orderList(item)">
              <div class="left-Img">
                <img :src="item.goods_img" width="100%" />
              </div>
              <div class="right-text">
                <span class="foodName">{{item.goods_name}}</span>
                <span class="foodPrice">￥{{item.goods_price}}元</span>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="糕点">
          <ul class="cookList">
            <li v-for="item in cake_goods" :key="item._Id" @click="add_to_orderList(item)">
              <div class="left-Img">
                <img :src="item.goods_img" width="100%" />
              </div>
              <div class="right-text">
                <span class="foodName">{{item.goods_name}}</span>
                <span class="foodPrice">￥{{item.goods_price}}元</span>
              </div>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      coffee_goods: [],
      tea_goods: [],
      ice_goods: [],
      cake_goods: []
    }
  },
  methods: {
    add_to_orderList(choosedItem) {
      this.$store.commit('POS_ADD_TO_TABLE_LIST', choosedItem)
    },
  },
  computed: {
    ...mapState({
      goods_data: state => state.PosStore.goods_data,
      goods_table_data: state => state.PosStore.goods_table_data
    })
  },
  created(){
    this.coffee_goods = this.goods_data.filter((item) => {
      return item.goods_type === 'coffee'
    })
    this.tea_goods = this.goods_data.filter((item) => {
      return item.goods_type === 'tea'
    })
    this.ice_goods = this.goods_data.filter((item) => {
      return item.goods_type === 'ice'
    })
    this.cake_goods = this.goods_data.filter((item) => {
      return item.goods_type === 'cake'
    })
  }
}
</script>

<style scoped lang="less">
.goods-type /deep/ .el-tabs__item{
  font-size: 16px;
}
.goods-type {
  margin-top: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  .cookList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    li {
      width: 30%;
      list-style: none;
      border: 1px solid #e5e9f2;
      overflow: hidden;
      background-color: #fff;
      margin: 1%;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, .1);
      transition: all .3s;
      &:hover{
        transform: scale(1.05);
      }
      .left-Img {
        width: 40%;
        height: 100%;
        img{
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      .right-text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        .foodName {
          font-size: 1rem;
          padding: 1rem;
          box-sizing: border-box;
          font-weight: 600;
          color: #e64340;
        }
        .foodPrice {
          font-size: 1rem;
          padding: 10px;
          box-sizing: border-box;
        }
      }
      
      
    }
  }
}
</style>