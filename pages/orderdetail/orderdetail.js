// pages/orderdetail/orderdetail.js
const util = require('../../utils/showtime.js')
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oderDetail: null,
    weChatkeyYy: null,
    ctuserlist: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _porps = JSON.parse(options.detailObj)
    // console.log(_porps)
    if (_porps.status == 2) {

    } else if (_porps.payStatus == 1) {
      let _id = _porps.id
      this.getGrouppay(_id)
    }
    if (_porps.activityId != null) {
      let actId = _porps.activityId
      let temId = _porps.teamId
      this.getTuan(actId, temId)
    }
    this.setData({
      oderDetail: _porps
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let _sceneId = this.data.oderDetail.sceneId
    let _atype = this.data.oderDetail.discountType
    return {
      title: '嘲鸟超前购',
      desc: '嘲鸟超前购',
      path: '/pages/scenedetail/scenedetail?id=' + _sceneId + '&atype=' + _atype,
    }
  },
  // 查看兑换码
  goLookcode: function() {
    let _props = this.data.oderDetail
    let json = JSON.stringify(_props)
    wx.navigateTo({
      url: '/pages/lookcode/lookcode?locodeObject=' + json,
    })
  },
  // 立即支付
  goPAYto: function() {
    let _data = this.data.weChatkeyYy
    let _timeStamp = _data.timeStamp.toString()
    wx.requestPayment({
      appId: _data.appId,
      timeStamp: _timeStamp,
      nonceStr: _data.nonceStr,
      package: _data.package,
      signType: "MD5",
      paySign: _data.sign,
      success: function(res) {
        let _oderno = _data.orderNo
        wx.redirectTo({
          url: '/pages/ordergreat/ordergreat?orderNo=' + _oderno
        })
      },
      fail: function(res) {
        wx.navigateBack({
          delta: 1
        });
      },
      complete: function(res) {
        console.log(res)
        console.log("支付状态")
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
  // 取消订单
  getOutpay: function() {
    let _self = this
    let _odid = _self.data.oderDetail.id
    let _sceneid = _self.data.oderDetail.sceneId
    let _brandId = _self.data.oderDetail.brandId
    let _buynum = _self.data.oderDetail.buyNum
    let _actId = _self.data.oderDetail.activityId == null ? '' : _self.data.oderDetail.activityId
    let _openid = wx.getStorageSync('openid');
    wx.showModal({
      title: '取消订单',
      content: '取消后票务将不会保留,是否取消?',
      cancelColor: '#343439',
      confirmColor: '#FF9019',
      mask: true,
      success(res) {
        if (res.confirm) {
          api._put('ticket-pay/groupOrder/updateStatus?id=' + _odid + '&openId=' + _openid + '&activityId=' + _actId + '&sceneId=' + _sceneid + '&buyNum=' + _buynum + '&status=4' + '&brandId=' + _brandId)
          // apid._put(':9100/groupOrder/updateStatus?id=' + _odid + '&openId=' + _openid + '&activityId=' + _actId + '&sceneId=' + _sceneid + '&buyNum=' + _buynum + '&status=4' + '&brandId=' + _brandId)
            .then(res => {
              if (res.status == 200) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'none',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 1
                });
              } else {
                wx.showToast({
                  title: '取消失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }).catch(e => {
              console.log(e)
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 预约支付
  getGrouppay: function(id) {
    let _id = id
    api._post('ticket-pay/wxPay/getPayInfoKey?orderNo=' + id)
    // apid._post(':9100/wxPay/getPayInfoKey?orderNo=' + id)
      .then(res => {
        if (res.status == 200) {
          let weChatkey = JSON.parse(res.data)
          // console.log(res.data)
          this.setData({
            weChatkeyYy: weChatkey
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