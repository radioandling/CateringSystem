<template>
  <div>
    <div class="vip">
      <button
        class="vip-button"
        v-for="(item, index) in button_text" :key="index"
        @click="on_change_time_circle"
        v-show="button_number === index"
      >
        {{item}}
      </button>
      <div class="vip-title">
        <i class="icon iconfont icon-huiyuan1"></i>VIP
      </div>
      <div class="vip-content">
        <div class="content-actual">
          <span>新增会员：</span>
          <span class="vip-colored">{{caculate_sum}}</span>
        </div>
      </div>
      <div class="vip-total">
        <div>
          <span>总余额：</span>
          <span class="vip-colored">{{total_vip_balance}}</span>
        </div>
        <div>
          <span>总人数：</span>
          <span class="vip-colored">{{total_vip_amount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
const utils = require('../../utils/utils')
export default {
  data() {
    return {
      button_text: ['日', '周', '月'],
      button_number: 0,
      total_vip_amount: 0,
      total_vip_balance: 0,
      caculate_sum: 0
    }
  },
  computed: {
    ...mapState({
      vip_table_data: state => state.VipStore.vip_table_data
    })
  },
  methods: {
    // 计算今日汇总
    caculateSumByIndex(index){
      let time = new Date()
      let today = time.getDate()
      let formatDay = utils.getSimTime()
      let month = time.getMonth() + 1
      const data = this.vip_table_data
      let dayOrders = data.filter((item) => {
        let dealedTime = item.vip_start.split(' ')[0]
         return dealedTime === formatDay
      })
      let weekOrders = data.filter((item) => {
        let dealedTime = Number(item.vip_start.slice(8,10))
        return (dealedTime <= today && dealedTime >= (today - 6 ))
      })
      let monthOrders = data.filter((item) => {
        let dealedTime = Number(item.vip_start.slice(5, 7))
        return dealedTime === month
      })
      let sum = 0
      if (index === 0) {
        sum = dayOrders.length
        return sum
      } else if (index === 1) { 
        sum = weekOrders.length
        return sum
      } else {
        sum = monthOrders.length
        return sum
      }
    },
    on_change_time_circle(){
      // 做两件事情，1.改变按钮类型，2.改变汇总金额
      // 1.改变按钮类型
      this.button_number =  this.button_number < 2 ?  this.button_number + 1 : 0
      // 2.根据index的数值，改变统计金额
      this.caculate_sum = this.caculateSumByIndex(this.button_number)
    }
  },
  mounted(){
    // 把数据放入到store里面去
    utils.dbGetData("CS_VIP").then(res => {
      const data = res.data
      this.$store.commit("INIT_VIP_TABLE_DATA", data)
      this.$store.commit("UPDATE_VIP_WILL_SHOW", data[0])
      this.total_vip_amount = data.length // 初始化总会员数
      this.total_vip_balance = data.reduce((prev, curr) => {
        return prev + curr.vip_balance
      }, 0) // 初始化总会员余额
      // 初始化日汇总数据
      let formatDay = utils.getSimTime()
      let dayOrders = data.filter((item) => {
        let dealedTime = item.vip_start.split(' ')[0]
        return dealedTime === formatDay
      })
      this.caculate_sum = dayOrders.length
    }) 
  }
  
};
</script>
<style scoped lang="less">
.vip {
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
  .vip-colored {
    color: darkgreen;
  }
  .vip-button {
    width: 2rem;
    height: 1.5rem;
    line-height: 1.5rem;
    position: absolute;
    display: block;
    right: .6rem;
    top: .4rem;
    background-color: rgb(214, 245, 214);
    border: 1px solid darkgreen;
    border-radius: .3rem;
    color: darkgreen;
    font-size: .8rem;
    box-shadow: 2px 2px 4px darkgreen;
  }
  .vip-title {
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
      color: darkgreen;
    }
  }
  .vip-content {
    height: 5rem;
    padding: 0 .6rem;
    box-sizing: border-box;
    border-bottom: .5px solid rgb(209, 217, 219);
    display: flex;
    flex-direction: column;
    justify-content: center;
    .content-actual {
      font-size: 1.3rem;
      margin-bottom: .2rem;
    }
  }
  .vip-total {
    height: 2rem;
    line-height: 2rem;
    padding: 0 .6rem 0 .6rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 1em;
    }
  }
}
</style>