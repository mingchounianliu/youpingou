<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {
    mapMutations,mapState
  } from 'vuex'
  export default {
    data() {
      return {

      };
    },
    computed:{
        // 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
      ...mapState('m_user',['redirectInfo'])
    },
    methods: {
      // 1. 使用 mapMutations 辅助方法，把 m_user 模块中的 updateToken 方法映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken','updateRedirectInfo']),
      //用户授权之后 获取用户的基本信息
      getUserProfile(e) {
        uni.getUserProfile({
          desc: '请求授权', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log("授权", res)
            // 这部分是更新用户信息的
            this.updateUserInfo(res.userInfo)
            this.getToken(res)
          },
          fail: (res) => {
            console.log("取消授权", res);
            return uni.$showMsg("已取消登录授权")
          }
        })
      },
      async getToken(info) {
        //获取code 的值
        const [err, res] = await uni.login().catch(err => err);


        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')

        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        console.log("query",query);
        // 换取 token
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log("data11",loginResult);
        // if (loginResult.meta.status !== 200) return this.updateToken(res.code)
        if (loginResult.meta.status !== 400) return uni.$showMsg('登录失败！')
        // uni.$showMsg('登录成功')
        // 2. 更新 vuex 中的 token
        this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo")
        this.navogateBack()
      },
      // 返回登录之前的页面
      navogateBack(){
         // redirectInfo 不为 null，并且导航方式为 switchTab
          if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
            // 调用小程序提供的 uni.switchTab() API 进行页面的导航
            uni.switchTab({
              // 要导航到的页面地址
              url: this.redirectInfo.from,
              // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
              complete: () => {
                this.updateRedirectInfo(null)
              }
            })
          }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    // 登录盒子的样式
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    // 登录按钮的样式
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
