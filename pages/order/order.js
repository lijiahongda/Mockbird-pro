// pages/order/order.js
const util = require('../../utils/showtime.js')
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oderobject: null,
    couponList: null,
    adpei: null,
    timer: null,
    timeRight: null, // 剩下的时间（天时分秒）
    datetimeTo: null, // 抢票结束时间
    // 购票数量
    surplusNum:null,
    maynumber: 1,
    nobusnumber: 1,
    mayname: '',
    phonemay: false,
    mayphone: '',
    // 活动优惠
    playmoney: null,
    // 优惠券
    opter:null,
    showCup: false,
    couponif: false,
    idx: null,
    couponmoney: 0,
    couponkey: '',
    ctuserlist: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _porps = JSON.parse(options.oderObject)
    // console.log(_porps)
    let actType = _porps.actYpe
    let actId = _porps.groupActivityId
    let temId = _porps.groupteamId
    let _brandId = _porps.brandId
    this.getketNum(_brandId)
    if (actType == 4) {
      this.getTuan(actId, temId)
      this.setData({
        playmoney: _porps.discountPrice
      })
    } else if (actType == 1) {
      this.setData({
        playmoney: _porps.reducePrices
      })
    } else {
      this.getCoupon()
      this.setData({
        playmoney: 0
      })
    }
    this.setData({
      oderobject: _porps,
      datetimeTo: _porps.groupEndDate
    })
  },

  // 选择优惠券
  goIndex(e) {
    let _current = e.currentTarget.dataset.item
    let _showCup = !this.data.showCup
    switch (_current.type) {
      case 2:
        this.setData({
          showCup: _showCup,
          couponif: true,
          idx: e.currentTarget.dataset.index,
          couponmoney: this.data.oderobject.amount,
          couponkey: _current.id,
          nobusnumber: 2
        })
        break;
      case 3:
        this.setData({
          showCup: _showCup,
          couponif: true,
          idx: e.currentTarget.dataset.index,
          couponmoney: this.data.oderobject.amount,
          couponkey: _current.id,
          nobusnumber: 1
        })
        break;
      case 99:
        this.setData({
          showCup: _showCup,
          couponif: false,
          idx: e.currentTarget.dataset.index,
          couponmoney: _current.favorNum,
          couponkey: _current.id,
          nobusnumber: 1
        })
        break;
      default:
        this.setData({
          showCup: _showCup,
          couponif: true,
          idx: e.currentTarget.dataset.index,
          couponmoney: _current.favorNum,
          couponkey: _current.id,
          nobusnumber: 1
        })
        break;
    }
    // if (_current.type == 2) {
    //   this.setData({
    //     couponif: true,
    //     idx: e.currentTarget.dataset.index,
    //     couponmoney: this.data.oderobject.amount,
    //     couponkey: _current.id,
    //     nobusnumber: 2
    //   })
    // } else if (_current.remark == "暂不选择") {
    //   this.setData({
    //     couponif: false,
    //     idx: e.currentTarget.dataset.index,
    //     couponmoney: _current.favorNum,
    //     couponkey: _current.id,
    //     nobusnumber: 1
    //   })
    // } else {
    //   this.setData({
    //     couponif: true,
    //     idx: e.currentTarget.dataset.index,
    //     couponmoney: _current.favorNum,
    //     couponkey: _current.id,
    //     nobusnumber: 1
    //   })
    // }
    console.log(e.currentTarget.dataset.item)
  },
  // 显示优惠券
  showCoun: function() {
    let _showCup = !this.data.showCup
    this.setData({
      showCup: _showCup,
    })
  },
  // 购票数量
  updateNumber(e) {
    this.setData({
      maynumber: e.detail.value,
    })
  },
  // 联系人
  updateName(e) {
    this.setData({
      mayname: e.detail.value,
    })
  },
  // 手机号
  updatePhone(e) {
    this.setData({
      mayphone: e.detail.value,
    })
  },
  // 手机号验证
  phoneonchange: function(e) {
    let _opephone = e.detail.value
    if (/^1[3456789]\d{9}$/.test(_opephone)) {
      this.setData({
        mayphone: e.detail.value,
        phonemay: true
      })
    } else {
      this.setData({
        phonemay: false
      })
      wx.showToast({
        title: '输入手机号有误！请核对后重新填写',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 参团人
  getTuan: function(id, temid) {
    api._get('ticket-trade/groupActivityDetail/getByActivityId?activityId=' + id + '&teamId=' + temid)
      // apid._get(':8336/groupActivityDetail/getByActivityId?activityId=' + id + '&teamId=' + temid)
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
  // 获取账号优惠券
  getCoupon: function() {
    // let _openId = wx.getStorageSync('openid');
    let params = {
      pageCount: 1,
      pageSize: 100,
      openId: wx.getStorageSync('openid'),
      status: 1
    }
    api._get('ticket-pay/coupon/getCouponsByStatus', params)
      // apid._get(':9100/coupon/getCouponsByStatus', params)
      .then(res => {
        if (res.status == 200) {
          let _list = res.data
          _list.push({
            favorNum: 0,
            id: "",
            remark: "暂不选择",
            type: 99
          })
          let _address = wx.getStorageSync('global_city')
          let u_list = _list.filter(val=>val.type!=3)
          if (_address == '芜湖') {
            this.setData({
              couponList: _list
            })
          }else{
            this.setData({
              couponList: u_list
            })
          }          
        } else {
          this.setData({
            couponList: null
          })
        }
      }).catch(e => {
        console.log(e)
      })
  },
  //  获取票数
  getketNum: function (id) {
    api._get('ticket-trade/shareTicket/getByBrandId?brandId=' + id)
      .then(res => {
        // console.log(res)
        let _data = res.data
        this.setData({
          surplusNum: _data.surplusNum
        })
      })
  },
  // 支付
  goPayto: function() {
    let _iflogin = wx.getStorageSync('user_auto');
    if (_iflogin == 'true') {
      let _unum = this.data.maynumber * this.data.oderobject.amount - this.data.playmoney - this.data.couponmoney
      let _data = this.data.oderobject
      let _couponPrice = this.data.playmoney
      let _amount = _unum.toFixed(2)
      let payname = this.data.mayname
      let payphone = this.data.mayphone
      let _phonemay = this.data.phonemay
      let _couponkey = this.data.couponkey
      let _couponif = this.data.couponif
      let _openid = wx.getStorageSync('openid')
      let  _discountType=_data.actYpe
      if (_couponif){
        _discountType=5
      }else{
        _discountType=0
      }
      let params = {
        amount: _amount,
        buyNum: this.data.maynumber,
        contactName: payname,
        couponId: _couponkey,
        favor: _couponif,
        mobile: payphone,
        openId: _openid,
        sceneId: _data.id,
        spbillCreateIp: wx.getStorageSync('user_ip'),
        discountType: _discountType,
        activityId: _data.groupActivityId,
        teamId: _data.groupteamId,
        couponPrice: _couponPrice
      }
      if (payname != '' && payphone != '' && _phonemay) {
        api._post('ticket-pay/seckill/prepay', params)
          // apid._post(':9100/seckill/prepay', params)
          .then(res => {
            if (res.status == 200) {
              let weChatkey = JSON.parse(res.data)
              let _timeStamp = weChatkey.timeStamp.toString()
              wx.requestPayment({
                appId: weChatkey.appId,
                timeStamp: _timeStamp,
                nonceStr: weChatkey.nonceStr,
                package: weChatkey.package,
                signType: "MD5",
                paySign: weChatkey.sign,
                success: res => {
                  let _oderno = weChatkey.orderNo
                  wx.redirectTo({
                    url: '../ordergreat/ordergreat?orderNo=' + _oderno
                  })
                },
                fail: res => {
                  wx.redirectTo({
                    url: '../orderlist/orderlist'
                  })
                },
                complete: res => {
                  console.log(res)
                }
              })
            } else if (res.status == 0) {
              let _oderno = res.data
              wx.redirectTo({
                url: '../ordergreat/ordergreat?orderNo=' + _oderno
              })
              // wx.showToast({
              //   title: res.msg,
              //   icon: 'none',
              //   duration: 2000
              // })
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
      } else {
        wx.showToast({
          title: '请填写姓名与手机号，以便于我们联系您！',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.reLaunch({
        url: '/pages/mine/mine',
      })
    }
  },
})