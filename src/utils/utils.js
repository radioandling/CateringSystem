var tcb = require('tcb-js-sdk')

// 初始化 tcb_app
function tcbInit () {
  const tcb_app = tcb.init({
    env: 'radio528-1aaaf6'
  })
  // 授权登录
  tcb_app.auth().signInAnonymously()
  return tcb_app
}

// 拼接商品名称
function splicingNames(list){
  var totalName = ''
  list.forEach((item, index) => {
    if (index === list.length - 1) {
      totalName += item.goods_name
    } else {
      totalName = totalName + item.goods_name + '/'
    }
    return totalName
  })
}

// 在某个数组中搜索某个条件的结果，第一个参数是用来比对的条件，第二个参数是用来搜索的数组，第三个参数是搜索的是数组的哪个属性
function searchItem(value, data, prototype) {
  let searchResult = data.filter((item) => {
    return item[prototype] === value
  })
  return searchResult[0]
}

// 生成时间字符串
function getTime() {
  const now = new Date()
  let month = now.getMonth() + 1
  month = month < 10 ? ("0" + month) : month
  let date = now.getDate()
  date = date < 10 ? ('0' + date) : date
  let min = now.getMinutes()
  min = min < 10 ? ('0' + min) : min
  const timeNow = now.getFullYear() + '年' + month + '月' + date + '日' + ' ' + now.getHours() + ':' + min
  return timeNow
}

// 生成简单的时间（前不加0）: 2019年5月3日
function getSimTime() {
  const now = new Date()
  let month = now.getMonth() + 1
  month = month < 10 ? ("0" + month) : month
  let date = now.getDate()
  date = date < 10 ? ('0' + date) : date
  const simTimeNow = now.getFullYear() + '年' + month + '月' + date + '日'
  return simTimeNow
}

// 计算订单总金额
function caculateTotal(data) {
  let totalName = "",
    totalPrice = 0,
    totalCount = 0
  // 根据商品列表中的数据生成一条放在挂起界面的订单
  data.forEach((item, index) => {
    if (index === data.length - 1) {
      totalName += item.goods_name
    } else {
      totalName = totalName + item.goods_name + "/"
    }
    totalPrice += item.goods_price * item.goods_count
    totalCount += item.goods_count
  })
  return {
    totalName: totalName,
    totalCount: totalCount,
    totalPrice: totalPrice
  }
}

// 更新库存的数量
function updateStorageNumber(id, amount){
  const tcb_app = tcbInit()
  tcb_app.callFunction({
    name: 'update_goods_storage',
    data: {
      id: id,
      amount: amount
    }
  }).then(() => {
    // 减掉库存之后更新库存数量
    dbGetData('CS_GOODS').then((res) => {
      this.$store.commit('UPDATE_STA_SALE_DATA', res.data)
    })
  })
}

// 用来读取数据库中数据表的数据，返回一个promise
async function dbGetData(collectionName) {
  const tcb_app = tcbInit()
  const db = tcb_app.database()
  let result = await db.collection(collectionName).limit(10000).get()
  return result
}

// 生成订单信息, 并添加到数据库中
function createOrder(searchResult, goodsDetail) {
  let that = this
  const tcb_app = tcbInit()
  const total = caculateTotal(goodsDetail)
  let discount = typeof searchResult === "object" ? searchResult.vip_discount : 1
  let vip_phone = typeof searchResult === "object" ? searchResult.vip_phone : '无'
  // 生成一整条订单信息
  let orderMessage = {
    time: getTime(),
    name: total.totalName,
    count: total.totalCount,
    isVip: (typeof searchResult === 'object'),
    vip_phone: vip_phone,
    originalPrice: Math.floor(total.totalPrice),
    priceAfterDiscount: Math.floor(total.totalPrice * discount),
    goodsDetail: goodsDetail
  }
  tcb_app.callFunction({
    name: 'add_order',
    data: {
      orderInfo: orderMessage
    }
  }).then(function(){
    dbGetData('CS_ORDERS').then(function(res){
      that.$store.commit('POS_INIT_GOODS_DATA', res.data)
      that.$store.commit('UPDATE_STA_SALE_DATA', res.data)

    })
  })
}

// 更新会员的金额
function UpdateVipBalance(searchValue, updateValue) {
  // 初始化云环境
  const tcb_app = tcbInit()
  tcb_app.callFunction({
    name: 'cut_vip_balance_down',
    data: {
      phone: searchValue,
      amount: updateValue
    }
  }).then(() => {
    // 减掉余额之后更新VIP信息
    dbGetData('CS_VIP').then((res) => {
      this.$store.commit('INIT_VIP_TABLE_DATA', res.data)
    })
  })

}

  // 1.算订单总金额，总数量等  --- 2.弹出手机输入框 --- 3. 查找会员，给出对应的订单详情弹窗  --- 4.生成订单上传到数据库中 ---- 5.改变库存量 ---- 6.提示结账成功
function checkOut(orderData, vipData, index) {
  var that = this
  const h = that.$createElement
  const itemNeedCheckout = orderData[index]
  // total是用来计算在挂单界面和点餐界面的订单总额的
  const total = (typeof index === "undefined") ? caculateTotal(orderData) : caculateTotal(itemNeedCheckout)
  // orderList是用来结完账之后减去库存的数量的数组
  const orderList = (typeof index === "undefined") ? orderData : itemNeedCheckout 
  // 1-1. 判断是否有点餐， 已经点餐， 弹出手机输入框
  if (orderData.length > 0){
    // 2. 弹出手机输入框
    let promptPromise = that.$prompt("请输入会员手机", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPlaceholder: "没有会员，请直接点击确定"
    })
    promptPromise.then(function({value}){
        let searchResult = searchItem(value, vipData, "vip_phone")
        if (searchResult) { // 3-1.找到了会员，弹出打折框
          let MsgPromise1 = that.$msgbox({
            title: "订单消息",
            message: h("div", null, [
              h("p", null, [
                h("span", null, "所购商品："),
                h(
                  "span",
                  { style: "color: #E6A23C; fontSize: 16px;" },
                  `${total.totalName}`
                )
              ]),
              h("p", null, [
                h("span", null, "商品数量："),
                h(
                  "span",
                  { style: "color: #E6A23C; fontSize: 16px;" },
                  `${total.totalCount}`
                )
              ]),
              h("p", null, [
                h("span", null, "应付金额："),
                h(
                  "span",
                  {
                    style:
                      "color: #E6A23C; fontSize: 16px; textDecoration: line-through"
                  },
                  `${total.totalPrice}元`
                )
              ]),
              h("p", null, [
                h("span", null, "会员折扣："),
                h(
                  "span",
                  { style: "color: #e64340; fontSize: 16px;" },
                  `${searchResult.vip_discount * 10}折`
                )
              ]),
              h("p", null, [
                h("span", null, "折后价格："),
                h(
                  "span",
                  { style: "color: #e64340; fontSize: 20px; fontWeight: 600" },
                  `${Math.floor(total.totalPrice * searchResult.vip_discount)}元`
                )
              ])
            ]), // 打折框的界面
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            beforeClose: function(action, instance, done){
              if (action === "confirm") {
                if (typeof index === 'undefined') { // 在点餐页面结账
                  // 4-1-1 生成订单，上传到数据库中
                  createOrder.call(that, searchResult, orderData)
                  // 4-1-2 减去会员的余额
                  UpdateVipBalance.call(that, value, Math.floor(total.totalPrice * searchResult.vip_discount))
                  // 4-1-3 将订单数据清除
                  that.$store.commit("POS_REMOVEALLGOODS")
                } else {  // 在挂单页面结账，步骤同上
                  createOrder.call(that, searchResult, itemNeedCheckout)
                  UpdateVipBalance.call(that, value, Math.floor(total.totalPrice * searchResult.vip_discount))
                  // 在store里面把订单抹去
                  that.$store.commit('POS_REMOVE_HANDUP_TABLE_ITEM', index)
                  // 还要在orderData把这笔订单删除，以防后面的订单受到影响
                  orderData.splice(index, 1)
                } 
                instance.confirmButtonLoading = true
                instance.confirmButtonText = "结账中..."
                setTimeout(() => {
                  done()
                  setTimeout(() => {
                    instance.confirmButtonLoading = false
                  }, 500)
                }, 1000)
              } else {
                done()
                console.log("在订单详情弹框时取消订单")
              }
            }
          })
          MsgPromise1.then(function(action){
            // 5. 提示结账成功
            if (action === "confirm") {
              that.$message({
                type: "success",
                message: "结账成功，欢迎下次光临",
                center: true
              })
            }
          })
        } else { // 3-2.没找到会员，弹出原价框 
          let MsgPromise2 = that.$msgbox({
            title: "订单消息",
            message: h("div", null, [
              h(
                "p",
                {
                  style:
                    "color: #e64340; fontSize: 18px; textAlign: center; marginBottom: 10px;"
                },
                "！！未找到该会员！！"
              ),
              h("p", null, [
                h("span", null, "所购商品："),
                h(
                  "span",
                  { style: "color: #E6A23C; fontSize: 16px;" },
                  `${total.totalName}`
                )
              ]),
              h("p", null, [
                h("span", null, "商品数量："),
                h(
                  "span",
                  { style: "color: #E6A23C; fontSize: 16px;" },
                  `${total.totalCount}`
                )
              ]),
              h("p", null, [
                h("span", null, "应付金额："),
                h(
                  "span",
                  { style: "color: #E6A23C; fontSize: 16px;" },
                  `${total.totalPrice}元`
                )
              ])
            ]),
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            beforeClose: function(action, instance, done){
              if (action === "confirm") {
                // 4-2.生成订单，上传到数据库中
                typeof index === 'undefined' ? createOrder.call(that, searchResult, orderData) : createOrder.call(that, searchResult, itemNeedCheckout)
                instance.confirmButtonLoading = true
                instance.confirmButtonText = "结账中..."
                setTimeout(function(){
                  done()
                  setTimeout(function(){
                    instance.confirmButtonLoading = false
                    // 删除掉菜单表上的商品
                    typeof index === 'undefined' ? that.$store.commit("POS_REMOVEALLGOODS") : that.$store.commit('POS_REMOVE_HANDUP_TABLE_ITEM', index)
                  }, 500)
                }, 1000)
              } else {
                done()
                console.log("在订单详情弹框时取消订单")
              }
            }
          })
          MsgPromise2.then(function(action){
            // 5. 提示结算成功
            if (action === "confirm") {
              that.$message({
                type: "success",
                message: "结账成功，欢迎下次光临",
                center: true
              })
            } 
          })
        }
        // 5.减去库存的量
        orderList.forEach(function(item){
          updateStorageNumber.call(that, item._id, item.goods_count)
        })
      })
      .catch((err) => {
        console.log(err)
        console.log("在输入手机弹框点击的取消")
      })
  } else {
    // 1-2. 没有点餐，提示用户
    that.$message({
      message: "请点餐后再结账",
      type: "warning",
      center: true,
      duration: 800
    })
  }
}

module.exports = {
  tcbInit: tcbInit,
  searchItem: searchItem,
  getTime: getTime,
  getSimTime: getSimTime,
  caculateTotal: caculateTotal,
  createOrder: createOrder,
  UpdateVipBalance: UpdateVipBalance,
  dbGetData: dbGetData,
  checkOut: checkOut,
  splicingNames: splicingNames
}
