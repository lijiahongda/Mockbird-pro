const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: null,
    rolesPics: null,
    stillPicsList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _self = this
    let id = options.id
    _self.getSetdataList(id)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 后退
  BackPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  //场次列表
  goScenelist: function() {
    let _data = this.data.movieDetail
    let _id = _data.id
    wx.navigateTo({
      url: '/pages/scenelist/scenelist?movieId=' + _id,
    })
  },
  // 影片详情数据
  getSetdataList: function(id) {
    api._get('ticket-trade/movie/getMovieDetails?id=' + id)
    // apid._get(':8336/movie/getMovieDetails?id=' + id)
    .then(res => {
      if (res.status == 200) {
        let _movieDetail = res.data
        let _rolesPics = JSON.parse(_movieDetail.rolesPics)
        let _stillPicsList = _movieDetail.stillPicsList
        // console.log(_stillPicsList)
        this.setData({
          movieDetail: _movieDetail,
          rolesPics: _rolesPics
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