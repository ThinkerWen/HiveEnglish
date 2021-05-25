// miniprogram/pages/dictionary/dictionary.js
const db = wx.cloud.database()
const API = "https://dict.youdao.com/dictvoice?audio="
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    id: "",
    loaded: false,
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
    const eventChannel = this.getOpenerEventChannel()
    console.log(options)
    that = this
    that.setData({
      id : options.id,
      type : parseInt(options.type)
    })
    
    console.log(this.data.allWordList)
    if(options.id){
      this.getWord()
    }

    var currentWordsList
    if(that.data.type){
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        that.setData({
          newWordsList: data.newWord,
          oldWordsList: data.reviewWord,
        })
      })
      this.setCurrentList(4)
    }
    else{
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        console.log(data)
        var unstudyWords = data.newWord.concat(data.reviewWord)
        var easyWords = []
        for(let i=0; i<unstudyWords.length; i++){
          if(unstudyWords[i].simple){
            easyWords.push(unstudyWords[i])
          }
        }
        that.setData({
          unstudyWordsList: unstudyWords,
          studiedWordsList: data.reviewWord,
          studingWordsList: data.newWord,
          easyWordsList: easyWords,
        })
        that.setCurrentList(0)
      })
      console.log(options)
    }
  },

  getWord: function(){
    this.setData({
     total: this.data.total + 20
    })
    var that = this
    var first = true
    db.collection(this.data.id).count().then(async res =>{
      const MAX_LIMIT = 20;
      let total = this.data.total;
      // let total = res.total;
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      // 承载所有读操作的 promise 的数组
      for (let i = 0; i < batchTimes; i++) {
        await db.collection(this.data.id).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res => {
          let new_data = res.data
          let old_data = that.data.currentWordsList
          // if(!first){
          //   old_data = that.data.currentWordsList
          // }
          // else{
          //   old_data = []
          //   first = false
          // }
          if(i >= that.data.total/20 - 1){
            that.setData({
              // allWordList : old_data.concat(new_data),
              currentWordsList : old_data.concat(new_data),
              loaded:true
              // Databased : true
            })
          }
        })
      }
      console.log(this.data.currentWordsList)
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
    currentWordsList[e.currentTarget.dataset.index].mask = currentWordsList[e.currentTarget.dataset.index].mask==1 ? 0 : 1
    that.setData({
      currentWordsList: currentWordsList
    })
  },

  maskSwitchChange: function(e){      //改变遮挡状态
    var currentWordsList = that.data.currentWordsList
    var mask = e.detail.value
    console.log(e)
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
  
})