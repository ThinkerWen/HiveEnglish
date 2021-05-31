const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},       // 用户信息
    hasUserInfo: false, // 是否获取了用户openId
    openId: "",         // 用户的openId
    monthArr: [],       // 用户的登录天数数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var monthArr = this.monthInit()   // 初始化当前月份列表
    this.setData({      // 从全局获取用户openId及用户userInfo,并设置到本页
      userInfo: app.globalData.userInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      monthArr: monthArr              // 设置当前月份列表，以便上传
    })
  },

  getMonthStartDay: function(year, month) {
    return new Date(year, month-1,1).getDay()
  },

  // 初始化当前月份列表，无需改动
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

  // 获取用户openId
  getOpenId() {
    wx.showLoading({        // 显示转圈提示
      title: 'Login',
    })
    wx.cloud.callFunction({      // 调用云函数获取openId
      name: 'functions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {         // 调用后返回值
      this.setData({
        openId: resp.result.openid    // 获取到的openId存储到本页
      })
      console.log(resp.result.openid)
      wx.setStorageSync('openId', resp.result.openid)
      getApp().globalData.openId = this.data.openId   // 获取到的openId存储到全局
      console.log(this.data.openId)
      this.pushDatabase()       // 向数据库中添加用户
    }).catch((e) => {
      this.setData({
        showUploadTip: true
      })
    }).finally(() => {
      wx.hideLoading()        // 隐藏转圈提示
    })
  },

  pushDatabase: function() {
    var that = this
    db.collection('userInfo').where({   // 从用户信息userInfo数据库查询当前登录用户
      _openid: this.data.openId // 填入当前用户 openid
    }).get().then(res => {
      if(res.data.length == 0){         // 用户信息userInfo数据库中无当前用户
        this.addBook()          // 为用户添加默认书籍
        db.collection('userInfo').add({ // 在用户信息userInfo数据库中插入新用户，并赋初值
          data: {
            _id:this.data.openId,
            userName: this.data.userInfo.nickName,
            userPic: this.data.userInfo.avatarUrl,
            userAddress: this.data.userInfo.city,
            userInfo: this.data.userInfo,
            registerDay: new Date(),
            reminderTime: "",
            continueDays: 0,      // 连续天数
            days: [0,0,0,0,0,0,0],  // 近五天学习情况
            dayWords: 20,         // 每日学习单词数规划
            learnedDays: this.data.monthArr   // 当月学习打卡的日期列表
          }
        })
      }
      else{       // 用户已经存在
        var now = new Date()
        var y = now.getFullYear()
        var m = now.getMonth()
        var d = now.getDate()
        var monthArr = res.data[0].learnedDays

        for(let j of monthArr){       // 检索本日，将本日添加打卡，设置status=1
          if(y != j.year) continue;
          if(m != j.month) continue;
          else{
            var k = 0
            while(!(j.dateArr[k].dateNum)) k++
            j.dateArr[k-1+d].status = 1
          }
        }
        
        db.collection('userInfo').doc(that.data.openId).update({  //更新登录用户打卡数据，将本日添加
          data: {
            learnedDays: monthArr
          }
        })

      }
    })
  },

  // 获取用户信息
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        getApp().globalData.userInfo = res.userInfo   // 在全局添加用户信息
        getApp().globalData.hasUserInfo = true        // 在全局设置已获取用户信息为true
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo, // 在本页添加用户信息
          hasUserInfo: true       // 在本页设置已获取用户信息为true
        })
        this.getOpenId()
      }
    })
  },

  // 添加默认书籍
  addBook: function(){
    var that = this
    var newWord = []
    db.collection('userLearned').where({
      userId: app.globalData.openId,
      bookId: 'CET6luan_1'
    })
    .get({
      success: function(res) {
        if(res.data.length == 0){
          db.collection('CET6luan_1').get({
            success: function(res) {
              newWord = res.data
              db.collection('userLearned').add({
                data: {
                  bookId: 'CET6luan_1',
                  learnedSequence: 20,
                  newWord: newWord,
                  reviewWord: [],
                  userId: app.globalData.openId,
                },
                success: function(res) {
                  console.log(res)
                }
              })
            }
          })
        }
      }
    })
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})