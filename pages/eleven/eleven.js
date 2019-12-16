// pages/eleven/eleven.js
const api = require('../../utils/requst.js')
const apid = require('../../utils/requuu.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unickname: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserlist()
  },
  // 获取用户名
  getUserlist: function () {
    let _self = this
    wx.getUserInfo({
      success: function (res) {
        let userInfo = res.userInfo
        let nickName = userInfo.nickName
        _self.setData({
          unickname: nickName
        })
      } 
    })
  },
  shopEleven:function(){
    let params = {
      amount: '11.11',
      buyNum: 1,
      contactName: this.data.unickname,
      openId: wx.getStorageSync('openid'),
      spbillCreateIp: wx.getStorageSync('user_ip')
    }
    if (params.openId!="") {
      api._post('ticket-pay/common/prepay', params).then(res => {
        if (res.status == 200) {
          console.log(res)
          let weChatkey = JSON.parse(res.data)
          let _timeStamp = weChatkey.timeStamp.toString()
          wx.requestPayment({
            appId: weChatkey.appId,
            timeStamp: _timeStamp,
            nonceStr: weChatkey.nonceStr,
            package: weChatkey.package,
            signType: "MD5",
            paySign: weChatkey.sign,
            success: res => {              
              wx.switchTab({
                url: '/pages/scene/scene'
              })
              wx.showToast({
                title: '优惠券已成功下发到您的账户中请在我的-我的优惠-优惠券中进行查看~',
                icon: 'none',
                duration: 2000
              })
            },
            fail: res => {
              wx.switchTab({
                url: '/pages/scene/scene'
              })
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(e => {
        console.log(e)
      })
    } else {
      wx.switchTab({
        url: '/pages/mine/mine'
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})