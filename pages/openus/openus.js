// pages/openus/openus.js
// const apid = require('../../utils/requuu.js')
const api = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    picker: ['不会用/怎么用/找不到', '打不开/卡顿/数据丢失', '订单问题', '改进建议', '其他'],
    imgList: [],
    textareaAValue: '',
    nameValue: '',
    phoneValue: ''
  },
  // 选项
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这个图片吗？',
      cancelText: '确定',
      confirmText: '取消',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  // 问题描述
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  // 联系人
  nameInput(e) {
    this.setData({
      nameValue: e.detail.value
    })
  },
  // 手机
  phoneInput(e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  // 发送表单
  sendFrom: function() {
    let _data = this.data
    let _openid = wx.getStorageSync('openid');
    let _type = _data.picker[_data.index]
    let _feedbackPics = _data.imgList[0]
    if (_data.textareaAValue != '' && _data.nameValue != '' && _data.phoneValue != '') {
      let feedback = {
        openId: _openid,
        type: _type,
        content: _data.textareaAValue,
        feedbackPics: _feedbackPics,
        contactName: _data.nameValue,
        contactMobile: _data.phoneValue
      }
      api._post('ticket-trade/feedback/save', feedback).then(res => {
        if (res.status == 200) {
          this.setData({
            index: null,
            imgList: [],
            textareaAValue: '',
            nameValue: '',
            phoneValue: ''
          })
          wx.showToast({
            title: '反馈成功,感谢您的反馈我们会做的更好！',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '提交失败，请检查网络连接！',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请填写必要信息，以便于我们准确修改！',
        icon: 'none',
        duration: 2000
      })
    }
  }
})