<template>
  <div>
    <div class="list-search">
      <el-input placeholder="请输入手机号码" v-model="entered_phone" @input="on_search_vip"></el-input>
    </div>
    <div class="search-result" v-show="show_result">
      <ul class="result-list">
        <li
          class="result-item"
          v-for="item in research_result"
          :key="item.vip_id"
          @click="on_show_vip(item._id)"
        >{{item.vip_phone}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      entered_phone: "",
      show_result: false,
      research_result: []
    };
  },
  computed: {
    ...mapState({
      vip_table_data: state => state.VipStore.vip_table_data
    })
  },
  watch: {},
  methods: {
    on_search_vip() {
      // 1.拿到输入的值，2.搜索有没有结果，3.有结果就将结果框显示出来
      // 利用防抖的思想进行优化
      var that = this
      function searchVip(entered_phone) {
        let result = that.vip_table_data.filter(item => {
          return item.vip_phone.indexOf(entered_phone) >= 0
        })
        if (entered_phone.length > 0) {
          if (result.length > 0) {
            that.research_result = [].concat(result)
            that.show_result = true
          } else {
            that.show_result = false
          }
        } else {
          that.show_result = false
        }
      }
      function debounce (fn, delay){
        return function(args){
          let _args = args
          clearTimeout(fn.id)
          fn.id = setTimeout(() => {
            fn.call(that, _args)
          }, delay)
        }
      }
      debounce(searchVip(that.entered_phone), 600)
    },
    on_show_vip(vipId) {
      // 点击搜索到的每一项的时候右边就显示这一项的内容
      const vip_will_show = this.vip_table_data.filter(item => {
        return item._id === vipId
      })[0];
      this.$store.commit("UPDATE_VIP_WILL_SHOW", vip_will_show)
      // 清空搜索结果列表和输入框的内容
      this.research_result = []
      this.entered_phone = ""
    }
  }
}
</script>

<style scoped lang="less">
.list-search /deep/ .el-input {
  width: 100%;
}
.list-search /deep/ .el-input__inner {
  height: 30px;
}
.list-search {
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.search-result {
  margin-top: 5px;
  width: 100%;
  background-color: #fff;
  border-radius: 5px;
  .result-list {
    .result-item {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ebeef5;
      color: #606266;
    }
  }
}
</style>