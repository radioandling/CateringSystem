<template>
  <div>
    <div class="post-tab">
      <p
        v-for="(item, index) in tab_titles"
        :key="index"
        :data-index="index"
        :class="{'tab-title-active': index === tab_title_number}"
        @click="changeTabTitle(index)"
      >{{item}}</p>
    </div>
    <!-- 移动的bar -->
    <div class="tab-move-bar" ref="moveBar"></div>
    <div class="order-meal" v-show="tab_title_number === 0">
      <el-table
        :data="goods_table_data"
        style="width: 100%"
      >
        <el-table-column prop="goods_name" label="商品" align="center"></el-table-column>
        <el-table-column prop="goods_count" label="数量" align="center" ></el-table-column>
        <el-table-column prop="goods_price" label="单价" align="center" ></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="delete_single_item(scope.$index, scope.row)"
            >删除</el-button>
            <el-button type="text" size="small" @click="add_item_count(scope.row)">增加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="order-total">
        <p><span>总数量：</span><span>{{totalCount}}</span></p>
        <p><span>总金额：</span><span>{{totalMoney}} 元</span></p>
      </div>
      <buttons class="order-buttons">
        <template slot-scope="{ checkout }" slot="checkoutButton">
          <el-button type="primary" @click="checkout()">结账</el-button>
        </template>
        <template slot-scope="{ handup }" slot="handupButton">
          <el-button type="warning" @click="handup()">挂单</el-button>
        </template>
        <template slot-scope="{ remove }" slot="removeButton">
          <el-button type="danger" @click="remove()">删除</el-button>
        </template>
      </buttons>
    </div>
    <div class="order-handup" v-show="tab_title_number === 1">
      <pos-handup></pos-handup>
    </div>
    <div class="order-express" v-show="tab_title_number === 2">
      该功能暂未开发
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import PosHandup from './posHandup'
import Buttons from '../../commonComponents/Buttons'
export default {
  components: {
    PosHandup,
    Buttons
  },
  data() {
    return {
      tab_titles: ["点餐", "挂单", "外卖"],
      tab_title_number: 0,
    }
  },
  computed: {
    ...mapState({
      goods_table_data: state => state.PosStore.goods_table_data
    }),
    ...mapGetters({
      totalMoney: 'totalMoney',
      totalCount: 'totalCount'
    })
  },
  methods: {
    changeTabTitle(index) {
      this.tab_title_number = index // 控制字体颜色
      var clientWidth = document.body.clientWidth
      var translateDistance = (index * 0.95 * 8 * clientWidth) / 24 / 3; //计算偏移的距离
      this.$refs.moveBar.style.transform = `translateX(${translateDistance}px)` // 控制div移动
    },
    // 单条商品数量加1
    add_item_count(choosedItem) {
      this.goods_table_data.forEach((item) => {
        item._id === choosedItem._id ? item.goods_count += 1 : item.goods_count = item.goods_count
      })
    },
    // 删除单条商品
    delete_single_item(index, item) {
      // 通过scope.$index, scope.row两个参数实际上获取到的是, 当前列的index和该项的数据
      this.goods_table_data.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
.post-tab {
  padding: .9rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  p {
    width: 33.333%;
    text-align: center;
    font-size: 1rem;
  }
  .tab-title-active {
    color: #409eff;
    font-weight: 500;
  }
}
.tab-move-bar {
  width: 33.333%;
  height: 2px;
  background-color: #409eff;
  transition: all .3s;
}
.order-total{
  margin-top: 1.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 1rem;
  p{
    margin-right: 2rem;
    :last-child{
      font-weight: 600;
      font-size: 1rem;
      color: #e64340;
    }
  }
}
</style>