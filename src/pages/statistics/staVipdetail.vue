<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="16">
        <el-table
          :data="vip_table_data"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
          max-height="800"
          @row-click="on_show_detail"
        >
          <el-table-column prop="vip_name" label="昵称" width="100"></el-table-column>
          <el-table-column prop="vip_start" label="注册时间"  sortable align="center"></el-table-column>
          <el-table-column prop="vip_balance" label="余额" sortable  align="center"></el-table-column>
          <el-table-column prop="vip_phone" label="手机号码" align="center"></el-table-column>
          <el-table-column prop="vip_level" label="会员等级" align="center"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <div class="show-detail">
          <div class="detail-item">
            <span>会员昵称：</span>
            <span >{{vip_will_show.vip_name}}</span>
          </div>
          <div class="detail-item">
            <span>注册时间：</span>
            <span >{{vip_will_show.vip_start}}</span>
          </div>
          <div class="detail-item">
            <span>账户余额：</span>
            <span >{{vip_will_show.vip_balance}}</span>
          </div>
          <div class="detail-item">
            <span>手机号码：</span>
            <span>{{vip_will_show.vip_phone}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      vip_table_data: state => state.VipStore.vip_table_data,
      vip_will_show: state => state.VipStore.vip_will_show
    })
  },
  methods: {
    on_show_detail(row){
      this.$store.commit('UPDATE_VIP_WILL_SHOW', row)
    }
  }
}
</script>
<style scoped lang="less">
.show-detail{
  height: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  .detail-item{
    padding: 1rem 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    border-bottom: 1px dashed #ccc;
    :first-child{
      font-size: 16px;
      color: #606266;
      font-weight: 350;
    }
    :last-child{
      color: #409EFF;
      font-size: 18px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>