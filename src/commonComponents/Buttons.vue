<template>
  <div class="buttons">
    <slot :checkout="on_checkout" name="checkoutButton"></slot>
    <slot :handup="on_handup_order" name="handupButton"></slot>
    <slot :remove="on_delete_all_goods" name="removeButton"></slot>
    <slot :recharge="on_recharge_vip" name="rechargeButton"></slot>
    <slot name="recordsButton"></slot>
    <slot name="showRecordsButton"></slot>
    <slot :removeVip="on_remove_vip" name="removeVipButton"></slot>
  </div>
</template>

<script>
const utils = require("../utils/utils");
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      goods_data: state => state.PosStore.goods_data,
      goods_table_data: state => state.PosStore.goods_table_data,
      handup_table_data: state => state.PosStore.handup_table_data,
      vip_will_show: state => state.VipStore.vip_will_show,
      vip_table_data: state => state.VipStore.vip_table_data
    })
  },
  methods: {
    on_checkout() {
      var that = this;
      // 检查库存的函数
      function checkNumber(num) {
        const totalData = that.goods_data;
        const tableData = that.goods_table_data;
        var checkResult = tableData.every(curVal => {
          var totalCur = totalData.filter(item => {
            return item._id === curVal._id;
          })[0];
          return totalCur.goods_amount - curVal.goods_count > num;
        });
        return checkResult;
      }
      if (that.goods_table_data.length > 0) {
        if (checkNumber(5)) {
          // 库存减掉要买单的数量还大于5
          utils.checkOut.call(that, that.goods_table_data, that.vip_table_data);
        } else if (!checkNumber(5) && checkNumber(0)) {
          // 库存减掉要买单的数量大于0但小于5，提醒店主补货
          let warningMsgOptions = {
            duration: 1000,
            message: "有商品库存低，记得及时补货",
            type: "warning",
            center: true,
            onClose: function(){
              utils.checkOut.call(that, that.goods_table_data, that.vip_table_data)
            }
          }
          that.$message(warningMsgOptions)
        } else {
          // 库存不足，卖完了
          let failedMsgOptions = {
            duration: 1000,
            message: "库存不足，请先补货",
            type: "error",
            center: true
          }
          this.$message(failedMsgOptions);
        }
      } else {
        return false
      }
    },
    on_recharge_vip() {
      // 会员充值
      let vip = this.vip_will_show; // 代替一下，代码更好看
      var vipId = vip._id;
      this.$prompt("输入充值金额", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      }).then(({ value }) => {
        if (value === null) {
          this.$message({
            // 改变vip_table_data的值
            type: "warn",
            message: "请输入金额",
            center: true
          });
        } else {
          // 算出充值后的余额，折扣，等级，充值记录，充值总额
          let total_after_recharge = vip.vip_total_recorded + Number(value);
          vip.vip_recharge_records.push({
            amount: Number(value),
            time: utils.getTime(),
            operator: "001"
          });
          let records_after_recharge = vip.vip_recharge_records;
          let level_after_charge = "";
          let discount_after_charge = 1;
          // switch计算折扣和会员等级
          switch (true) {
            case total_after_recharge < 500:
              level_after_charge = "一星";
              discount_after_charge = 0.9;
              break;
            case total_after_recharge >= 500 && total_after_recharge < 1000:
              level_after_charge = "两星";
              discount_after_charge = 0.8;
              break;
            case total_after_recharge >= 1000 && total_after_recharge < 3000:
              level_after_charge = "三星";
              discount_after_charge = 0.75;
              break;
            case total_after_recharge >= 3000 && total_after_recharge < 5000:
              level_after_charge = "四星";
              discount_after_charge = 0.7;
              break;
            case total_after_recharge >= 5000:
              level_after_charge = "五星";
              discount_after_charge = 0.6;
              break;
          }
          tcb_app
            .callFunction({
              name: "recharge_vip",
              data: {
                id: vipId,
                level_after_charge: level_after_charge,
                balance_after_recharge: vip.vip_balance + Number(value),
                discount_after_charge: discount_after_charge,
                records_after_recharge: vip.vip_recharge_records,
                total_after_recharge: total_after_recharge
              }
            })
            .then(() => {
              this.$message({
                // 改变vip_table_data的值
                type: "success",
                message: "充值成功，感谢您的大力支持",
                center: true
              });
              // 重新获取会员数据
              utils
                .dbGetData("CS_VIP")
                // 重新刷新会员列表和会员展示列表
                .then(({ data }) => {
                  this.$store.commit("INIT_VIP_TABLE_DATA", data);
                  const vipRecharged = data.filter(item => {
                    return item._id === vipId;
                  })[0];
                  this.$store.commit("UPDATE_VIP_WILL_SHOW", vipRecharged);
                });
            });
        }
      });
    },
    on_remove_vip() {
      // 移除会员
      var vipId = this.vip_will_show._id;
      this.$confirm("是否要移除该会员？", "重要提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 根据openId将该会员从会员列表中删除
        tcb_app
          .callFunction({
            name: "remove_vip",
            data: { id: vipId }
          })
          .then(res => {
            // 做两件事情：1. 把展示的会员信息变成上一个会员，2.更新会员列表
            utils.dbGetData("CS_VIP").then(({ data }) => {
              this.$store.commit("INIT_VIP_TABLE_DATA", data);
              this.$store.commit("UPDATE_VIP_WILL_SHOW", data[0]);
            });
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
      });
    },
    // 删除所有商品
    on_delete_all_goods() {
      if (this.goods_table_data.length > 0) {
        this.$confirm("是否要删除订单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$store.commit("POS_REMOVEALLGOODS");
        });
      } else {
        return false;
      }
    },
    // 挂单功能
    on_handup_order() {
      if (this.goods_table_data.length > 0) {
        // 先向挂起订单总表推送一条数据，然后删除掉订单列表
        this.handup_table_data.push(this.goods_table_data);
        this.$store.commit("POS_DEAL_HANDUP_ITEM");
        this.$store.commit("POS_REMOVEALLGOODS");
      } else {
        return false;
      }
    }
  }
};
</script>
<style scoped lang="less">
.buttons /deep/ .el-button {
  width: 7rem;
  height: 40px;
  text-align: center;
  font-size: 14px;
}
.buttons {
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>