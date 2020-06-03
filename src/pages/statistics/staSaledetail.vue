<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="18">
        <high-charts class="charts" :options="month_chart_options" v-show="sta_show_sale_index === 2" ref="simpleChart"></high-charts>
        <high-charts class="charts" :options="week_chart_options" v-show="sta_show_sale_index === 1" ref="simpleChart"></high-charts>
        <el-table
          :data="sta_sale_data"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'ascending'}"
          max-height="600"
          @row-click="on_show_detail"
          show-summary
          class="detail-table"
        >
          <el-table-column prop="or_time" label="下单时间" sortable width="180"></el-table-column>
          <el-table-column prop="or_total_name" label="下单商品" align="center"></el-table-column>
          <el-table-column prop="or_total_cont" label="订单数量" sortable align="center"></el-table-column>
          <el-table-column prop="or_original_price" label="原价" sortable align="center"></el-table-column>
          <el-table-column prop="or_price_after_discount" label="折后价" sortable align="center"></el-table-column>
        </el-table>
        
      </el-col>
      <el-col :span="6">
        <div class="show-detail">
          <div class="detail-item">
            <span>商品名称：</span>
            <span>{{sta_sale_will_show.or_total_name}}</span>
          </div>
          <div class="detail-item">
            <span>下单时间：</span>
            <span>{{sta_sale_will_show.or_time}}</span>
          </div>
          <div class="detail-item">
            <span>订单金额：</span>
            <span>{{sta_sale_will_show.or_original_price}}</span>
          </div>
          <div class="detail-item">
            <span>折后价格：</span>
            <span
              style="color: #e64340; fontSize: 20px;"
            >{{sta_sale_will_show.or_price_after_discount}}</span>
          </div>
          <div class="detail-item">
            <span>会员结账：</span>
            <span>{{sta_sale_will_show.or_is_vip ? '是' : '否'}}</span>
          </div>
          <div class="detail-item">
            <span>会员账号：</span>
            <span>{{sta_sale_will_show.or_vip_phone}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HighCharts from "../../commonComponents/highCharts";
const utils = require("../../utils/utils");
// 更新月表格的函数
function updateMonthChartData(data) {
  const monthList = [];
  const month =
    new Date().getMonth() + 1 >= 10
      ? new Date().getMonth() + 1
      : "0" + (new Date().getMonth() + 1);
  for (let i = 1; i < 32; i++) {
    // 拼接每一天的日期
    let j = i >= 10 ? i : "0" + i;
    let date = `2020年${month}月${j}日`;
    // 每天的销售明细
    var daySale = data.filter(item => {
      return item.or_time.slice(0, 11) === date;
    });
    // 把每天的销售明细的销售额求和
    let dayMoney = 0;
    if (daySale.length > 0) {
      for (let k = 0; k < daySale.length; k++) {
        dayMoney = dayMoney + daySale[k].or_price_after_discount;
      }
    }
    monthList.push(dayMoney);
  }
  return monthList;
}
// 更新周表格的函数
function updateWeekChartData(data) {
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  // 算出这个月有多少天的函数
  function getMonthLength(year, month) {
    let monthLength;
    if (year % 4 === 0) {
      switch (month) {
        case 1:
          monthLength = 31;
          break;
        case 2:
          monthLength = 29;
          break;
        case 3:
          monthLength = 31;
          break;
        case 4:
          monthLength = 30;
          break;
        case 5:
          monthLength = 31;
          break;
        case 6:
          monthLength = 30;
          break;
        case 7:
          monthLength = 31;
          break;
        case 8:
          monthLength = 31;
          break;
        case 9:
          monthLength = 30;
          break;
        case 10:
          monthLength = 31;
          break;
        case 11:
          monthLength = 30;
          break;
        case 12:
          monthLength = 31;
          break;
      }
    } else {
      switch (month) {
        case 1:
          monthLength = 31;
          break;
        case 2:
          monthLength = 28;
          break;
        case 3:
          monthLength = 31;
          break;
        case 4:
          monthLength = 30;
          break;
        case 5:
          monthLength = 31;
          break;
        case 6:
          monthLength = 30;
          break;
        case 7:
          monthLength = 31;
          break;
        case 8:
          monthLength = 31;
          break;
        case 9:
          monthLength = 30;
          break;
        case 10:
          monthLength = 31;
          break;
        case 11:
          monthLength = 30;
          break;
        case 12:
          monthLength = 30;
          break;
      }
    }
    return monthLength;
  }

  // 返回：上个月的天数，这个月的天数； 
  // 返回： 前一个月，这个月，后一个月的月份字符串
  // 返回： 前三天，前两天，前一天，今天，后一天，后两天，后三天的日期字符串
  function formatDate(year, month, day) {
    let preMon = month - 1 > 0 ? month - 1 : 12;
    let preMonLen = getMonthLength(year, preMon);
    let curMonLen = getMonthLength(year, month);
    let month_0 = "", month_1 = "", month_2 = "";
    // 定义前一个月的月份格式
    if (month - 1 <= 0) {
      month_0 = "12月";
    } else {
      month_0 = month - 1 > 9 ? `${month - 1}月` : `0${month - 1}月`;
    }
    // 定义当月的月份格式
    month_1 = month > 9 ? `${month}月` : `0${month}月`;
    // 定义后一个月的月份格式
    if (month + 1 > 12) {
      month_2 = "01月";
    } else {
      month_2 = month + 1 > 9 ? `${month + 1}月` : `0${month + 1}月`;
    }
    let day_0 = "",
      day_1 = "",
      day_2 = "",
      day_3 = "",
      day_4 = "",
      day_5 = "",
      day_6 = "";
    // 一周的第一天的格式
    if (day - 3 > 0) {
      if (day - 3 > 9) {
        day_0 = `${day - 3}日`;
      } else {
        day_0 = `0${day - 3}日`;
      }
    } else {
      day_0 = `${preMonLen - (3 - day)}日`;
    }
    // 一周的第二天的格式
    if (day - 2 > 0) {
      if (day - 2 > 9) {
        day_1 = `${day - 2}日`;
      } else {
        day_1 = `0${day - 2}日`;
      }
    } else {
      day_1 = `${preMonLen - (2 - day)}日`;
    }
    // 一周的第三天的格式
    if (day - 1 > 0) {
      if (day - 1 > 9) {
        day_2 = `${day - 1}日`;
      } else {
        day_2 = `0${day - 1}日`;
      }
    } else {
      day_2 = `${preMonLen - (1 - day)}日`;
    }
    // 一周第四天的格式
    day_3 = day > 9 ? `${day}日` : `0${day}日`;
    // 一周第五天的格式
    if (day + 1 > 9) {
      if (day + 1 > curMonLen) {
        day_4 = `0${day + 1 - curMonLen}日`;
      } else {
        day_4 = `${day + 1}日`;
      }
    } else {
      day_4 = `0${day + 1}日`;
    }
    // 一周第六天的格式
    if (day + 2 > 9) {
      if (day + 2 > curMonLen) {
        day_5 = `0${day + 2 - curMonLen}日`;
      } else {
        day_5 = `${day + 2}日`;
      }
    } else {
      day_5 = `0${day + 2}日`;
    }
    // 一周第七天的格式
    if (day + 3 > 9) {
      if (day + 3 > curMonLen) {
        day_6 = `0${day + 3 - curMonLen}日`;
      } else {
        day_6 = `${day + 3}日`;
      }
    } else {
      day_6 = `0${day + 3}日`;
    }
    return {
      preMonLen: preMonLen,
      curMonLen: curMonLen,
      month_0: month_0,
      month_1: month_1,
      month_2: month_2,
      day_0: day_0,
      day_1: day_1,
      day_2: day_2,
      day_3: day_3,
      day_4: day_4,
      day_5: day_5,
      day_6: day_6
    };
  }

  var format = formatDate(year, month, day)
  // 算出从今天+前三天+后三天拼成的一周的日期字符串数组
  function getWeekDateList(year, format, day) {
    const weekDateList = [];
    weekDateList[0] = day - 3 > 0 ? year + '年' + format.month_1 + format.day_0 :  year + '年' + format. month_0 + format.day_0;
    weekDateList[1] = day - 2 > 0 ?  year + '年' + format.month_1 + format.day_1 :  year + '年' + format.month_0 + format.day_1;
    weekDateList[2] = day - 1 > 0 ?  year + '年' + format.month_1 + format.day_2 :  year + '年' + format.month_0 + format.day_2;
    weekDateList[3] =  year + '年' + format.month_1 + format.day_3;
    weekDateList[4] = day + 1 > format.curMonLen ?  year + '年' + format.month_2 +  format.day_4 : year + '年' + format.month_1 + format.day_4;
    weekDateList[5] = day + 2 > format.curMonLen ?  year + '年' + format.month_2 +  format.day_5 : year + '年' + format.month_1 + format.day_5;
    weekDateList[6] = day + 3 > format.curMonLen ?  year + '年' + format.month_2 +  format.day_6 : year + '年' + format.month_1 + format.day_6;
    return weekDateList;
  }
  let weekDateList = getWeekDateList(year, format, day)
  let weekLisk = []
  weekDateList.forEach((date) => {
    // 每天的销售明细
    var daySale = data.filter(item => {
      return item.or_time.slice(0, 11) === date;
    })
    // 把每天的销售明细的销售额求和
    let dayMoney = 0;
    if (daySale.length > 0) {
      for (let k = 0; k < daySale.length; k++) {
        dayMoney = dayMoney + daySale[k].or_price_after_discount;
      }
    }
    weekLisk.push(dayMoney);
  })
  return {
    weekList: weekLisk,
    weekDateList: weekDateList
  }
}

export default {
  components: {
    HighCharts
  },
  data() {
    return {
      month_chart_options: {
        chart: {
          type: 'line'
        },
        title: {
          text: "月销售量",
          style: {
            color: "#3E576F",
            align: "center",
            fontSize: "2rem"
          }
        },
        subtitle: {
          text: "Source: radio.com"
        },
        xAxis: {
          labels: {
            padding: 1,
            maxStaggerLines: 31
          },
          categories: [],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: "销售额 (元)"
          }
        },
        series: [
          { 
            name: '销售额',
            data: []
          }
        ]
      }, 
      week_chart_options: {
        chart: {
		      type: 'column'
        },
        title: {
          text: '周销售量'
        },
        subtitle: {
          text: 'Radio.com'
        },
        plotOptions: {
          column: {
            pointPadding: .2,
            borderWidth: 0,
            pointWidth: 30
          }
        },
        xAxis: {
          categories: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          labels: {
            x: -15
          },
          title: {
            text: '销售金额(元)'
          }
        },
        series: [{
          name: '销售量',
          data: [],
          
        }],
      } 
       
    };
  },
  computed: {
    ...mapState({
      sta_sale_data: state => state.StaStore.sta_sale_data,
      sta_sale_will_show: state => state.StaStore.sta_sale_will_show,
      sta_show_sale_index: state => state.StaStore.sta_show_sale_index
    })
  },
  watch: {
    sta_sale_data: {
      handler: function() {
        this.month_chart_options.series[0].data = updateMonthChartData(
          this.sta_sale_data
        );
      },
      deep: true
    }
  },
  methods: {
    on_show_detail(row) {
      this.$store.commit("UPDATE_STA_SALE_WILL_SHOW", row);
    }
  }, 
  created() { 
    // 初始化月销量表格数据
    let numbers = []
    for (let i = 1; i < 32; i++) {
      numbers.push(i)
    }
    this.month_chart_options.xAxis.categories = numbers
    this.month_chart_options.series[0].data = updateMonthChartData(this.sta_sale_data)
    // 初始化周销售表格数据
    let weekTableData = updateWeekChartData(this.sta_sale_data)
    this.week_chart_options.xAxis.categories = weekTableData.weekDateList
    this.week_chart_options.series[0].data = weekTableData.weekList

  }
};
</script>

<style scoped lang="less">
.charts{
  margin-bottom: 2rem;
}
.detail-table {
  border-radius: 0.6rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
.show-detail {
  height: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  .detail-item {
    padding: 0.5rem 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    border-bottom: 1px dashed #ccc;
    :first-child {
      font-size: 16px;
      color: #606266;
      font-weight: 350;
      border: 1px solid red;
    }
    :last-child {
      color: #409eff;
      font-size: 18px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>