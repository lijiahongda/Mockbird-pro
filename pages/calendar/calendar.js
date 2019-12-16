// pages/calendar/calendar.js
const api = require('../../utils/requst.js')
// const apid = require('../../utils/requuu.js')
const common = require('../../utils/getday.js');
var utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    unickname: null,
    unickarvr: '',
    shareactivityId:null,
    integralHisVos: null,
    isSign: 1,
    totalNum: 0,
    serialDay: 0,
    totalDay: 0,
    signcard: 0,
    isShare: 0,
    // 累计
    opera: 2,
    operb: 2,
    operc: 2,
    operd: 2,
    opere: 2,
    operf: 2,
    operg: 2,
    operh: 2,
    // 签到
    dateList: [], // 日历数据数组
    swiperCurrent: 0, // 日历轮播正处在哪个索引位置
    dateCurrent: new Date(), // 正选择的当前日期
    dateCurrentStr: '', // 正选择日期的 id
    dateMonth: '1', // 正显示的月份
    tMonthu: common.getTMon()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initDate(); // 日历组件程序
    this.getSignData()
    this.getStatisSignDay()
    this.getUserlist()
    this.getcheckShare()
    this.getcheckActivity()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function() {

  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    // this.loading('close');
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        });
      }
    });
  },
  
  // 确认
  qDao: function() {
    this.onLoad()
  },
  // 签到规则
  goQdobj: function() {
    wx.navigateTo({
      url: '/pages/qdobj/qdobj',
    })
  },
  // 签到天数获取
  getSignData: function() {
    let _openid = wx.getStorageSync('openid');
    let _date = common.getToday();
    api._get('ticket-trade/integral/getSignData?openId=' + _openid + '&date=' + _date)
      .then(res => {
        let _data = res.data
        // console.log(_data)
        if (_data.isSign == 0) {
          this.goQdub()
        } else {
          // console.log(this.data.dateList)
          let super_dateList = this.data.dateList
          let super_integralHisVos = _data.integralHisVos
          for (let w = 0; w < super_dateList.length; w++) {
            for (let r = 0; r < super_dateList[w].days.length; r++) {
              super_integralHisVos.map(val => {
                // console.log(val.addTime + '----' + super_dateList[w].days[r].id)
                if (val.addTime == super_dateList[w].days[r].id) {
                  super_dateList[w].days[r].status = 1;
                  // console.log(666);
                  return;
                } else {
                  if (super_dateList[w].days[r].status != 1) {
                    super_dateList[w].days[r].status = 0
                  }
                }
              })
            }
          }
          // console.log(super_dateList)
          this.setData({
            dateList: super_dateList,
            signcard: _data.signcard,
            isSign: _data.isSign,
            totalNum: _data.totalNum
          })
        }

      })
    // console.log(_date)
  },
  //今日签到
  goQdub: function() {
    let _openid = wx.getStorageSync('openid');
    api._post('ticket-trade/integral/signIn?integralNum=10&openId=' + _openid).then(res => {
      // console.log(res)
      if (res.status == 200) {
        this.setData({
          isSign: 0
        })
      }
    })
  },
  // 补签
  goQdbu: function(e) {
    let _date = e.currentTarget.dataset.item.id
    let _integralNum = 10
    let _openid = wx.getStorageSync('openid');
    wx.showModal({
      title: '补签',
      content: '需要消耗一个补签卡',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          api._post('ticket-trade/integral/reSignIn?date=' + _date + '&openId=' + _openid + '&integralNum=' + _integralNum).then(res => {
            if (res.status == 200) {
              console.log(res)
              this.onLoad()
            } else {

            }
          })
        }
      }
    })
  },
  //获取分享信息
  getcheckShare: function() {
    let _openid = wx.getStorageSync('openid');
    api._get('ticket-trade/share/checkShare?type=1&openId=' + _openid).then(res => {
      // console.log(res)
      if (res.status == -1) {
        this.setData({
          isShare: 0
        })
      } else {
        this.setData({
          isShare: 1
        })
      }
    })
  },
  //获取邀请信息
  getcheckActivity: function() {
    let _openid = wx.getStorageSync('openid');
    api._get('ticket-trade/redpacket/checkActivity?openId=' + _openid).then(res => {
      this.setData({
        shareactivityId:res.data.id
      })

    })
  },
  // 获取签到整合
  getStatisSignDay: function() {
    let _openid = wx.getStorageSync('openid');
    let _date = common.getToday();
    api._get('ticket-trade/integral/getStatisSignDay?date=' + _date + '&openId=' + _openid).then(res => {
      if (res.status == 200) {
        this.setData({
          serialDay: res.data.serialDay,
          totalDay: res.data.totalDay
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
  },
  // 分享订单
  goshareorder: function() {
    wx.navigateTo({
      url: '/pages/shareorder/shareorder',
    })
  },
  goredbag:function(){
    let _activityId = this.data.shareactivityId
    wx.navigateTo({
      url: '/pages/redbag/redbag?activityId=' + _activityId,
    })
  },
  // 日历组件部分
  // ----------------------------
  initDate() {
    var d = new Date();
    var month = utils.addZero(d.getMonth() + 1),
      day = utils.addZero(d.getDate());
    for (var i = -5; i <= 5; i++) {
      this.updateDate(utils.DateAddDay(d, i * 7)); //多少天之后的
    }
    this.setData({
      swiperCurrent: 5,
      dateCurrent: d,
      dateCurrentStr: d.getFullYear() + '-' + month + '-' + day,
      dateMonth: month,
    });
  },
  // 获取这周从周日到周六的日期
  calculateDate(_date) {
    var first = utils.FirstDayInThisWeek(_date);
    var d = {
      'month': first.getMonth() + 1,
      'days': [],
    };
    for (var i = 0; i < 7; i++) {
      var dd = utils.DateAddDay(first, i);
      var day = utils.addZero(dd.getDate()),
        month = utils.addZero(dd.getMonth() + 1);
      d.days.push({
        'day': day,
        'id': dd.getFullYear() + '-' + month + '-' + day,
      });
    }
    return d;
  },
  // 更新日期数组数据
  updateDate(_date, atBefore) {
    var week = this.calculateDate(_date);
    if (atBefore) {
      this.setData({
        dateList: [week].concat(this.data.dateList),
      });
    } else {
      this.setData({
        dateList: this.data.dateList.concat(week),
      });
    }
  },
  // 日历组件轮播切换
  dateSwiperChange(e) {
    var index = e.detail.current;
    var d = this.data.dateList[index];
    this.setData({
      swiperCurrent: index,
      dateMonth: d.month,
    });
  },
  // 获得日期字符串
  getDateStr: function(arg) {
    if (utils.type(arg) == 'array') {
      return arr[0] + '-' + arr[1] + '-' + arr[2] + ' 00:00:00';
    } else if (utils.type(arg) == 'date') {
      return arg.getFullYear() + '-' + (arg.getMonth() + 1) + '-' + arg.getDate() + ' 00:00:00';
    } else if (utils.type(arg) == 'object') {
      return arg.year + '-' + arg.month + '-' + arg.day + ' 00:00:00';
    }
  }
})