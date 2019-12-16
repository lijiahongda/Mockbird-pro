// pages/redbag/redbag.js
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unickname: null,
    unickarvr: '',
    activityId: null,
    isChary:false,
    redpacketlist:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    let _activityId = options.activityId
    this.setData({
      activityId: _activityId
    })
    this.getUserlist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  receiveRedPacket: function() {
    //获取邀请信息
    let _openid = wx.getStorageSync('openid');
    let _nickname = this.data.unickname
    let _headUrl = this.data.unickarvr
    let _activityId = this.data.activityId
    api._post('ticket-trade/redpacket/receiveRedPacket?openId=' + _openid + '&activityId=' + _activityId + '&headUrl=' + _headUrl + '&nickname=' + _nickname).then(res => {
      console.log(res)
      if(res.status==200){
        this.setData({
          redpacketlist:res.data,
          isChary:true
        })
      }
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
  }
})