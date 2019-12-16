// pages/numtolist/numtolist.js
// const apid = require('../../utils/requuu.js')
const api = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    tabData: ['收入', '支出'],
    queryIncomelist: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryIncome()
  },
  // 切换
  tabSelect(e) {
    let estatus = e.currentTarget.dataset.id + 1
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    if (estatus == 1) {
      this.queryIncome()
    } else {
      this.queryChangeRecord()
    }
  },
  // 获取收入数据
  queryIncome: function() {
    let _openid = wx.getStorageSync('openid')
    api._get('ticket-trade/goods/queryIncome?openId=' + _openid + '&pageCount=1&pageSize=100')
      .then(res => {
        let _data = res.data
        // console.log(_data)
        if (res.status == 200) {
          this.setData({
            queryIncomelist: _data
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
  // 获取支出数据
  queryChangeRecord: function() {
    let _openid = wx.getStorageSync('openid')
    api._get('ticket-trade/goods/queryChangeRecord?openId=' + _openid + '&pageCount=1&pageSize=100')
      .then(res => {
        let _data = res.data
        // console.log(_data)
        if (res.status == 200) {
          this.setData({
            queryIncomelist: _data
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