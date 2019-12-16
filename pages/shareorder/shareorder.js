const api = require('../../utils/requst.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderListPay: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let _self = this
    let _openid = wx.getStorageSync('openid');
    api._post('ticket-trade/share/shareOrder?type=1&integralNum=10&openId=' + _openid).then(res => {
      if (res.status == 200) {
        // _self.onLoad()
      }
    })
    return {
      title: '嘲鸟超前购', // 转发后 所显示的title
      path: '/pages/scene/scene' // 相对的路径
    }
  },

  // 获取用户订单列表
  getOrderList: function() {
    let params = {
      openId: wx.getStorageSync('openid'),
      pageSize: 100,
      pageCount: 1,
      status: ''
    }
    api._get('ticket-pay/groupOrder/findGroupOrderByOpenId', params)
      // apid._get(':9100/groupOrder/findGroupOrderByOpenId', params)
      .then(res => {
        if (res.status == 200) {
          this.setData({
            orderListPay: res.data
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
  }
})