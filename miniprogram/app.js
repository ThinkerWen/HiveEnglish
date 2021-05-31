//app.js
var data = require('utils/data.js')
App({

  globalData: {
    Databased: {
      allBook: false
    },
    userInfo: {},
    hasUserInfo: false,
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
    // this.initTask();
    // this.globalData = {}
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
