// pages/scene/scene.js
const api = require('../../utils/requst.js');
// const apid = require('../../utils/requuu.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 3,
    // 图片列表
    swiperList: null,
    // 页数
    pageCount: 1,
    // 数据
    cinameList: [],
    // 滚动
    scrollTop: null
  },
  //滚动条监听
  // scroll: function(e) {
  //   // console.log(e)
  //   this.setData({ scrollTop: e.detail.scrollTop })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _self = this
    let _page = _self.data.pageCount
    let _globalcity = wx.getStorageSync('global_city');
    _self.setData({
      globalcity: _globalcity
    })
    _self.getSetdataList(_page)
    _self.getImg()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 城市选择
  goLoaction: function() {
    wx.navigateTo({
      url: '/pages/loactionlist/loactionlist',
    })
  },
  //场次列表
  goScenelist: function(event) {
    let _id = event.currentTarget.dataset.item.movieId
    wx.navigateTo({
      url: '/pages/scenelist/scenelist?movieId=' + _id,
    })
  },
  goBanner: function(event) {
    let _url = event.currentTarget.dataset.item.url
    // console.log(_url)
    wx.navigateTo({
      url: _url
    })
  },
  //已结束
  overScenedetail: function() {
    wx.showToast({
      title: '该影片放映场次已结束',
      icon: 'none',
      duration: 2000
    })
  },
  // 进行中
  tNavtaba() {
    let _self = this
    _self.setData({
      TabCur: 3,
    })
    let _page = _self.data.pageCount
    _self.getSetdataList(_page)
  },
  // 已结束
  tNavtabb() {
    let _self = this
    _self.setData({
      TabCur: 5
    })
    let _page = _self.data.pageCount
    _self.getSetdataLists(_page)
  },
  // 场次数据
  getSetdataList: function(page) {
    let params = {
      pageCount: page,
      pageSize: 100,
      status: 3,
      city: wx.getStorageSync('global_city')
    }
    api._get('ticket-trade/filmTask/getTaskByCity', params)
      // apid._get(':8336/filmTask/getTaskByCity', params)
      .then(res => {
        if (res.status == 200) {
          this.setData({
            cinameList: res.data,
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
          this.setData({
            cinameList: null,
          })
        }
      }).catch(e => {
        console.log(e)
      })
  },
  //场次数据2
  getSetdataLists: function(page) {
    let params = {
      pageCount: page,
      pageSize: 100,
      status: 5,
      city: wx.getStorageSync('global_city')
    }
    api._get('ticket-trade/filmTask/getTaskHisByCity', params)
      // apid._get(':8336/filmTask/getTaskByCity', params)
      .then(res => {
        if (res.status == 200) {
          this.setData({
            cinameList: res.data,
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
          this.setData({
            cinameList: null,
          })
        }
      }).catch(e => {
        console.log(e)
      })
  },
  // 获取图片
  getImg: function() {
    api._get('ticket-trade/adv/getList?pageCount=1&pageSize=10&status=0&type=1&style=1')
      // apid._get(':8336/adv/getList?pageCount=1&pageSize=10&status=0&type=1&style=1')
      .then(res => {
        if (res.status == 200) {
          let _image = res.data
          this.setData({
            swiperList: _image
          })
        } else {
          this.setData({
            showImg: null
          })
        }
      })
  }
})