<template>
  <div class="vip">
    <el-row class="vip-wrapper">
      <!-- 左边部分 -->
      <el-col :span="7" id="vip-list">
        <!-- 搜索栏 -->
        <vip-search></vip-search>
        <!-- 会员列表栏 -->
        <vip-list :vip_list_data="vip_table_data"></vip-list>
        <!-- 操作按钮部分 -->
        <div class="options-buttons">
          <el-button type="primary" @click="on_show_vip_table">新增会员</el-button>
          <el-button type="warning">规则设定</el-button>
        </div>
        <!-- 添加会员的弹窗 -->
        <div class="add_dialog">
          <el-dialog title="会员信息" :visible.sync="show_add_dialog">
            <el-form :model="vip_info">
              <el-form-item label="会员昵称">
                <el-input v-model="vip_info.vip_name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="vip_info.vip_phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="充值金额">
                <el-input
                  placeholder="500起充"
                  class="placeholderClass"
                  v-model="vip_info.vip_balance"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="show_add_dialog = false">取 消</el-button>
              <el-button type="primary" @click="on_save_new_vip">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-col>
      <!-- 右边部分 -->
      <el-col :span="17" id="vip-info">
        <vip-info ref="vipIinfo"></vip-info>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VipSearch from "./vipSearch";
import VipList from "./vipList";
import VipInfo from "./vipInfo";
import { mapState } from "vuex";
const utils = require("../../utils/utils")
const tcb_app = utils.tcbInit()
export default {
  name: "Vip",
  components: {
    VipSearch,
    VipList,
    VipInfo
  },
  data() {
    return {
      show_result: false,
      show_add_dialog: false,
      vip_info: {
        vip_name: "",
        vip_phone: "",
        vip_balance: null
      },
      vip_data: []
    };
  },
  computed: {
    ...mapState({
      vip_table_data: state => state.VipStore.vip_table_data
    })
  },
  watch: {
    vip_table_data: {
      deep: true,
      handler(newVal, oldVal) {
        newVal.forEach(item => {
          const total = item.vip_total_recorded;
          switch (true) {
            case total < 500:
              item.vip_level = "一星";
              item.vip_discount = 0.9;
              break;
            case total >= 500 && total < 1000:
              item.vip_level = "两星";
              item.vip_discount = 0.8;
              break;
            case total >= 1000 && total < 3000:
              item.vip_level = "三星";
              item.vip_discount = 0.75;
              break;
            case total >= 3000 && total < 5000:
              item.vip_level = "四星";
              item.vip_discount = 0.7;
              break;
            case total >= 5000:
              item.vip_level = "五星";
              item.vip_discount = 0.6;
              break;
          }
        });
      }
    }
  },
  mounted() {
    var clientHeight = document.body.clientHeight;
    document.getElementById("vip-list").style.height = clientHeight + "px";
    document.getElementById("vip-info").style.height = clientHeight + "px";
  },
  methods: {
    on_show_vip_table() {
      this.show_add_dialog = true;
    },
    on_save_new_vip() {
      // 保存之前先验证三件事情： 1. 手机号码格式是否规范  2. 充值金额是不是大于300  3. vip是否已经存在
      // 先拿客户的手机号码去检查是否已经存在了, 存在就不添加，不存在就添加
      var isFormatRight =/^1[3456789]\d{9}$/.test(this.vip_info.vip_phone) &&Number(this.vip_info.vip_balance) >= 500
      var isVipExsited = this.vip_table_data.filter(item => {
        return item.vip_phone === this.vip_info.vip_phone
      }).length > 0
      if (!isFormatRight) {
        this.$message({
          message: "格式不对",
          type: "warn",
          center: true,
          duration: 1000
        })
      } else {
        if (isVipExsited) {
          this.$message({
            message: "vip账户已经存在",
            type: "info",
            center: true,
            duration: 1000
          })
        } else {
          // 拼接好一条vip_info记录
          let startTime = utils.getTime();
          // 计算level和discount
          let level = "一星";
          let discount = 1;
          let balance = Number(this.vip_info.vip_balance);
          switch (true) {
            case balance < 500:
              level = "一星";
              discount = 0.9;
              break;
            case balance >= 500 && balance < 1000:
              level = "两星";
              discount = 0.8;
              break;
            case balance >= 1000 && balance < 3000:
              level = "三星";
              discount = 0.75;
              break;
            case balance >= 3000 && balance < 5000:
              level = "四星";
              discount = 0.7;
              break;
            case balance >= 5000:
              level = "五星";
              discount = 0.6;
              break;
          }
          // 后台数据已经更新好，重新调用get()方法重置列表数据
          tcb_app
            .callFunction({
              name: "add_vip",
              data: {
                id: Math.floor(Math.random() * 10000),
                name: this.vip_info.vip_name,
                start: startTime,
                level: level,
                phone: this.vip_info.vip_phone,
                balance: balance,
                discount: discount,
                recharge_records: [
                  { time: startTime, amount: balance, operator: "001" }
                ],
                total_recorded: balance
              }
            })
            .then(() => {
              utils.dbGetData("CS_VIP").then(({ data }) => {
                this.$store.commit("INIT_VIP_TABLE_DATA", data);
              });
            });
          // 保存完成，存入vip_table_data, 清空vip_info
          this.vip_info = {
            vip_name: "",
            vip_phone: "",
            vip_balance: 0
          };
          this.show_add_dialog = false;
          this.$message({
            message: "添加成功，欢迎成为我店会员",
            duration: 1000,
            type: "success"
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.options-buttons /deep/ .el-button {
  width: 100px;
}
.placeholderClass /deep/ .el-input__inner::-webkit-input-placeholder {
  color: red;
  font-size: 14px;
  opacity: 0.6;
}
// 自定义css
.vip {
  .vip-wrapper {
    #vip-list {
      background-color: rgb(210, 225, 235);
      padding: 10px;
      box-sizing: border-box;
      .options-buttons {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
    }
    #vip-info {
      background-color: rgb(228, 233, 236);
      position: relative;
    }
  }
}
</style>