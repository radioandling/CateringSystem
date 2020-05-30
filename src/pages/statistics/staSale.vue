<template>
  <div>
    <div class="sale">
      <button class="sale-button" v-for="(item, index) in button_text" :key="index" @click="on_change_time_circle" v-show="show_number === index">{{item}}</button>
      <div class="sale-title">
        <i class="icon iconfont icon-xiaoliang1"></i>销量
      </div>
      <div class="sale-content">
        <div class="content-actual">
          <span>￥</span>
          <span class="sale-colored">{{caculate_sum}}</span>
        </div>
        <div class="content-progress">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="percentage"
            color="darkgoldenrod"
          >
          </el-progress>
        </div>
      </div>
      <div class="sale-goal">
        <span>目标金额</span>
        <span
          class="sale-colored" 
          v-for="(item, index) in goals" :key="index" v-show="show_number === index"
        >
          {{item}}
        </span>
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
      button_text: ['日', '周', '月'],
      show_number: 0,
      caculate_sum: 0,
      goals: [1000, 6000, 25000]
    }
  },
  computed: {
    ...mapState({
      sta_sale_data: state => state.StaStore.sta_sale_data
    }),
    percentage: function(){
      var per = parseInt((this.caculate_sum / this.goals[this.show_number]) * 100)
      var percentage = per >= 100 ? 100 : per
      return percentage
    }
  },
  methods: {
    // 计算今日汇总
    caculateSumByIndex(index){
      let time = new Date()
      let today = time.getDate()
      let formatDay = utils.getSimTime()
      let month = time.getMonth() + 1
      const data = this.sta_sale_data
      let dayOrders = data.filter((item) => {
        let dealedTime = item.or_time.split(' ')[0]
        return dealedTime === formatDay
      })
      let weekOrders = data.filter((item) => {
        let dealedTime = Number(item.or_time.slice(8,10))
        return (dealedTime <= today && dealedTime >= (today - 6 ))
      })
      let monthOrders = data.filter((item) => {
        let dealedTime = Number(item.or_time.slice(5, 7))
        return dealedTime === month
      })
      let sum = 0
      if (index === 0) {
        dayOrders.forEach((item) => {
          sum += item.or_price_after_discount
        })
        return sum
      } else if (index === 1) {
        weekOrders.forEach((item) => {
          sum += item.or_price_after_discount
        })
        return sum
      } else {
        monthOrders.forEach((item) => {
          sum += item.or_price_after_discount
        })
        return sum
      }
    },
    on_change_time_circle(){
      // 做两件事情，1.改变按钮类型，2.改变汇总金额
      // 1.改变按钮类型
      this.show_number =  this.show_number < 2 ?  this.show_number + 1 : 0
      // 2.根据index的数值，改变统计金额
      this.caculate_sum = this.caculateSumByIndex(this.show_number)
    }
  },
  mounted(){
    utils.dbGetData("CS_ORDERS").then(res => {
      // 把拿到的数据放入store里面，方便其他组件使用
      this.$store.commit("UPDATE_STA_SALE_DATA", res.data)
      this.$store.commit("UPDATE_STA_SALE_WILL_SHOW", res.data[0])
      // 初始化数据
      let formatDay = utils.getSimTime()
      const data = this.sta_sale_data
      let dayOrders = data.filter((item) => {
        let dealedTime = item.or_time.split(' ')[0]
        return dealedTime === formatDay
      })
      const sum = dayOrders.reduce((prev, curr) => {
        return prev + curr.or_price_after_discount
      }, 0)
      this.caculate_sum = sum
    })
  }
}
</script>

<style scoped lang="less">
.content-progress /deep/ .el-progress-bar__innerText{
  font-weight: 700;
}
.content-progress /deep/ .el-slider__runway{
  margin: 0;
}
.content-progress /deep/ .el-slider__bar {
  background-color: darkgoldenrod;
}
.content-progress /deep/ .el-slider__button{
  border-color: darkgoldenrod;
}
.sale {
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
  .sale-colored {
    color: darkgoldenrod;
  }
  .sale-button {
    width: 2rem;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    position: absolute;
    display: inline-block;
    right: .6rem;
    top: .4rem;
    background-color: rgb(240, 234, 222);
    border: 1px solid darkgoldenrod;
    border-radius: .3rem;
    color: darkgoldenrod;
    font-size: .8rem;
    box-shadow: 2px 2px 4px darkgoldenrod;
  }
  .sale-title {
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
      color: darkgoldenrod;
    }
  }
  .sale-content {
    height: 5rem;
    padding: .2rem .6rem;
    box-sizing: border-box;
    border-bottom: .5px solid rgb(209, 217, 219);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 1.3rem;
    margin-bottom: .2rem;
  }
  .sale-goal {
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