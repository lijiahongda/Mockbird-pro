// pages/lookcode/lookcode.js
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderock: null,
    codelist: null,
    poRule:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _porps = JSON.parse(options.locodeObject)
    // console.log(_porps)
    let _orderid = _porps.id
    let _sceneid = _porps.sceneId
    this.setData({
      orderock: _porps
    })
    this.getCode(_orderid)
    this.getSetdataList(_sceneid)
  },
  // 点击复制
  copyText:function(e){
    // console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  //获取兑换码
  getCode: function(id) {
    let _openid = wx.getStorageSync('openid');
    api._get('ticket-pay/ticket/getTicketCode?orderNo=' + id + '&openId=' + _openid)
    // apid._get(':9100/ticket/getTicketCode?orderNo=' + id + '&openId=' + _openid)
    .then(res => {
      if (res.status == 200) {
        // console.log(res)
        this.setData({
          codelist: res.data
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
  // 场次详情数据
  getSetdataList: function (id) {
    api._get('ticket-trade/filmScene/getSceneDetailById?id=' + id)
    // apid._get(':8336/filmScene/getSceneDetailById?id=' + id)
      .then(res => {
        if (res.status == 200) {
          let _data = res.data
          let _rule = _data.groupRule
          let _tip = _data.groupTip
          let po_rule = _rule.split('</view>')
          // console.log(_data)
          // console.log(po_rule)
          this.setData({
            poRule: po_rule
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