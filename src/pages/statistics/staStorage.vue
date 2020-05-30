<template>
  <div>
    <div class="storage">
      <div class="storage-title"><i class="icon iconfont icon-kucun1"></i>库存</div>
      <div class="storage-content">
        <div>
          <span>总金额：</span>
          <span class="storage-colored">{{total_sum}}</span>
        </div>
        <div>
          <span>品种数：</span>
          <span class="storage-colored">{{total_amount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const utils = require('../../utils/utils')
import { mapState } from 'vuex'
export default {
  data() {
    return {
      total_sum: 0,
      total_amount: 0
    }
  },
  methods: {
  },
  mounted(){
    utils.dbGetData('CS_GOODS').then(({data}) => {
      this.$store.commit('POS_INIT_GOODS_DATA', data)
      this.$store.commit('UPDATE_STA_STORAGE_WILL_SHOW', data[0])
      // 初始化汇总数据
      this.total_sum = data.reduce((prev, curr) => {
        return prev + curr.goods_cost * curr.goods_amount
      }, 0)
      this.total_amount = data.length
    })
  }
};
</script>

<style scoped lang="less">
  .storage {
    width: 20rem;
    height: 10rem;
    border-radius: .6rem;
    background-color: #fff;
    position: relative;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, .2);
    transition: all .5s;
    &:hover{
      transform: scale(1.1);
    }
    .storage-colored {
      color: darkblue;
    }
    .storage-title {
      height: 3rem;
      line-height: 3rem;
      padding: 0 .6rem;
      box-sizing: border-box;
      font-size: 1.4rem;
      font-weight: 450;
      border-bottom: .5px solid rgb(209, 217, 219);
      i{
        font-size: 1.3rem;
        margin-right: .6rem;
        color: darkblue;
      }
    }
    .storage-content {
      height: 5rem;
      padding: 0 .6rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 1.2rem;
    }
  }
</style>