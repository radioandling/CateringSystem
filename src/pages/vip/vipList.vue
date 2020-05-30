<template>
  <div class="list-body">
    <el-table
      :data="vip_list_data"
      style="width: 100%"
      max-height="500"
      stripe
      @row-click="on_show_vip_info"
    >
      <el-table-column prop="vip_name" label="姓名" ></el-table-column>
      <el-table-column prop="vip_balance" label="余额" align="center"></el-table-column>
      <el-table-column prop="vip_level" label="等级"  align="center"></el-table-column>
      <el-table-column prop="vip_phone" label="手机号码" align="center"></el-table-column>
    </el-table>
    <div class="order-total">
      <p><span>总人数：</span><span>{{totalCount}}</span></p>
      <p><span>总余额：</span><span>{{totalMoney}} 元</span></p>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    totalCount(){
      return this.vip_list_data.length
    },
    totalMoney(){
      let totalMoney = 0
      for (let i = 0; i < this.vip_list_data.length; i++) {
        totalMoney += this.vip_list_data[i].vip_balance
      }
      return totalMoney
    }
  },
  props: {
    vip_list_data: {
      type: Array,
      default(){
        return []
      }
    }
  },
  methods: {
    on_show_vip_info(row){
      this.$store.commit('UPDATE_VIP_WILL_SHOW', row)
    }
  }
}
</script>

<style scoped lang="less">
.list-body{
  margin-top: 20px;
}
.order-total{
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 1rem;
  p{
    margin-right: 30px;
    :last-child{
      font-weight: 600;
      font-size: 1.2rem;
      color: #e64340;
    }
  }
}
</style>