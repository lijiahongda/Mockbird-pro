// pages/numshopdetail/numshopdetail.js
// const apid = require('../../utils/requuu.js')
const api = require('../../utils/requst.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopnumlist: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _shopnumobj = JSON.parse(options.shopnumobj)
    this.setData({
      shopnumlist: _shopnumobj
    })
    // console.log(_shopnumobj)
  },
  // 购买
  getbuyGoods: function() {
    let integralGoodsVo = this.data.shopnumlist
    let _openid = wx.getStorageSync('openid')
    integralGoodsVo.openId = _openid
    console.log(integralGoodsVo)
    wx.showModal({
      title: '',
      content: '确定使用' + integralGoodsVo.unitPrice + '积分, 兑换' + integralGoodsVo.goodsDesc + integralGoodsVo.goodsBrief + '优惠券?',
      cancelColor: '#343439',
      confirmColor: '#FF9019',
      success(res) {
        if (res.confirm) {
          api._post('ticket-trade/goods/buyGoods', integralGoodsVo).then(res => {
            if (res.status == 200) {
              console.log(res)
              wx.showToast({
                title: '兑换成功',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  }
})