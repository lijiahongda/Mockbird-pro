// pages/orderlist/orderlist.js
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderListPay: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad()
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
        this.setData({
          orderListPay: res.data
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
  // 查看兑换码
  goLookcode: function (event) {
    let _props = event.target.dataset.item
    let json = JSON.stringify(_props)
    wx.navigateTo({
      url: '/pages/lookcode/lookcode?locodeObject=' + json,
    })
  },
  // 用户取消订单
  // orderUpdataStatus: function(e) {
  //   let _self = this
  //   let _odid = e.currentTarget.dataset.item.id
  //   let _sceneid = e.currentTarget.dataset.item.sceneId
  //   let _buynum = e.currentTarget.dataset.item.buyNum
  //   wx.showModal({
  //     title: '取消订单',
  //     content: '取消后票务将不会保留,是否取消?',
  //     cancelColor: '#343439',
  //     confirmColor: '#FF9019',
  //     success(res) {
  //       if (res.confirm) {
  //         api._put('ticket-pay/groupOrder/updateStatus?id=' + _odid + '&sceneId=' + _sceneid + '&buyNum=' + _buynum + '&status=4')
  //         apid._put(':9100/groupOrder/updateStatus?id=' + _odid + '&sceneId=' + _sceneid + '&buyNum=' + _buynum + '&status=4')
  //         .then(res => {
  //           if (res.status == 200) {
  //             _self.onLoad()
  //           } else {
  //             wx.showToast({
  //               title: '取消失败',
  //               icon: 'none',
  //               duration: 2000
  //             })
  //           }
  //         }).catch(e => {
  //           console.log(e)
  //         })
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  // 再次购买
  goOrderdetail: function(event) {
    let id = event.currentTarget.dataset.item.sceneId
    let atype = event.currentTarget.dataset.item.discountType
    wx.navigateTo({
      url: '/pages/scenedetail/scenedetail?id=' + id + '&atype=' + atype,
    })
  },
  // 再次购买
  goScenedetail: function (event) {
    let id = event.currentTarget.dataset.item.sceneId
    let atype = event.currentTarget.dataset.item.discountType
    wx.navigateTo({
      url: '/pages/scenedetail/scenedetail?id=' + id + '&atype=' + atype,
    })
  },
  // 订单详情
  goOrderdetail: function (event) {
    // console.log(event.currentTarget.dataset.item)
    let _detailob = event.currentTarget.dataset.item
    let _detailobj = event.currentTarget.dataset.item
    // {
    //   movieName: _detailob.movieName,
    //   cinemaName: _detailob.cinemaName,
    //   buyNum: _detailob.buyNum,
    //   orderNo: _detailob.orderNo,
    //   amount: _detailob.amount,
    //   jourNo: _detailob.jourNo,
    //   endPayTime: _detailob.endPayTime,
    //   couponPrice: _detailob.couponPrice,
    //   hallName: _detailob.hallName,
    //   status: _detailob.status,
    //   createDate: _detailob.createDate,
    //   ticketNo: _detailob.ticketNo,
    //   payStatus: _detailob.payStatus,
    //   id: _detailob.id,
    //   favor: _detailob.favor,
    //   discountType: _detailob.discountType
    // }
    let detailObj = JSON.stringify(_detailobj)
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?detailObj=' + detailObj,
    })
  }
})