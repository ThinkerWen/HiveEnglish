//app.js
var data = require('utils/data.js')
App({

  globalData: {
    Databased: {
      allBook: false
    },
    userInfo: {},
    hasUserInfo: false,
    openId: ""
  },

  initUiGlobal() {
    wx.getSystemInfo({
      success: e => {
        const { statusBarHeight: StatusBar, screenHeight, windowWidth } = e
        this.store.StatusBar = StatusBar
        this.store.screenHeight = screenHeight
        this.store.windowWidth = windowWidth
        const capsule = wx.getMenuButtonBoundingClientRect()
        if (capsule) {
          this.store.Custom = capsule
          this.store.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight
        } else {
          this.store.CustomBar = StatusBar + 50
        }
      }
    })
  },

  initEnv() {
    const env = "wxw-9gxxtesw2e0f452a"
    wx.cloud.init({
      env,
      traceUser: true
    })
    this.store.env = env
  },

  onLaunch: function () {
    this.initEnv()
    this.initUiGlobal()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    var openId = wx.getStorageSync('openId')
    var userInfo = wx.getStorageSync('userInfo')
    console.log(openId)
    if(openId){
      this.globalData.openId = openId
      this.globalData.userInfo = userInfo
      this.globalData.hasUserInfo = true
      console.log("0")
    }else{
      this.getOpenId()
    }
    // this.initTask();
    // this.globalData = {}
  },

  // 获取用户openId
  getOpenId() {
    wx.showLoading({        // 显示转圈提示
      title: 'Login',
    })
    wx.cloud.callFunction({      // 调用云函数获取openId
      name: 'functions',
      config: {
        env: this.globalData.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {         // 调用后返回值
        this.getDatabaseOpenId(resp.result.openid)
      }).catch((e) => {
      this.setData({
        showUploadTip: true
      })
    }).finally(() => {
      wx.hideLoading()        // 隐藏转圈提示
    })
  },

  getDatabaseOpenId: function(openId){
    var that = this
    const db = wx.cloud.database()
    db.collection('userInfo').where({   // 从用户信息userInfo数据库查询当前登录用户
      _openid: openId // 填入当前用户 openid
    }).get().then(res => {
      if(res.data.length != 0){         // 用户信息userInfo数据库中有当前用户
        that.globalData.openId = openId
        that.globalData.userInfo = res.data[0].userInfo
        that.globalData.hasUserInfo = true        // 在全局设置已获取用户信息为true
      }
    })
  },

  
  store: {
    StatusBar: null,
    Custom: null,
    CustomBar: null,
    screenHeight: null,
    windowWidth: null,
    env: '',
    adState: true
  },

  initTask: function() {
    var lastLoginDate;
    // if(lastLoginDate = wx.getStorageSync('lastLoginDate')){
    //   if(this.isToday(lastLoginDate)){
    //     return;
    //   }
    // }
    this.setNewDate();
    this.setNewTask();
  },

  isToday: function(dateCmp){
    var today = new Date();
    if(today.getFullYear() == dateCmp.year){
      if(today.getMonth() == dateCmp.month){
        if(today.getDay() == dateCmp.day){
          return true;
        }
      }
    }
    return false;
  },

  setNewDate: function () {
    var today = new Date();
    var date = {
      year : today.getFullYear(),
      month : today.getMonth(),
      day : today.getDay()
    }
    wx.setStorageSync('lastLoginDate', date);
  },

  setNewTask: function() {
    console.log("here")
    wx.cloud.callFunction({
      name: 'getDailyTask',
      data: {
      },
      success: res => {
        console.log(res)
        wx.setStorageSync('task', res.result.task)
        this.resetProgress(res.result.task);
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '获取任务失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  resetProgress: function(task) {
    var progress = {
      globalTimeCount: 0,
      localTimeCount: 0,
      complete: false,
      totalNum: 0,
      unstudyWords: [],
      studingWords: [],
      studiedWords: [],
      easyWords: [],
      startTime: (new Date()).getTime()
    }
    progress.totalNum = task.newWords.length;
    progress.unstudyWords = task.newWords;
    wx.setStorageSync('newWordsProgress', progress);
    progress.totalNum = task.oldWords.length;
    progress.unstudyWords = task.oldWords;
    wx.setStorageSync('oldWordsProgress', progress);
  }
})
