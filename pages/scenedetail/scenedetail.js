 const util = require('../../utils/showtime.js')
 const api = require('../../utils/requst.js')
 //  const apid = require('../../utils/requuu.js');
 var app = getApp();
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     buyNum: null,
     surplusNum: null,
     scenedList: null,
     // 场次活动类型
     actYpe: null,
     //团购
     tuanUlist: null,
     // 砍价
     kanUlist: null,
     // login
     ifLogin: 'true',
     // 须知文案
     poRule: null,
     poTip: null
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     let _id = options.id
     let _iflogin = wx.getStorageSync('user_auto');
     let _openid = wx.getStorageSync('openid');
     let _atype = options.atype
     this.setData({
       actYpe: _atype
     })
     this.getTuanlist(_atype, _id, _openid)
     this.getSetdataList(_id)
   },
   /**
    * 生命周期函数--监听页面显示
    */
   // onShow: function() {
   //  this.onLoad()
   // },
   /**
    * 生命周期函数--监听页面卸载
    */
   //  onUnload: function() {

   //  },
   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   },
   // 暂不登录 
   editLogin: function() {
     this.setData({
       ifLogin: 'true'
     })
   },
   // 确认订单无活动
   goOrder: function() {
     let _iflogin = wx.getStorageSync('user_auto');
     if (_iflogin == 'true') {
       let _data = this.data.scenedList
       let orderProps = {
         brandId: _data.brandId,
         actYpe: 0,
         groupActivityId: null,
         groupteamId: null,
         movieName: _data.movieName,
         playTime: _data.playTime,
         name: _data.name,
         address: _data.address,
         englishName: _data.englishName,
         groupMaxNum: _data.groupMaxNum,
         groupBuyNum: _data.groupBuyNum,
         amount: _data.amount,
         groupEndDate: _data.groupEndDate,
         picture: _data.picture,
         id: _data.id
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
   // 确认订单参团
   goOrderusgoing: function(event) {
     let _groupActivityId = event.target.dataset.item.groupActivityId
     let _groupteamId = event.target.dataset.item.teamId
     let _ccamount = event.target.dataset.item.discountPrice
     let _iflogin = wx.getStorageSync('user_auto');
     if (_iflogin == 'true') {
       let _data = this.data.scenedList
       let orderProps = {
         brandId: _data.brandId,
         actYpe: this.data.actYpe,
         discountPrice: _ccamount,
         groupteamId: _groupteamId,
         groupActivityId: _groupActivityId,
         movieName: _data.movieName,
         playTime: _data.playTime,
         name: _data.name,
         address: _data.address,
         englishName: _data.englishName,
         groupMaxNum: _data.groupMaxNum,
         groupBuyNum: _data.groupBuyNum,
         amount: _data.amount,
         groupEndDate: _data.groupEndDate,
         picture: _data.picture,
         id: _data.id
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
   // 确认订单参团
   goOrderus: function() {
     let _groupActivityId = this.data.tuanUlist[0].groupActivityId
     let _groupteamId = this.data.tuanUlist[0].teamId
     let _ccamount = this.data.tuanUlist[0].discountPrice
     let _iflogin = wx.getStorageSync('user_auto');
     if (_iflogin == 'true') {
       let _data = this.data.scenedList
       let orderProps = {
         brandId: _data.brandId,
         actYpe: this.data.actYpe,
         discountPrice: _ccamount,
         groupteamId: _groupteamId,
         groupActivityId: _groupActivityId,
         movieName: _data.movieName,
         playTime: _data.playTime,
         name: _data.name,
         address: _data.address,
         englishName: _data.englishName,
         groupMaxNum: _data.groupMaxNum,
         groupBuyNum: _data.groupBuyNum,
         amount: _data.amount,
         groupEndDate: _data.groupEndDate,
         picture: _data.picture,
         id: _data.id
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
   // 确认订单发起团
   goOrderusfa: function() {
     let _groupActivityId = this.data.tuanUlist[0].groupActivityId
     let _ccamount = this.data.tuanUlist[0].discountPrice
     let _iflogin = wx.getStorageSync('user_auto');
     if (_iflogin == 'true') {
       let _data = this.data.scenedList
       let orderProps = {
         brandId: _data.brandId,
         actYpe: this.data.actYpe,
         discountPrice: _ccamount,
         groupActivityId: _groupActivityId,
         groupteamId: null,
         movieName: _data.movieName,
         playTime: _data.playTime,
         name: _data.name,
         address: _data.address,
         englishName: _data.englishName,
         groupMaxNum: _data.groupMaxNum,
         groupBuyNum: _data.groupBuyNum,
         amount: _data.amount,
         groupEndDate: _data.groupEndDate,
         picture: _data.picture,
         id: _data.id
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
   // 砍价页
   goshare: function() {
     let _iflogin = wx.getStorageSync('user_auto');
     if (_iflogin == 'true') {
       let _data = this.data.scenedList
       let _id = _data.id
       let _userList = wx.getStorageSync('user_login')
       let _openid = wx.getStorageSync('openid')
       let shareobj = {
         id: _id,
         username: _userList.nickName,
         unickarvr: _userList.avatarUrl,
         openId: _openid
       }
       let json = JSON.stringify(shareobj)
       wx.navigateTo({
         url: '/pages/share/share?shareobj=' + json,
       })
     } else {
       this.setData({
         ifLogin: 'false'
       })
     }
   },
   //活动查询
   getTuanlist: function(type, filmId, openid) {
     if (!openid) {
       openid = null
     }
     api._get('ticket-trade/activity/getActivity?type=' + type + '&filmSceneId=' + filmId + '&openId=' + openid)
       //  apid._get(':8336/activity/getActivity?type=' + type + '&filmSceneId=' + filmId + '&openId=' + openid)
       .then(res => {
         if (res.status == 200) {
           let _data = res.data
           // console.log(_data)
           if (_data.bool) {
             if (_data.userBargainInfoVo.status > 1) {
               this.setData({
                 kanUlist: _data,
                 kanUlendtime: util.getTimeLeft(_data.userBargainInfoVo.bargain.endTime)
               })
             } else {
               this.setData({
                 kanUlist: _data,
                 kanUlendtime: 0
               })
             }

           } else {
             if (_data[0].endTime != null) {
               _data.map(val =>
                 val.endTime = util.getTimeLeft(val.endTime)
               )
               this.setData({
                 tuanUlist: _data
               })
             } else {
               this.setData({
                 tuanUlist: _data
               })
             }
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
   // 场次详情数据
   getSetdataList: function(id) {
     api._get('ticket-trade/filmScene/getSceneDetailById?id=' + id)
       //  apid._get(':8336/filmScene/getSceneDetailById?id=' + id)
       .then(res => {
         if (res.status == 200) {
           let _data = res.data
           let _rule = _data.groupRule
           let _tip = _data.groupTip
           let _brandId = _data.brandId
           let po_rule = _rule.split('</view>')
           let po_tip = _tip.split('</view>')
           let _groupEndDate = util.getTimeLeft(_data.groupEndDate)
           //  console.log(_data)
           //  console.log(_rule)
           this.getketNum(_brandId)
           this.setData({
             scenedList: _data,
             poRule: po_rule,
             poTip: po_tip,
             gropEndtim: _groupEndDate
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
   //  获取票数
   getketNum: function(id) {
     api._get('ticket-trade/shareTicket/getByBrandId?brandId=' + id)
       //  apid._get(':8336/shareTicket/getByBrandId?brandId=' + id)
       .then(res => {
         let _data = res.data
         this.setData({
           buyNum: _data.buyNum,
           surplusNum: _data.surplusNum
         })
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
               //  apid._post(':8101/users-anon/sys/login?code=' + code + '&encryptedData=' + encryptedData + "&iv=" + iv)
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
                         wx.switchTab({
                           url: '/pages/scene/scene'
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