// miniprogram/pages/task/task.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBookInfo:{                     // 正在学的书信息
      studiedNum: 20,                     // 已学单词数
        id: "CET4luan_1",                 // 书籍bookId
        name: "四级真题核心词（图片记忆）", // 书籍名
        totalNum: 1162,                   // 书籍总单词数
        imgUrl: "https://nos.netease.com/ydschool-online/1496632727200CET4luan_1.jpg"    // 书籍封面
    },
    myBooksList:[                         // 下方展示书籍列表
      {                                   // 书籍渲染信息(myBookInfo)
        studiedNum: 20,                   // 已学单词数
        id: "CET4luan_1",                 // 书籍bookId
        name: "四级真题核心词（图片记忆）", // 书籍名
        totalNum: 1162,                   // 书籍总单词数
        imgUrl: "https://nos.netease.com/ydschool-online/1496632727200CET4luan_1.jpg"    // 书籍封面
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.openId) this.getBook()      // 获取用户书籍列表
  },

  getBook: function(){
    var that = this
    var myBooksList = []  // 将要渲染到本页面的书籍列表数据
    db.collection('userLearned').where({      // （第一次调用）从用户已添加书籍的数据库userLearned中获取书籍列表
      userId: app.globalData.openId // 填入当前用户 openid
    }).get().then(res => {    // =========第一次success========
      console.log("userLearned:",res.data)
      var myTempData = res.data     // 获取到的数据暂存
      for(let i=0; i<res.data.length; i++){   // 循环每一个用户选择的书籍
        var myBookInfo = {}         // 将要保存到本页面的书的数据格式
        myBookInfo.studiedNum = res.data[i].learnedSequence   // 用户已经学习了的单词数量
        if(i == 0){                 // 第一本书，将添加到顶部正在学
          db.collection('Booklist').where({   // （第二次调用）从书籍列表数据库Booklist中通过bookId获取书籍的详细信息
            id: res.data[i].bookId  // 上方查找数据库获取到的bookId
          }).get().then(res => {    // =========第二次success========
            var myBookInfo = {}     // 将要保存到本页面的书的数据格式
            myBookInfo.studiedNum = myTempData[i].learnedSequence
            myBookInfo.id = res.data[0].bookId
            myBookInfo.name = res.data[0].title
            myBookInfo.totalNum = res.data[0].wordNum
            myBookInfo.imgUrl = res.data[0].cover
            myBooksList.push(myBookInfo)
            console.log(myBookInfo)
            that.setData({          // 将第一本书和书籍列表设置到本页
              currentBookInfo: myBookInfo,
              myBooksList: myBooksList
            })
          })
        }else{
          db.collection('Booklist').where({   // （第二次调用）从书籍列表数据库Booklist中通过bookId获取书籍的详细信息
            id: res.data[i].bookId
          }).get().then(res => {     // =========第二次success========
            var myBookInfo = {}
            myBookInfo.studiedNum = myTempData[i].learnedSequence
            myBookInfo.id = res.data[0].bookId
            myBookInfo.name = res.data[0].title
            myBookInfo.totalNum = res.data[0].wordNum
            myBookInfo.imgUrl = res.data[0].cover
            myBooksList.push(myBookInfo)
            console.log(myBookInfo)
            that.setData({          // 将书籍列表设置到本页
              myBooksList: myBooksList
            })
          })
        }
      }
    })
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
      url: '../dictionary/dictionary?id={{item.id}}',
    })
  },

  toLibrary: function(){
    wx.navigateTo({
      url: '../library/library',
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

  }
})