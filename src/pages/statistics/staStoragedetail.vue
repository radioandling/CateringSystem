<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="16">
        <el-table
          :data="goods_data"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
          max-height="800"
          @row-click="on_show_detail"
        >
          <el-table-column prop="goods_name" label="商品名" sortable  width="180"></el-table-column>
          <el-table-column prop="goods_price" label="零售价" align="center"></el-table-column>
          <el-table-column prop="goods_cost" label="成本价" sortable  align="center"></el-table-column>
          <el-table-column prop="goods_amount" label="库存数量" sortable align="center"></el-table-column>  
        </el-table>
      </el-col>
      <el-col :span="8">
        <div class="show-detail">
          <div class="detail-item">
            <span>商品名称：</span>
            <span >{{sta_storage_will_show.goods_name}}</span>
          </div>
          <div class="detail-item">
            <span>商品零售价：</span>
            <span >{{sta_storage_will_show.goods_price}}</span>
          </div>
          <div class="detail-item">
            <span>成本价：</span>
            <span >{{sta_storage_will_show.goods_cost}}</span>
          </div>
          <div class="detail-item">
            <span>库存数量：</span>
            <span 
              :id="(sta_storage_will_show.goods_amount < 10) ? 'low-number' : ''"
            >
              {{sta_storage_will_show.goods_amount}}
            </span>
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
      goods_data: state => state.PosStore.goods_data,
      sta_storage_will_show: state => state.StaStore.sta_storage_will_show,
    })
  },
  methods: {
    on_show_detail(row){
      this.$store.commit('UPDATE_STA_STORAGE_WILL_SHOW', row)
    }
  }
}
</script>

<style scoped lang="less">
#low-number{
  color: #e64340;
}
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