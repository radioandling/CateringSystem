<template>
  <div class="sta">
    <div class="sta-top">
      <router-link tag="div" to="/stasale">
        <sta-sale></sta-sale>
      </router-link>
      <router-link tag="div" to="/stavip">
        <sta-vip></sta-vip>
      </router-link>
      <router-link tag="div" to="/stastorage">
        <sta-storage></sta-storage>
      </router-link>
    </div>
    <div class="sta-body">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import StaStorage from "./staStorage"
import StaVip from "./staVip"
import StaSale from "./staSale"
import StaSaledetail from "./staSaledetail"
import StaStoragedetail from "./staStoragedetail"
import StaVipdetail from "./staVipdetail"

export default {
  components: {
    StaStorage,
    StaVip,
    StaSale,
    StaSaledetail,
    StaStoragedetail,
    StaVipdetail
  },
  data() {
    return {}
  },
  
}
</script>

<style scoped lang="less">
.sta {
  height: 100%;
  .sta-top {
    width: 100%;
    height: 12rem;
    padding: 1rem 0 1rem 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: rgb(212, 209, 209);
  }
  .sta-body {
    padding: 10px 20px 20px 20px;
  }
}
</style>