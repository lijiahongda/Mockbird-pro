// pages/numshop/numshop.js
// const apid = require('../../utils/requuu.js')
const api = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalNum:0,
    goodlist:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getqueryAllGoods()
    this.checkSigned()
  },
  //积分明细
  goNumtolist:function(){
    wx.navigateTo({
      url: '/pages/numtolist/numtolist',
    })
  },
  //商品详情
  goShopnum(e){
    let _item = e.currentTarget.dataset.item
    let _itemjson = JSON.stringify(_item)
    wx.navigateTo({
      url: '/pages/numshopdetail/numshopdetail?shopnumobj=' + _itemjson,
    })
  },
  // 获取
  getqueryAllGoods: function () {
    api._get('ticket-trade/goods/queryAllGoods').then(res => {
      if(res.status == 200){
        this.setData({
          goodlist:res.data
        })
      }
    })
  },
  // 积分获取
  checkSigned: function () {
    let _openid = wx.getStorageSync('openid');
    api._get('ticket-trade/integral/checkSigned?openId=' + _openid)
      .then(res => {
        let _data = res.data
        this.setData({
          totalNum: _data.totalNum
        })
      })
  }
})