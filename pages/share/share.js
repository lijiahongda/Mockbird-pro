// pages/share/share.js
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bargainActitvty: null,
    userBargainInfoVo: null,
    isType: null,
    cmoney: 0,
    isKan: 0,
    bkanOP: false,
    ifLogin: 'true'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _porps = JSON.parse(options.shareobj)
    console.log(_porps)
    let adopenid = wx.getStorageSync('openid')
    let _overid = _porps.id

    let _overopenid = _porps.openId
    this.overStatus(_overid, _overopenid)
    this.setData({
      shareProps: _porps,
      usersharename: _porps.username,
      usersharearva: _porps.unickarvr,
      shareopenid: _porps.openId
    })
    let _id = _porps.id
    this.getSetdataList(_id)
    let osopenid = _porps.openId
    if (adopenid == osopenid) {
      this.setData({
        isType: 1
      })
    } else {
      this.setData({
        isType: 2
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let _oprops = this.data.shareProps
    let json = JSON.stringify(_oprops)
    return {
      title: '嘲鸟超前购',
      desc: '嘲鸟超前购',
      path: '/pages/share/share?shareobj=' + json // 路径，传递参数到指定页面。
    }
  },
  // 我也要观影
  aSharegothare: function () {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      let id = this.data.scenedList.id
      let atype = this.data.scenedList.activityType
      wx.navigateTo({
        url: '/pages/scenedetail/scenedetail?id=' + id + '&atype=' + atype,
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  // 买票去
  goOrder: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      let _data = this.data.scenedList
      let _potermoney = this.data.userBargainInfoVo.bargain.reducePrices
      let orderProps = {
        actYpe: 1,
        groupActivityId: null,
        groupteamId: null,
        movieName: _data.movieName,
        playTime: _data.playTime,
        name: _data.name,
        groupMaxNum: _data.groupMaxNum,
        groupBuyNum: _data.groupBuyNum,
        amount: _data.amount,
        groupEndDate: _data.groupEndDate,
        picture: _data.picture,
        id: _data.id,
        reducePrices: _potermoney
      }
      let json = JSON.stringify(orderProps)
      wx.navigateTo({
        url: '/pages/order/order?oderObject=' + json,
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  // 获取数据
  getSetdataList: function(id) {
    api._get('ticket-trade/filmScene/getSceneDetailById?id=' + id)
    // apid._get(':8336/filmScene/getSceneDetailById?id=' + id)
    .then(res => {
      if (res.status == 200) {
        this.setData({
          scenedList: res.data
        })
      } else {
        this.setData({
          scenedList: null
        })
      }
    }).catch(e => {
      console.log(e)
    })
  },
  // 查询砍价
  overStatus: function(id, openid) {
    api._get('ticket-trade/activity/getActivity?type=1' + '&filmSceneId=' + id + '&openId=' + openid)
    // apid._get(':8336/activity/getActivity?type=1' + '&filmSceneId=' + id + '&openId=' + openid)
    .then(res => {
      let _userBargainInfoVo = res.data.userBargainInfoVo
      if (res.status == 200) {
        let _data = res.data
        console.log(_data)
        let _uarry = _userBargainInfoVo.bargainDetails
        let _uopenid = wx.getStorageSync('openid')
        if (_uarry != null) {
          // console.log(_userBargainInfoVo.status)
          if (_userBargainInfoVo.status != 4) {
            _uarry.map(val => {
              if (val.openId == _uopenid) {
                this.setData({
                  bkanOP: true
                })
              }
            })
          } else {
            wx.showModal({
              title: '该场次砍价活动已结束',
              content: '你的手慢了，该场次已经被砍完了！',
              showCancel: false,
              cancelColor: '#343439',
              confirmColor: '#FF9019',
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/scene/scene'
                  })
                }
              }
            })
          }

        }

        this.setData({
          bargainActitvty: _data.bargainActitvty,
          userBargainInfoVo: _data.userBargainInfoVo
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 砍价
  chaShare: function() {
    let _data = this.data
    let _useropr = wx.getStorageSync('user_login') 
    let _type = _data.isType
    let _filmSceneId = _data.scenedList.id
    let _originatorId = _data.shareopenid
    let _imgUrl = _useropr.avatarUrl
    let _userName = _useropr.nickName
    let _uoopenid = wx.getStorageSync('openid')
    if (_userName) {
      api._post('ticket-trade/bargainActivity/bargain?type=' + _type + '&filmSceneId=' + _filmSceneId + '&originatorId=' + _originatorId + '&helperId=' + _uoopenid + '&userName=' + _userName + '&imgUrl=' + _imgUrl)
      // apid._post(':8336/bargainActivity/bargain?type=' + _type + '&filmSceneId=' + _filmSceneId + '&originatorId=' + _originatorId + '&helperId=' + _uoopenid + '&userName=' + _userName + '&imgUrl=' + _imgUrl)
      .then(res => {
        let _idas = this.data.shareProps.id
        let _openid = this.data.shareopenid
        if (res.status == 0) {

          this.overStatus(_idas, _openid)
          this.setData({
            cmoney: res.data.money,
            isKan: 1
          })
        } else {
          wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
  },
  // 暂不登录
  editLogin: function() {
    this.setData({
      ifLogin: 'true'
    })
  },
  // 首页
  goSharhare: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      wx.switchTab({
        url: '/pages/scene/scene',
      })
    } else {
      this.setData({
        ifLogin: 'false'
      })
    }
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
            // apid._post('users-anon/sys/login?code=' + code + '&encryptedData=' + encryptedData + "&iv=" + iv)
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
                        ifLogin : _iflogin
                      })
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