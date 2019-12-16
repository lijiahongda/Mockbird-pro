// pages/mine/mine.js
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unickname: null,
    unickarvr: '',
    ifLogin: 'false',
    thisifLogin: 'false',
    minorderListPay: null,
    isSign: 0,
    totalNum: 0,
    totalCoupon: 0,
    integralHisVos: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _self = this
    let _iflogin = wx.getStorageSync('user_auto');
    _self.setData({
      ifLogin: _iflogin,
      thisifLogin: _iflogin
    })
    if (_iflogin) {
      _self.getUserlist()
      _self.checkSigned()
      _self.getOrderList()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad()
  },
  // 客服
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  // 我的订单
  goAA: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      wx.navigateTo({
        url: '/pages/orderlist/orderlist',
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  // 优惠券
  goBB: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      wx.navigateTo({
        url: '/pages/coupon/coupon',
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  // 观影卡
  goCC: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      wx.navigateTo({
        url: '/pages/gunum/gunum',
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  // 积分商城
  goDD: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      wx.navigateTo({
        url: '/pages/numshop/numshop',
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  goEE: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      wx.navigateTo({
        url: '/pages/openus/openus',
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  // 签到
  goQdao: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    let _singqian = this.data.isSign
    if (_iflogin == 'true') {
      wx.navigateTo({
        url: '/pages/calendar/calendar?isSign=' + _singqian,
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  checkSigned: function() {
    let _openid = wx.getStorageSync('openid');
    api._get('ticket-trade/integral/checkSigned?openId=' + _openid)
      .then(res => {
        let _data = res.data
        this.setData({
          isSign: _data.isSign,
          totalNum: _data.totalNum,
          totalCoupon: _data.totalCoupon
        })
      })
  },
  // 客服电话
  fuck: function() {
    wx.makePhoneCall({
      phoneNumber: '010-57396178'
    })
  },
  // 去登陆
  gLogintw: function() {
    this.setData({
      ifLogin: 'false'
    })
  },
  // 暂不登录
  editLogin: function() {
    this.setData({
      ifLogin: 'true'
    })
  },
  // 获取用户名
  getUserlist: function() {
    let _self = this
    wx.getUserInfo({
      success: function(res) {
        let userInfo = res.userInfo
        let nickName = userInfo.nickName
        let avatarUrl = userInfo.avatarUrl
        _self.setData({
          unickname: nickName,
          unickarvr: avatarUrl
        })
      }
    })
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
          // console.log(res.data)
          if (res.data.length > 3) {
            let _data = res.data.slice(0, 3)
            this.setData({
              minorderListPay: _data,

            })
          } else if (res.data.length == 1) {
            let _data = res.data
            this.setData({
              minorderListPay: _data
            })
          } else {
            let _data = res.data
            this.setData({
              minorderListPay: _data
            })
          }
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
  // 小程序授权登陆
  getUserInfo: function() {
    wx.login({
      success: res => {
        var code = res.code
        wx.getUserInfo({
          success: res => {
            var iv = res.iv
            var encryptedData = res.encryptedData
            api._post('users-anon/sys/login?code=' + code + '&encryptedData=' + encryptedData + "&iv=" + iv)
              // apid._post(':8101/users-anon/sys/login?code=' + code + '&encryptedData=' + encryptedData + "&iv=" + iv)
              .then(res => {
                let _self = this
                let _data = res.data
                if (res.status == 200) {
                  wx.setStorageSync('user_login', _data.loginUser)
                  wx.setStorageSync('access_token', _data.access_token)
                  wx.setStorageSync('openid', _data.openid)
                  wx.getUserInfo({
                    success: function(res) {
                      let _userData = res.userInfo
                      if (_userData) {
                        app.globalData.nickName = _userData.nickName
                        app.globalData.avatarUrl = _userData.avatarUrl
                        app.getLoshow()
                        let _iflogin = 'true'
                        wx.setStorageSync('user_auto', _iflogin);
                        _self.setData({
                          ifLogin: 'true',
                          thisifLogin: 'true'
                        })
                        _self.onLoad()
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 2000
                        })
                      }
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
          },
          fail: res => {
            let _self = this
            _self.setData({
              ifLogin: 'true',
            })
            wx.showToast({
              title: '未授权，部分功能无法使用',
              icon: 'none',
              duration: 2000
            })
          }
        })

      }
    })

  }
})