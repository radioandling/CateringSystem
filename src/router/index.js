import Vue from 'vue'
import Router from 'vue-router'
import Pos from '@/pages/pos/Pos'
import Vip from '@/pages/vip/Vip'
import Restaurant from '@/pages/restaurant/Restaurant'
import Goods from '@/pages/goods/Goods'
import Statistics from '@/pages/statistics/Statistics'
import staSaledetail from '../pages/statistics/staSaledetail.vue'
import staStoragedetail from '../pages/statistics/staStoragedetail.vue'
import staVipdetail from '../pages/statistics/staVipdetail.vue'
const utils = require("../utils/utils")
import ElementUI from 'element-ui'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pos',
      component: Pos
    },
    {
      path: '/vip',
      name: 'Vip',
      component: Vip
    },
    {
      path: '/restaurant',
      name: 'Restaurant',
      component: Restaurant
    },
    {
      path: '/goods',
      name: 'goods',
      component: Goods
    },
    {
      path: '/statistics',
      component: Statistics,
      children: [
        {path: '', component: staSaledetail},
        {path: '/stasale', component: staSaledetail},
        {path: '/stavip', component: staVipdetail},
        {
          path: '/stastorage',
          component: staStoragedetail,
          beforeEnter: (to, from, next) => {
            // 检查库存中有没有数量低于10的商品，有的话提示用户
            utils.dbGetData('CS_GOODS').then((res) => {
              var itemsLessTen = res.data.filter((item) => {
                return item.goods_amount <= 10
              })
              let totalName = ''
              itemsLessTen.forEach((item, index) => {
                if (index === itemsLessTen.length - 1) {
                  totalName += item.goods_name
                } else {
                  totalName = totalName + item.goods_name + '/'
                }
              })
              if (totalName) {
                ElementUI.Message({
                  message: `${totalName} 库存低于10了，及时补货哦`,
                  type: 'warning',
                  center: true,
                  duration: 2000
                })
              }
              next()
            })
          }
        },
      ]
    }
  ]
})
