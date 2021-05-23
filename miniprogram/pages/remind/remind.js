// miniprogram/pages/remind/remind.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerData: ["00:00", "00:30", "00:60", "01:00", "01:30", "01:60", "02:00", "02:30", "02:60", "03:00", "03:30", "03:60", "04:00", "04:30", "04:60", "05:00", "05:30", "05:60", "06:00", "06:30", "06:60", "07:00", "07:30", "07:60", "08:00", "08:30", "08:60", "09:00", "09:30", "09:60", "10:00", "10:30", "10:60", "11:00", "11:30", "11:60", "12:00", "12:30", "12:60", "13:00", "13:30", "13:60", "14:00", "14:30", "14:60", "15:00", "15:30", "15:60", "16:00", "16:30", "16:60", "17:00", "17:30", "17:60", "18:00", "18:30", "18:60", "19:00", "19:30", "19:60", "20:00", "20:30", "20:60", "21:00", "21:30", "21:60", "22:00", "22:30", "22:60", "23:00", "23:30"],
    time: '12:01'
  },

  pushDatabase: function() {
    var that = this
    db.collection('userInfo').where({
      _openid: app.globalData.openId // 填入当前用户 openid
    }).get().then(res => {
      if(res.data.length == 1){
        db.collection('userInfo').doc(app.globalData.openId).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            reminderTime: that.data.time
          }
        })
      }
    })
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.currentTarget.dataset.time)
    this.setData({
      time: e.currentTarget.dataset.time
    })
    this.pushDatabase()
    wx.navigateBack({
      delta: 1
    })
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