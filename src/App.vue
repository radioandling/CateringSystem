<template>
  <div id="app">
    <left-nav></left-nav>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const utils = require('./utils/utils')
import LeftNav from '@/commonComponents/leftNav'
export default {
  name: 'App',
  components: {
    LeftNav
  },
  created(){
    utils.dbGetData('CS_VIP').then((res) => {
      this.$store.commit('INIT_VIP_TABLE_DATA', res.data)
      this.$store.commit('UPDATE_VIP_WILL_SHOW', res.data[0])
    })
    utils.dbGetData('CS_GOODS').then((res) => {
      this.$store.commit('POS_INIT_GOODS_DATA', res.data)
    })
  },
  mounted(){
    
  }
}
</script>

<style lang="less" scoped>
  #app {
  font-family: 'Microsoft YaHei','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  height:100%;
  .main{
    float:left;
    width:95%; 
    background-color: #EFF2F7;
    height:100%;
    overflow: auto;
  }
}


</style>
