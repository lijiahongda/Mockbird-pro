const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scenedList: null,
    movieDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _id = options.movieId
    let _globalcity = wx.getStorageSync('global_city');
    this.getSetdataList(_id, _globalcity)
    this.getMovieList(_id)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //场次详情
  goScenedetail: function(event) {
    let id = event.currentTarget.dataset.item.id
    let atype = event.currentTarget.dataset.item.activityType
    wx.navigateTo({
      url: '/pages/scenedetail/scenedetail?id=' + id + '&atype=' + atype,
    })
  },
  // 场次列表数据
  getSetdataList: function(id, city) {
    let params = {
      pageCount: 1,
      pageSize: 100,
      movieId: id,
      city: city
    }
    api._get('ticket-trade/filmScene/getFilmSceneByMovieId', params)
    // apid._get(':8336/filmScene/getFilmSceneByMovieId', params)
      .then(res => {
        if (res.status == 200) {
          let _data = res.data
          this.setData({
            scenedList: _data,
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
  // 影片详情数据
  getMovieList: function(id) {
    api._get('ticket-trade/movie/getMovieDetails?id=' + id)
    // apid._get(':8336/movie/getMovieDetails?id=' + id)
    .then(res => {
      if (res.status == 200) {
        let _movieDetail = res.data
        this.setData({
          movieDetail: _movieDetail
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