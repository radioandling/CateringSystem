<template>
  <div>
    <div class="info-wrapper">
      <div class="info-img">
        <img src="../../assets/imgs/liu.jpeg" width="100%" />
      </div>
      <div class="info-detail">
        <p>
          会员昵称：
          <span>{{this.vip_will_show.vip_name}}</span>
        </p>
        <p>
          联系电话：
          <span>{{this.vip_will_show.vip_phone}}</span>
        </p>
        <p>
          加入时间：
          <span>{{this.vip_will_show.vip_start}}</span>
        </p>
        <p>
          账户余额：
          <span>{{this.vip_will_show.vip_balance}}</span>
        </p>
        <p>
          会员折扣：
          <span>{{this.vip_will_show.vip_discount}}</span>
        </p>
        <p>
          充值总额：
          <span>{{this.vip_will_show.vip_total_recorded}}</span>
        </p>
        <p>
          会员等级：
          <i
            class="icon iconfont icon-huiyuan"
            v-show="this.vip_will_show.vip_total_recorded > 1"
          ></i>
          <i
            class="icon iconfont icon-huiyuan"
            v-show="this.vip_will_show.vip_total_recorded > 500"
          ></i>
          <i
            class="icon iconfont icon-huiyuan"
            v-show="this.vip_will_show.vip_total_recorded > 1000"
          ></i>
          <i
            class="icon iconfont icon-huiyuan"
            v-show="this.vip_will_show.vip_total_recorded > 3000"
          ></i>
          <i
            class="icon iconfont icon-huiyuan"
            v-show="this.vip_will_show.vip_total_recorded > 5000"
          ></i>
        </p>
      </div>
    </div>
    <!-- 操作区域 -->
    <option-buttons class="buttons-wrapper">
      <template slot-scope="{ recharge }" slot="rechargeButton">
        <el-button type="primary" @click="recharge()">会员充值</el-button>
      </template>
      <template slot="recordsButton">
        <el-button type="info" @click="on_show_recharge_records">充值记录</el-button>
      </template>
      <template slot="showRecordsButton">
        <el-button type="success" @click="on_show_consumption_records()">消费记录</el-button>
      </template>
      <template slot-scope="{ removeVip }" slot="removeVipButton">
        <el-button type="danger" @click="removeVip()">删除会员</el-button>
      </template>
    </option-buttons>
    <!-- 充值记录弹窗 -->
    <el-dialog title="充值记录" :visible.sync="show_recharge_records">
      <el-table :data="vip_will_show.vip_recharge_records" stripe max-height="200">
        <el-table-column property="time" label="时间"></el-table-column>
        <el-table-column property="amount" label="金额"></el-table-column>
        <el-table-column property="operator" label="操作员"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 消费记录弹窗 -->
    <el-dialog title="消费记录" :visible.sync="show_consumption_records">
      <el-table :data="records_will_show" stripe max-height="200">
        <el-table-column align="center" property="or_time" label="时间"></el-table-column>
        <el-table-column align="center" property="or_total_name" label="商品名称"></el-table-column>
        <el-table-column align="center" property="or_total_cont" label="商品数量"></el-table-column>
        <el-table-column align="center" property="or_original_price" label="原价"></el-table-column>
        <el-table-column align="center" property="or_price_after_discount" label="折后价"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import OptionButtons from "../../commonComponents/Buttons"
import { mapState } from "vuex"
const utils = require('../../utils/utils')

export default {
  components: {
    OptionButtons
  },
  data() {
    return {
      show_recharge_records: false,
      show_consumption_records: false,
      records_will_show: []
    };
  },
  computed: {
    ...mapState({
      vip_table_data: state => state.VipStore.vip_table_data,
      vip_will_show: state => state.VipStore.vip_will_show
    })
  },
  methods: {
    on_show_recharge_records(){
      this.show_recharge_records = true
    },
    on_show_consumption_records(){
      this.show_consumption_records = true
      // 从数据库获取数据，然后筛选出来手机号码一致的，放入表格内
      utils.dbGetData('CS_ORDERS').then((res) => {
        let records = res.data.filter((item) => {
          return item.or_vip_phone == this.vip_will_show.vip_phone
        })
        this.records_will_show = records
      })
    }
  },

}
</script>
<style scoped lang="less">
.info-wrapper {
  width: 32rem;
  height: 38rem;
  margin: 3rem auto 0;
  text-align: center;
  background-color: #fff;
  border-radius: 5%;
  border: 1px solid transparent;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  .info-img {
    width: 60%;
    margin: 1.5rem auto 0;
  }
  .info-detail {
    width: 60%;
    margin: 10px auto 0;
    text-align: left;
    :last-child {
      margin-top: 5px;
    }
    p {
      margin-top: 1rem;
      font-size: 1rem;
      color: #606266;
      font-weight: 400;
      :nth-child(last) {
        margin-top: 0;
      }
      .icon-huiyuan {
        font-size: 2rem;
        color: green;
      }
      span {
        font-size: .8rem;
        color: #f56c6c;
      }
    }
    .vip-level-text {
      margin-right: .5rem;
    }
  }
  .info-records {
    width: 50%;
    margin: 1px auto 0;
    text-align: left;
    color: #303133;
  }
}
.buttons-wrapper {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
}
</style>