// pages/coupon/coupon.js
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: null,
    modalMsg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCouponList()
  },
  // 获取优惠券数据
  getCouponList: function() {
    let params = {
      pageCount: 1,
      pageSize: 100,
      openId: wx.getStorageSync('openid'),
      status: 1
    }
    api._get('ticket-pay/coupon/getCouponsByStatus', params)
      // apid._get(':9100/coupon/getCouponsByStatus', params)
      .then(res => {
        let _data = res.data
        if (res.status == 200) {
          _data.map(val => {
            val.createDate = val.createDate.substring(0, 10)
            val.validDate = val.validDate.substring(0, 10)
          })
          this.setData({
            couponList: _data
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
  },
  // duihuan
  bindDHblur: function(e) {
    let _mssg = e.detail.value
    this.setData({
      modalMsg: _mssg
    })
  },
  // duihuan
  ticketBind: function() {
    wx.showModal({
      title: '兑换码',
      content: '兑换码' + this.data.modalMsg,
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          let _openid = wx.getStorageSync('openid');
          let _exchangedode = this.data.modalMsg
          api._post('ticket-pay/coupon/ticket/bind?openId=' + _openid + '&exchangeCode=' + _exchangedode)
            .then(res => {
              console.log(res)
              if (res.status == 200) {
                this.setData({
                  showModal: false,
                  modalMsg: ''
                })
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                this.setData({
                  showModal: false,
                  modalMsg: ''
                })
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
        }
      }
    })
  }
})