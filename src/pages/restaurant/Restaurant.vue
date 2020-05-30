<template>
  <div class="restaurant">
    <el-row>
      <el-col :span="7" id="res-left">
        <div class="res-intro">
          <div class="intro-title">
            <h3>我玲奶茶店</h3>
            <p>
               <i class="iconfont icon-pingfen"></i>
               <i class="iconfont icon-pingfen"></i>
               <i class="iconfont icon-pingfen"></i>
               <i class="iconfont icon-pingfen"></i>
               <i class="iconfont icon-pingfen"></i>
               <span>4.9分</span>
               <span>人均￥56</span>
            </p>
          </div>
          <div class="intro-content">
            <p class="coontent-address">店面地址：深圳市龙华区民治街道水尾2区18栋首层</p>
            <p>联系电话：0755-12345678/13418531993</p>
            <p>营业时间：周一至周日 09:00-18:30</p>
          </div>
          <div class="intro-services">
            <div class="services-box">
              <i class="iconfont icon-ertong-copy"></i>
              <p>儿童玩乐</p>
            </div>
            <div class="services-box">
              <i class="icon iconfont icon-tingchechangguanli"></i>
              <p>停车位</p>
            </div>
            <div class="services-box">
              <i class="icon iconfont icon-WIFI"></i>
              <p>免费WIFI</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="17" id="res-right">
        <div class="img-box">
          <div class="img-box-top">
            <img :src="currentImgUrl" alt="">
          </div>
          <div class="img-box-bottom" ref="boxBottom"> 
            <div class="img-wrapper" ref="imgWrapper">
              <div class="img-item" v-for="(item, index) in img_url" :key="index" @click="on_change_img(index)" :class="{'isActive': activeNumber == index}">
                <img :src="item" width="100%">
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      img_url: [
        require('../../assets/imgs/kfc1.jpeg'),
        require('../../assets/imgs/kfc2.jpeg'),
        require('../../assets/imgs/kfc3.jpeg'),
        require('../../assets/imgs/kfc4.jpeg'),
        require('../../assets/imgs/kfc5.jpeg'),
        require('../../assets/imgs/kfc6.jpeg'),
        require('../../assets/imgs/kfc7.jpeg')
      ],
      currentImgUrl: require('../../assets/imgs/kfc4.jpeg'),
      activeNumber: 3
    }
  },
  methods: {
    on_change_img(index){
      this.activeNumber = index
      const singleRem = Number(document.getElementsByTagName('html')[0].style.fontSize.slice(0,-2)) // 1rem对应的px值
      const originalTranslateX = this.$refs.imgWrapper.clientWidth / 2 - 4 * singleRem
      this.$refs.imgWrapper.style.transition = 'all .8s'
      let distance = ((3-index) * 10 * singleRem - originalTranslateX) + 'px'
      this.$refs.imgWrapper.style.transform = `translateX(${distance})`
      this.currentImgUrl = this.img_url[index]
    }
  },
  mounted(){
    // 设置左边和右边的高度
    const clientHeight = document.body.clientHeight
    document.getElementById("res-left").style.height = clientHeight + "px"
    document.getElementById("res-right").style.height = clientHeight + "px"
    // 设置初始的translateX值
    const singleRem = Number(document.getElementsByTagName('html')[0].style.fontSize.slice(0,-2)) // 1rem对应的px值
    const originalTranslateX = this.$refs.imgWrapper.clientWidth / 2 - 4 * singleRem
    this.$refs.imgWrapper.style.transform = `translateX(-${originalTranslateX}px)`
  }
}
</script>

<style scoped lang="less">
  #res-left{
    background-color: #fff;
    padding: 10px 20px;
    .intro-title{
      padding: 0px 0 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #E4E7ED;
      h3{
        margin: 0 0 10px;
        padding: 0%;
        color: #303133;
        font-size: 24px;
      }
      p{
        i{
          color: #E6A23C;
          font-size: 18px;
        }
       span:first-of-type{
          margin-left: 10px;
          color: red;
        }
        span{
          font-weight: 300;
        }
      }
    }
    .intro-content{
      height: 130px;
      padding: 20px 0 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #606266;
      font-size: 14px;
      border-bottom: 1px solid #E4E7ED;
    }
    .intro-services{
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: start;
      .services-box{
        height: 50px;
        text-align: center;
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        i{
          font-size: 25px;
          font-weight: 300;
          color: #909399;
        }
        p{
          color: #606266;
          font-size: 14px;
        }
      }
    }
  }
  #res-right{
    background-color: rgb(228, 233, 236);
    position: relative;
    .img-box{
      background-color: #fff;
      width: 44rem;
      height: 43rem;
      border-radius: 3%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, .2);
      .img-box-top {
        width: 44rem;
        height: 33rem;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom: 3px dashed rgb(180, 178, 178);
        img{
          width: 36rem;
          height: 27rem;
        }
      }
      .img-box-bottom{
        width: 40rem;
        height: 10rem;
        box-sizing: border-box;
        overflow: hidden;
        .img-wrapper{
          margin: 1rem auto;
          white-space: nowrap;

          .isActive{
            transform: scale(1.3);
          }
          .img-item{
            width: 10rem;
            height: 8rem;
            display: inline-block;
            padding: 1rem;
            box-sizing: border-box;
            font-size: 0;
            transition: all .3s;
            img{
              width: 8rem;
              height: 6rem;
            }
          }
        }
      }
    }
  }
</style>