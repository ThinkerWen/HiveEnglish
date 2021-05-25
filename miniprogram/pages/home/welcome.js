// pages/home/welcome.js
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
    defaultImg: "../../images/icons/login.png"
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
    console.log("1")
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
      setTimeout(function(){
        wx.switchTab({
          url: './home',
        })
      }, 1500)
    }).catch((e) => {
      this.setData({
        showUploadTip: true
      })
    }).finally(() => {
      wx.hideLoading()
    })
    console.log("2")
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
            day1: 0,
            day2: 0,
            day3: 0,
            day4: 0,
            day5: 0,
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
    console.log("3")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})