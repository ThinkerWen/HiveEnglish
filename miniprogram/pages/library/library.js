// miniprogram/pages/library/library.js
const db = wx.cloud.database()
const app = getApp()
Page({
  // const db = wx.cloud.database()
  // 2. 构造查询语句
  // collection 方法获取一个集合的引用
  // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
  // get 方法会触发网络请求，往数据库取数据
  
  /**
   * 页面的初始数据
   */
  data: {
    Databased : false,
    booksList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.refresh()
    // if(!app.globalData.Databased.allBook){
    this.getBook()
      // getApp().globalData.Databased.allBook = true
      // console.log("in")
    // }
  },

  getBook: function() {
    var that = this
    db.collection('Booklist').count().then(async res =>{
      const MAX_LIMIT = 20;
      let total = res.total;
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      // 承载所有读操作的 promise 的数组
      for (let i = 0; i < batchTimes; i++) {
        await db.collection('Booklist').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res => {
          let new_data = res.data
          let old_data = that.data.booksList
          that.setData({
            booksList : old_data.concat(new_data),
            Databased : true
          })
        })
      }
    })
  },

  refresh: function() {
    var cBookInfo = {
      name: "六级考纲词汇",
      plan: {
        new: 200,
        old: 400
      },
      totalNum: 2340,
      studiedNum: 242,
      imgUrl: "../../images/books/book1.png",
      star: true
    }

    var booksList = []
    booksList.push(cBookInfo)
    cBookInfo.name = "四级词汇"
    booksList.push(cBookInfo)
    this.setData({
      booksList: booksList
    })
  },

  star: function(e){
    var booksList = this.data.booksList
    var index = e.currentTarget.dataset.index
    booksList[index].star = !booksList[index].star
    this.setData({
      booksList: booksList
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

  toDictionary: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../dictionary/dictionary?id=',
    })
  },
})