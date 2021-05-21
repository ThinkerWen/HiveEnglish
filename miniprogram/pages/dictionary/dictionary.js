// miniprogram/pages/dictionary/dictionary.js
const db = wx.cloud.database()
const API = "https://dict.youdao.com/dictvoice?audio="
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    Databased: false,
    isMask: 1,
    type: 0,
    tabIndex: 0,
    allWordList: [],
    newWordsList: [],
    oldWordsList: [],
    unstudyWordsList: [],
    studiedWordsList: [],
    studingWordsList: [],
    easyWordsList: [],
    currentWordsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.Databased)
    that = this
    that.setData({
      id : options.id,
      type : parseInt(options.type)
    })
    
    console.log(this.data.allWordList)
    if(!this.data.Databased){
      this.getWord()
    }

    var currentWordsList
    if(that.data.type){
      var task = wx.getStorageSync('task');
      that.setData({
        newWordsList: task.newWords,
        oldWordsList: task.oldWords,
      })
      this.setCurrentList(4)
    }
    else{
      var dictionary = wx.getStorageSync('newWordsProgress')
      that.setData({
        unstudyWordsList: dictionary.unstudyWords,
        studiedWordsList: dictionary.studiedWords,
        studingWordsList: dictionary.studingWords,
        easyWordsList: dictionary.easyWords,
      })
      this.setCurrentList(0)
    }
  },

  getWord: function(){
    this.setData({
      Databased: true
    })
    var that = this
    db.collection(this.data.id).count().then(async res =>{
      const MAX_LIMIT = 20;
      let total = res.total;
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      // 承载所有读操作的 promise 的数组
      for (let i = 0; i < batchTimes; i++) {
        await db.collection(this.data.id).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res => {
          let new_data = res.data
          let old_data = that.data.allWordList
          that.setData({
            allWordList : old_data.concat(new_data),
            // Databased : true
          })
        })
      }
      console.log(this.data.allWordList)
    })

    // db.collection(this.data.id).doc('todo-identifiant-aleatoire').get({
    //   success: function(res) {
    //     // res.data 包含该记录的数据
    //     console.log(res.data)
    //   }
    // })
  },

  sound: function(e){
    var url = API + "access&type=2"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
      }
    })
  },

  changeList: function(e){
    var index = parseInt(e.currentTarget.dataset.index)
    if(!that.data.type){
      switch (index) {
        case 0:
          this.setCurrentList(0)
          break;
        case 1:
          this.setCurrentList(1)
          break;
        case 2:
          this.setCurrentList(2)
          break;
        case 3:
          that.setCurrentList(3)
          break;
        default:
          break;
      }
    }
    else{
      if(!index){
        that.setCurrentList(4)
      }
      else{
        that.setCurrentList(5)
      }
    }
    that.setData({
      tabIndex: index
    })
  },

  setCurrentList: function(i){
    var currentWordsList = []
    switch (i) {
      case 0:
        currentWordsList = that.data.unstudyWordsList
        break;
      case 1:
        currentWordsList = that.data.studingWordsList
        break;
      case 2:
        currentWordsList = that.data.studiedWordsList
        break;
      case 3:
        currentWordsList = that.data.easyWordsList
        break;
      case 4:
        currentWordsList = that.data.newWordsList
        break;
      case 5:
        currentWordsList = that.data.oldWordsList
        break;
      default:
        break;
    }
    for (let i of currentWordsList){
      i.mask = true
    }
    that.setData({
      currentWordsList: currentWordsList
    })
  },
  wordMask: function(e){
    var currentWordsList = that.data.currentWordsList
    currentWordsList[e.currentTarget.dataset.index].mask = !currentWordsList[e.currentTarget.dataset.index].mask
    that.setData({
      currentWordsList: currentWordsList
    })
  },

  maskSwitchChange: function(e){
    var currentWordsList = that.data.currentWordsList
    var mask = e.detail.value
    for( let i of currentWordsList){
      i.mask = mask
    }
    that.setData({
      isMask: mask,
      currentWordsList: currentWordsList
    })
  },

  viewWordInfo: function(e){
    wx.navigateTo({
      url: '../wordInfo/wordInfo?Wid=' + that.data.currentWordsList[e.currentTarget.dataset.index].Wid
    })
  },

  pronounce: function(e){
    console.log(e)
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = API+e.currentTarget.dataset.word
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.audioCtx = wx.createAudioContext('myAudio')
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
  
  audioPlay: function () {
    this.audioCtx.play()
  },

  test: function(e){
    console.log(e)
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'https://dict.youdao.com/dictvoice?audio='+e.currentTarget.dataset.word
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
})