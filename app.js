//app.js
App({
  onLaunch: function() {
    // 版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          // console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        let _self = this
        if (res.authSetting['scope.userInfo']) {
          // // 已经授权
          let userAuto = 'true'
          wx.setStorageSync('user_auto', userAuto)
        } else {
          // 未授权
          let userAuto = 'false'
          wx.setStorageSync('user_auto', userAuto)
        }
      }
    })
    // 获取定位
    this.getLocation()
    //获取IP
    this.getUserIp()
  },
  //定位当前城市的函数
  getLocation: function() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        //当前的经度和纬度
        let latitude = res.latitude
        let longitude = res.longitude
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${that.globalData.tencentMapKey}`,
          success: res => {
            let globalCity = res.data.result.ad_info.city
            let _globalCity = globalCity.replace('市', '')
            if (_globalCity == '') {
              wx.setStorageSync('global_city', '北京')
              wx.reLaunch({
                url: '/pages/scene/scene'
              })
            } else {
              wx.setStorageSync('global_city', _globalCity)
              wx.reLaunch({
                url: '/pages/scene/scene'
              })
            }

          }
        })
      }
    })
  },
  //获取授权
  getLoshow: function() {
    wx.getSetting({
      success: res => {
        let _self = this
        if (res.authSetting['scope.userInfo']) {
          // // 已经授权
          let userAuto = 'true'
          wx.setStorageSync('user_auto', userAuto)
        } else {
          // 未授权
          let userAuto = 'false'
          wx.setStorageSync('user_auto', userAuto)
        }

      }
    })
  },
  // IP
  getUserIp: function() {
    wx.request({
      url: 'https://www.mockbird.net/ticket-pay/getIp',
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.status == 200) {
          let userIp = res.data.data
          wx.setStorageSync('user_ip', userIp)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  globalData: {
    tencentMapKey: "WGOBZ-SJ66X-JJD4K-ZHLI5-E3TDJ-MEFCF",
    userInfo: null
  }
})