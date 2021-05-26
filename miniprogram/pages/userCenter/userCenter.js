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
    var monthArr = this.monthInit()
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      monthArr: monthArr
    })
  },

  getMonthStartDay: function(year, month) {
    return new Date(year, month-1,1).getDay()
  },


  monthInit: function(){
    var monthArr = []
    var tempArr = {}
    var dateArr = []
    var now = new Date()
    var y = now.getFullYear()
    var m = now.getMonth()
    const getMonthStartDay = (year, month) => new Date(year, month-1,1).getDay()
    const getMonthCountDay = (year, month) => new Date(year, month, 0).getDate()
    var num = getMonthStartDay(y,m+1)
    var dayNUm = getMonthCountDay(y, m+1)
    monthArr.year = y
    monthArr.month = m
    for(let i=0; i<num; i++){
      dateArr.push({})
    }
    for(let i=1; i<=dayNUm; i++){
      dateArr.push({"dateNum": i})
    }
    tempArr.dateArr = dateArr
    monthArr.push(tempArr)
    return monthArr
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
      console.log(this.data.openId)
      this.pushDatabase()
    }).catch((e) => {
      this.setData({
        showUploadTip: true
      })
    }).finally(() => {
      wx.hideLoading()
    })
  },

  pushDatabase: function() {
    var that = this
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
            registerDay: new Date(),
            reminderTime: "",
            continueDays: 0,
            days: [0,0,0,0,0,0],
            dayWords: 0,
            learnedDays: this.data.monthArr
          }
        })
      }
      else{
        var now = new Date()
        var y = now.getFullYear()
        var m = now.getMonth()
        var d = now.getDate()
        var monthArr = res.data[0].learnedDays

        for(let j of monthArr){
          if(y != j.year) continue;
          if(m != j.month) continue;
          else{
            var k = 0
            while(!(j.dateArr[k].dateNum)) k++
            j.dateArr[k-1+d].status = 1
          }
        }
        
        db.collection('userInfo').doc(that.data.openId).update({
          data: {
            learnedDays: monthArr
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