<template>
  <div class="left-nav">
    <ul>
      <li @click="on_to_cash">
        <i class="iconfont icon-shouyin"></i>
        <div>收银</div>
      </li>
      <li @click="on_to_restaurant">
        <i class="iconfont icon-shangdianfeicanyin"></i>
        <div>店铺</div>
      </li>
      <li @click="on_to_goods">
        <i class="iconfont icon-canyin"></i>
        <div>商品</div>
      </li>
      <li @click="on_to_vip">
        <i class="iconfont icon-huiyuan"></i>
        <div>会员</div>
      </li>
      <li @click="on_to_statistics">
        <i class="iconfont icon-tongji"></i>
        <div>统计</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods:{
    on_to_cash(){
      this.$router.push({path: '/'})
    },
    on_to_vip(){
      this.$router.push({path: '/vip'})
    },
    on_to_restaurant(){
      this.$router.push({path: '/restaurant'})
    },
    on_to_goods(){
      this.$router.push({path: '/goods'})
    },
    on_to_statistics(){
      this.$router.push({path: '/statistics'})
    }
  }
};
</script>

<style scoped lang="less">
.left-nav {
  color: #fff;
  font-size: .8rem;
  height: 100%;
  background-color: #1d8ce0;
  float: left;
  width: 5%;
  .iconfont {
    font-size: 1.5rem;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
    text-align: center;
    border-bottom: 1px solid #20a0ff;
    padding: 10px;
    &:hover{
      background-color: lightskyblue;
    }
  }
}
</style>

