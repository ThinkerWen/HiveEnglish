// miniprogram/pages/task/task.js
const db = wx.cloud.database()
const app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBookInfo:{},
    myBooksList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.getBook()
    this.refresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  getBook: function(){
    db.collection('userLearned').where({
      userId: app.globalData.openId // 填入当前用户 openid
    }).get().then(res => {
      console.log(res.data)
    })
    // db.collection("userLearned").aggregate()
    //   .lookup({
    //     from: 'Booklist',
    //     localField: 'bookId',
    //     foreignField: 'id',
    //     as: 'BookInfo',
    //   })
    //   .end()
    //   .then(res => console.log(res))
    //   .catch(err => console.error(err))
  },

  refresh: function(){
    var cBookInfo = {
      name: "六级考纲词汇",
      plan: {
        new: 200,
        old: 400
      },
      totalNum: 2340,
      studiedNum: 242,
      imgUrl: "../../images/books/book1.png"
    }
    that.setData({
      currentBookInfo: cBookInfo
    })

    var bookList = []
    bookList.push(cBookInfo)
    bookList.push(cBookInfo)
    that.setData({
      myBooksList: bookList
    })
  },

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

  toPlanPage: function() {
    wx.navigateTo({
      url: '../plan/plan',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  toDictionary: function () {
    wx.navigateTo({
      url: '../dictionary/dictionary',
    })
  },

  toLibrary: function(){
    wx.navigateTo({
      url: '../library/library',
    })
  }
})