// miniprogram/pages/userCenter/userCenter.js
// var data = require("../../utils/data.js")
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    openId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: app.globalData.hasUserInfo
    })
  }, 

  getOpenId() {
    wx.showLoading({
      title: '',
    })
   wx.cloud.callFunction({
      name: 'functions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      this.setData({
        haveGetOpenId: true,
        openId: resp.result.openid
      })
      getApp().globalData.openId = this.data.openId
      this.pushDatabase()
    }).catch((e) => {
      this.setData({
        showUploadTip: true
      })
    }).finally(() => {
      wx.hideLoading()
      // console.log(app.globalData.openId)
    })
  },

  pushDatabase: function() {
    // console.log(this.data)
    // var openId = this.data.openId
    console.log(this.data.openId)
    db.collection('userInfo').where({
      _openid: this.data.openId // 填入当前用户 openid
    }).get().then(res => {
      if(res.data.length == 0){
        db.collection('userInfo').add({
          data: {
            _id:this.data.openId,
            userName: this.data.userInfo.nickName,
            userPic: this.data.userInfo.avatarUrl,
            userAddress: this.data.userInfo.city,
            registerDay: new Date()
          }
        })
      }
    })
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        getApp().globalData.userInfo = res.userInfo
        getApp().globalData.hasUserInfo = true
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.getOpenId()
        // console.log(this.data)
        // console.log(res.userInfo)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toTaskPage: function() {
    wx.navigateTo({
      url: '../task/task'
    })
  },

  toCalendarPage: function(){
    wx.navigateTo({
      url: '../calendar/calendar',
    })
  },

  toRemindPage: function(){
    wx.navigateTo({
      url: '../remind/remind',
    })
  },

  exitMiniprogram: function(){
    wx.navigateBack({
      delta: 0
    })
  }
})