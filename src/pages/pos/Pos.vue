<template>
  <div class="pos">
    <el-row>
      <!-- 订单部分 -->
      <el-col :span="8" id="order-list" class="pos-left">
        <pos-table></pos-table>
      </el-col>
      <!-- 商品部分 -->
      <el-col :span="16" class="pos-right">
        <!-- top部分 -->
        <pos-often></pos-often>
        <!-- 商品种类部分 -->
        <pos-type></pos-type>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PosTable from './posTable'
import PosOften from './posOften'
import PosType from './posType'
export default {
  components: {
    PosTable,
    PosOften,
    PosType
  },
  data() {
    return {
      often_goods_data: [],
      coffee_goods: [],
      ice_goods: [],
      tea_goods: [],
      cake_goods: [],
    }
  },
  computed: {},
  methods: {},
  mounted() {
    // 给左边部分设置高度
    var orderHeight = document.body.clientHeight
    document.getElementById("order-list").style.height = orderHeight + "px"
  }
}
</script>

<style scoped lang="less">
.pos {
  #order-list {
    height: 100%;
    background-color: #fff;
  }
}
</style>