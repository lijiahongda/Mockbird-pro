// pages/ordergreat/ordergreat.js
const util = require('../../utils/showtime.js')
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    overData: null,
    ctuserlist: null,
    payCountype: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _id = options.orderNo
    this.getOk(_id)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let _sceneId = this.data.overData.sceneId
    let _atype = this.data.overData.discountType
    return {
      title: '嘲鸟超前购',
      desc: '嘲鸟超前购',
      path: '/pages/scenedetail/scenedetail?id=' + _sceneId + '&atype=' + _atype
    }

  },
  // 查看兑换码
  goLookcode: function() {
    let _props = this.data.overData
    let json = JSON.stringify(_props)
    wx.navigateTo({
      url: '/pages/lookcode/lookcode?locodeObject=' + json,
    })
  },
  // 支付成功回调
  getOk: function(id) {
    api._get('ticket-pay/groupOrder/getOrderById?id=' + id)
      // apid._get(':9100/groupOrder/getOrderById?id=' + id)
      .then(res => {
        let _overdata = res.data
        console.log(_overdata)
        if (res.status == 200) {
          console.log(res)
          if (_overdata.discountType == 2 && _overdata.discountType == 3) {
            this.getZeng(_overdata.id)
          }
          if (_overdata.discountType == 4) {
            let _oide = _overdata.activityId
            let _otemd = _overdata.teamId
            this.getTuan(_oide, _otemd)
          }
          this.setData({
            overData: _overdata
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
          this.setData({
            overData: null
          })
        }
      })
  },
  // 参团人
  getTuan: function(id, temid) {
    api._get('ticket-trade/groupActivityDetail/getActivityDetails?activityId=' + id + '&teamId=' + temid)
      // apid._get(':8336/groupActivityDetail/getActivityDetails?activityId=' + id + '&teamId=' + temid)
      .then(res => {
        let _data = res.data
        if (res.status == 200) {
          _data.map(val =>
            val.endTime = util.getTimeLeft(val.endTime)
          )
          this.setData({
            ctuserlist: _data
          })
        }
      })
  },
  //zeng
  getZeng: function(id) {
    api._get('ticket-trade/giftDetails/getOrderGiftDetails?orderId=' + id)
      // api._get(':8336/giftDetails/getOrderGiftDetails?orderId=' + id)
      .then(res => {
        let _data = res.data
        if (res.status == 200) {
          this.setData({
            payCountype: 3
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
          this.setData({
            payCountype: 0
          })
        }
      })
  }
})