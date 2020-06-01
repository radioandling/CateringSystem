<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="18">
        <el-table
          :data="sta_sale_data"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'ascending'}"
          max-height="300"
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
        <high-charts :options="chart_options" ref="simpleChart"></high-charts>
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
import { mapState } from "vuex"
import HighCharts from "../../commonComponents/highCharts"
const utils = require("../../utils/utils")
// 更新表格的函数
function updateChartData(data) {
  const daysList = [];
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
    })
    // 把每天的销售明细的销售额求和
    let dayMoney = 0;
    if (daySale.length > 0) {
      for (let k = 0; k < daySale.length; k++) {
        dayMoney = dayMoney + daySale[k].or_price_after_discount;
      }
    }
    daysList.push(dayMoney);
  }
  return daysList;
}
export default {
  components: {
    HighCharts
  },
  data() {
    return {
      chart_options: {
        chart: {
          type: "line"
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
          categories: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: "销售额 (元)"
          }
        },
        series: [{ data: [] }]
      }
    };
  },
  computed: {
    ...mapState({
      sta_sale_data: state => state.StaStore.sta_sale_data,
      sta_sale_will_show: state => state.StaStore.sta_sale_will_show
    })
  },
  methods: {
    on_show_detail(row) {
      this.$store.commit("UPDATE_STA_SALE_WILL_SHOW", row);
    }
  },
  watch: {
    sta_sale_data: {
      handler: function(){
        this.chart_options.series[0].data = updateChartData(this.sta_sale_data)
      },
      deep: true
    }
  },
  created() {
    this.chart_options.series[0].data = updateChartData(this.sta_sale_data)
  }
};
</script>

<style scoped lang="less">
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