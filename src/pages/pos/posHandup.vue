<template>
  <div>
    <div class="order-handup">
      <el-table :data="handup_table_items" style="width: 100%">
        <el-table-column prop="goods_name" label="商品"></el-table-column>
        <el-table-column prop="goods_count" label="数量" width="40"></el-table-column>
        <el-table-column prop="goods_price" label="价格" width="60"></el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              @click="checkout_in_handup(scope.$index, scope.row)"
            >结账</el-button>
            <el-button
              type="danger"
              size="small"
              @click="delete_in_handup(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
const utils = require('../../utils/utils')
import Buttons from '../../commonComponents/Buttons'
const tcb_app = utils.tcbInit()
export default {
  components:{},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      goods_data: state => state.PosStore.goods_data,
      handup_table_items: state => state.PosStore.handup_table_items,
      handup_table_data: state => state.PosStore.handup_table_data,
      vip_table_data: state => state.VipStore.vip_table_data,
    })
  },
  methods: {
    // 挂单页面结账
    checkout_in_handup(index, item) {
      var that = this
      function checkNumber(index, num) {
        const totalData = that.goods_data
        console.log(that.handup_table_data)
        const tableData = that.handup_table_data[index]
        var checkResult = tableData.every(curVal => {
          var totalCur = totalData.filter(itm => {
            return itm._id === curVal._id;
          })[0]
          return totalCur.goods_amount - curVal.goods_count > num;
        })
        return checkResult
      }
      if (checkNumber(index, 5)) {
        // 库存减掉要买单的数量还大于5
        utils.checkOut.call(that, that.handup_table_data, that.vip_table_data, index)
      } else if (!checkNumber(index, 5) && checkNumber(index, 0)) {
        // 库存减掉要买单的数量大于0但小于5，提醒店主补货
        let warningMsgOptions = {
          duration: 500,
          message: "有商品库存低，记得及时补货",
          type: "warning",
          center: true,
          onClose: function(){
            utils.checkOut.call(that, that.handup_table_data, that.vip_table_data, index)
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
    },
    // 挂单界面删除
    delete_in_handup(index, item) {
      this.$store.commit('POS_REMOVE_HANDUP_TABLE_ITEM', index)
    }
  }
}
</script>

<style scoped>
</style>