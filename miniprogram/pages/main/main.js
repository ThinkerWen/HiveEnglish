// miniprogram/pages/main/main.js
var utils = require("../../utils/utils");
const db = wx.cloud.database()
const API = "https://dict.youdao.com/dictvoice?audio="
var that
var isFirst = true;
var progress = {};
var progress1;
var progress2;
var summaryCount = 0;
var timeIntv;
var maxSum;
var pushuserLearned = {
  bookId: '',
  learnedSequence: 20,
  newWord: [],
  reviewWord: [],
  userId: ''
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myData: {},
    wordInfo: {},
    wordSequence: 0,
    myWordList: [],
    pattern: 0,
    // wordInfo: [],
    queryWordInfo: [],
    isUnknown: false,
    isEasy: false,
    isReviewing: false,
    isMask: true,
    isChinese: false,
    isQuery: false,
    summaryList: [],
	learnedPercent: 20,
    nwn1: 0,
    nwn2: 0,
    own1: 0,
    own2: 0,
    time: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var date = new Date()
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        myData: data
      })
      console.log(data)
      if(!that.getProgress()){
        that.getWords(data);
      }
      console.log(that.data)
      // that.initProgress(formated);
      // this.initWordInfo();
      // this.pronounce();
    })
    timeIntv = setInterval(()=>{
      var timeMinute = that.data.time
      var timeMinuteNow = ((new Date()).getTime() - progress.startTime) / 60000
      timeMinuteNow = parseInt(timeMinuteNow)
      if(timeMinuteNow > timeMinute){
        that.setData({
          time: timeMinuteNow
        })
      }
    }, 1000)
  },

  onUnload: function (){
    this.saveProgress();
    clearInterval(timeIntv)
  },

  getWords: function(data){
      console.log(data)
      pushuserLearned.bookId = data.bookId
      pushuserLearned.userId = data.userId
      pushuserLearned.newWord = data.newWord
      pushuserLearned.learnedSequence = data.learnedSequence
      var unstudyWords = data.newWord.concat(data.reviewWord)
      var tempWords = unstudyWords
      console.log(tempWords)
      that.setData({
        doc_id: data._id,
        bookId: data.bookId,
        own2: data.reviewWord.length,
        nwn2: data.newWord.length,
        myWordList: unstudyWords,
        wordInfo: unstudyWords[that.data.wordSequence],
        newWordsList: data.newWord,
        oldWordsList: data.reviewWord,
      })
  },

  atLarge: function(){
    that = this
    console.log(this.data.bookId + '_all')
    console.log(that.data.wordInfo.wordHead)
    db.collection(this.data.bookId + '_all').where({
      headWord: that.data.wordInfo.wordHead
    })
    .get({
      success: function(res) {
        that.setData({
          wordInfo: res.data[0]
        })
        console.log(res.data)
      }
    })
  },

  saveProgress: function(){
    var that = this
    console.log(this.data.doc_id)
    // pushuserLearned.newWord = []
    // for(let i=this.data.wordSequence; i<this.data.myWordList; i++){
    //   pushuserLearned.newWord.push(this.data.myWordList[i])
    // }
    db.collection('userLearned').doc(that.data.doc_id).update({
      data: {
        bookId:pushuserLearned.bookId,
        learnedSequence:pushuserLearned.learnedSequence,
        newWord:pushuserLearned.newWord,
        reviewWord:pushuserLearned.reviewWord,
        userId:pushuserLearned.userId,
      },
      success: function(res) {
        console.log(res.data)
      }
    })
    wx.setStorageSync('doc_id', that.data.doc_id);
    wx.setStorageSync('bookId', that.data.bookId);
    wx.setStorageSync('pushuserLearned', pushuserLearned);
    wx.setStorageSync('myWordList', that.data.myWordList);
    wx.setStorageSync('wordSequence', that.data.wordSequence);
    if(that.data.myWordList[that.data.wordSequence]){
      wx.setStorageSync('wordInfo', that.data.wordInfo);
    }else{
      wx.setStorageSync('wordInfo', that.data.myWordList[that.data.wordSequence-1]);
    }
    wx.setStorageSync('oldWordsList', that.data.oldWordsList);
    wx.setStorageSync('newWordsList', that.data.newWordsList);
    wx.setStorageSync('ow1', that.data.own1);
    wx.setStorageSync('nw1', that.data.nwn1);
    wx.setStorageSync('ow2', that.data.own2);
    wx.setStorageSync('nw2', that.data.nwn2);
  },

  getProgress: function(){
    console.log("pro")
    if(wx.getStorageSync('myWordList')){
      pushuserLearned =  wx.getStorageSync('pushuserLearned')
      this.setData({
        doc_id: wx.getStorageSync('doc_id'),
        bookId: wx.getStorageSync('bookId'),
        myWordList: wx.getStorageSync('myWordList'),
        wordSequence: wx.getStorageSync('wordSequence'),
        wordInfo: wx.getStorageSync('wordInfo'),
        oldWordsList: wx.getStorageSync('oldWordsList'),
        newWordsList: wx.getStorageSync('newWordsList'),
        own1: wx.getStorageSync('ow1'),
        nwn1: wx.getStorageSync('nw1'),
        own2: wx.getStorageSync('ow2'),
        nwn2: wx.getStorageSync('nw2')
      })
      return true
    }
    return false
    // wx.getStorageSync('myWordList')
    // wx.getStorageSync('wordSequence')
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
    // const innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = that.data.wordInfo.audioUrl
    // innerAudioContext.onPlay(()=>{})
  },

  changePattern: function() {
    var pattern = that.data.pattern;
    if(pattern == 0){
      pattern = 1;
      that.setData({
        pattern: pattern
      })
      return
    }
    else if(pattern == 1){
      that.data.summaryList.push(that.data.wordInfo);
      progress.localTimeCount += 1;
      if(progress.localTimeCount%maxSum==0||(progress.studingWords.length==0&&progress.unstudyWords.length==0)){
        maxSum = (progress.studingWords.length + progress.unstudyWords.length < 7) ? progress.studingWords.length + progress.unstudyWords.length : 7;
        progress.localTimeCount = 0;
        this.createSummaryList()
        pattern = 2;
        that.setData({
          pattern: pattern
        })
      }
      else{
        pattern = 0;
        if(!that.data.isChinese)
          this.pronounce();
        that.setData({
          pattern: pattern
        })
      }
    }
    else if(pattern == 2){
      if(progress.unstudyWords.length==0&&progress.studingWords.length==0){
        progress.complete=true;
        this.saveProgress();
        if(progress.type==0){
          this.initProgress();
          this.initWordInfo();
        }
        else{
          wx.navigateBack({
            delta: 1
          })
        }
      }
      pattern = 0;
      if (!that.data.isChinese)
        this.pronounce();
      that.setData({
        pattern: pattern,
        summaryList: []
      })
    }

  },

  selectWord: function(e) {
    var wordInfo = this.data.wordInfo;
    // wordInfo.magicSentence[e.currentTarget.dataset.index].selected = !wordInfo.magicSentence[e.currentTarget.dataset.index].selected;
    var word;
    for(var i=0; i<wordInfo.magicSentence.length; i++){
      if(i != e.currentTarget.dataset.index){
        wordInfo.magicSentence[i].selected = false;
      }
      else{
        if(wordInfo.magicSentence[i].selected != true){
          wordInfo.magicSentence[i].selected = true;
          word = wordInfo.magicSentence[i].word;
        }
        else{
          return
        }
      }
    }
    that.setData({
      isQuery: false,
      wordInfo: wordInfo
    })
    // console.log("query="+word)
    //查询单词等待回调
    wx.cloud.callFunction({
      name: 'getWord',
      data: {
        name : word
      },
      success: res => {
        console.log(res)
        if (!res.result.valid) {
          wx.showToast({
            title: '无该单词信息',
            icon: 'none',
            duration: 2000
          })
          this.exitQuery()
        }
        else{
          that.setData({
            queryWordInfo: res.result.wordInfo,
            isQuery: true
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: '获取单词信息失败',
          icon: 'none',
          duration: 2000
        })
        this.exitQuery()
      }
    })
  },

  exitQuery: function(e){
    var wordInfo = this.data.wordInfo;
    for(var i=0; i<wordInfo.magicSentence.length; i++){
      wordInfo.magicSentence[i].selected = false
    }
    that.setData({
      wordInfo: wordInfo,
      isQuery: false
    })
  },

  formatData: function(data){
    var myProgress = []
    var tempProgress = {}
    var tempData = data
    var easyWords = []
    tempProgress.type = 0
    tempProgress.complete = 0
    tempProgress.studiedWords = data.reviewWord
    for(let i=0; i<data.reviewWord.length; i++){
      if(data.reviewWord[i].simple){
        easyWords.push(data.reviewWord[i])
      }
    }
    tempProgress.easyWords = easyWords
    myProgress.push(tempProgress)
    var tempProgress = {}
    tempProgress.type = 1
    tempProgress.complete = 0
    tempProgress.studingWords = data.newWord
    for(let i=0; i<data.reviewWord.length; i++){
      if(data.newWord[i].simple){
        easyWords.push(data.reviewWord[i])
      }
    }
    tempProgress.easyWords = easyWords
    myProgress.push(tempProgress)
    return myProgress
  },

  initProgress: function(data){
    maxSum = 7;
    console.log(data)
    var tempData
    for(let i=0; i<data[0].studiedWords.length; i++){
      data[0].studiedWords[i].name = data[0].studiedWords[i].wordHead
    }
    progress1 = data[0]
    progress2 = data[1]
    // progress1 = wx.getStorageSync('newWordsProgress');
    // progress2 = wx.getStorageSync('oldWordsProgress');
    if (!(progress1.complete)){
      progress = progress1;
      this.updateTopBar()
    }
    else{
      progress = progress2;
      this.updateTopBar()
    }
  },

  updateTopBar: function(){
    // var numNew = progress1.totalNum
    // var numOld = progress2.totalNum
    var numNew = progress1.studiedWords.length
    var numOld = progress2.studingWords.length
    if(progress.type==0){
      that.setData({
        own1: 0,
        own2: numOld,
        nwn1: progress.studiedWords.length + progress.easyWords.length,
        nwn2: numNew,
      })
    }else{
      that.setData({
        own1: progress.studiedWords.length + progress.easyWords.length,
        own2: numOld,
        nwn1: numNew,
        nwn2: numNew,
      })
    }
  },

  progressForward: function(first) {
    //write back
    if(!first)
    if(!that.data.isEasy){
      if(that.data.isReviewing){
        if(that.data.isUnknown){
          progress.studingWords.push(progress.studingWords.shift())
        }
        else{
          progress.unstudyWords.push(progress.studingWords.shift())
        }
      }
      else{
        if(that.data.isUnknown){
          progress.studingWords.push(progress.unstudyWords.shift())
        }
        else{
          progress.studiedWords.push(progress.unstudyWords.shift())
        }
      }
    }
    else{
      if(that.data.isReviewing){
        progress.easyWords.push(progress.studingWords.shift())
      }
      else{
        progress.easyWords.push(progress.unstudyWords.shift())
      }
      that.setData({
        isEasy: false
      })
    }
    //
    var nextWord;
    progress.globalTimeCount += 1;
    if(progress.studingWords.length!=0 && progress.globalTimeCount - progress.studingWords[0].timeCount > 7){
      nextWord = progress.studingWords[0];
      progress.studingWords[0].timeCount = progress.globalTimeCount
      that.setData({
        isReviewing: true,
        wordInfo: nextWord
      })
    }
    else if(progress.unstudyWords.length != 0){
      nextWord = progress.unstudyWords[0];
      progress.unstudyWords[0].timeCount = progress.globalTimeCount
      // progress.unstudyWords.shift();
      that.setData({
        isReviewing: false,
        wordInfo: nextWord
      })
    }
    else if(progress.studingWords.length!=0 ){
      nextWord = progress.studingWords[0];
      progress.studingWords[0].timeCount = progress.globalTimeCount
      console.log(newWord)
      that.setData({
        isReviewing: true,
        wordInfo: nextWord
      }) 
    }
    that.setData({
      isUnknown: false
    })
    return;
  },
  
  initWordInfo: function() {
    this.progressForward(1)
    this.initMagicSentence()
  },

  updateWordInfo: function() {
    this.progressForward();
    this.initMagicSentence();
  },

  initMagicSentence: function(){
    var wordInfo = this.data.wordInfo
    wordInfo.magicSentence = utils.parseSentence(this.data.wordInfo.sentence, this.data.wordInfo.name) 
    this.setData({
      wordInfo : wordInfo
    })
  },

  knownHandle: function() {
    console.log(this.data.doc_id)
    console.log(pushuserLearned)
    if(this.data.wordSequence<this.data.myWordList.length){
      if(this.data.wordSequence<this.data.oldWordsList.length){
        this.setData({
          own1: that.data.own1+1
        })
      }
      else{
        pushuserLearned.learnedSequence = pushuserLearned.learnedSequence+1
        pushuserLearned.reviewWord.push(that.data.wordInfo)
        pushuserLearned.newWord.shift()
        this.setData({
          nwn1: that.data.nwn1+1
        })
      }
      this.setData({
        wordInfo: that.data.myWordList[that.data.wordSequence+1],
        wordSequence: that.data.wordSequence+1
      })
    }
    // if(!that.data.isUnknown){
    //   that.setData({
    //     isUnknown: false
    //   })
    // }
    if(that.data.isUnknown){
      that.setData({
        isUnknown: false,
        isReviewing: false
      })
    }
    // this.changePattern();
  },

  unknownHandle: function(e) {
    if(that.data.isReviewing || that.data.isUnknown){
      this.atLarge()
      that.setData({
        isUnknown: true
      })
      that.changePattern();
    }
    else{
      that.setData({
        isUnknown: true
      })
    }
  },

  easymark: function(e){
    that.setData({
      isEasy: true
    })
    that.changePattern();
  },

  uneasymark: function(e){
    that.setData({
      isEasy: false
    })
  },

  nextHandle: function(e) {
    if(this.data.wordSequence<this.data.myWordList.length){
      this.knownHandle()
    }
    else{
      wx.navigateBack({
        delta: 1
      })
    }
    this.setData({
      pattern:0
    })
    // that.updateWordInfo()
    // that.changePattern()
    // that.updateTopBar()
  },

  createSummaryList: function(){
    var summaryList = that.data.summaryList
    for(let i of summaryList){
      i.mask = that.data.isMask
    }
    that.setData({
      summaryList: summaryList
    })
    // var num = progress.globalTimeCount%7==0?7:progress.globalTimeCount%7;
    // var summaryList = []
    // var i1 = progress.studingWords.length - 1;
    // var i2 = progress.studiedWords.length - 1;
    // var i3 = progress.easyWords.length - 1;
    // //may error
    // while(num--){
    //   if(i1<0 && i2<0){
    //     continue
    //   }
    //   if(i1 < 0){
    //     summaryList.unshift(progress.studiedWords[i2]);
    //     i2--;
    //   }
    //   else if(i2 < 0){
    //     summaryList.unshift(progress.studingWords[i1]);
    //     i1--;
    //   }
    //   else{
    //     if(progress.studingWords[i1].timeCount > progress.studiedWords[i2].timeCount){
    //       summaryList.unshift(progress.studingWords[i1]);
    //       i1--;
    //     }
    //     else{
    //       summaryList.unshift(progress.studiedWords[i2]);
    //       i2--;
    //     }
    //   }
    //   summaryList[0].mask = that.data.isMask
    //}

  },
  
  wordMask: function(e){
    var summaryList = that.data.summaryList
    summaryList[e.currentTarget.dataset.index].mask = !summaryList[e.currentTarget.dataset.index].mask
    that.setData({
      summaryList: summaryList
    })
  },

  maskSwitchChange: function(e){
    var summaryList = that.data.summaryList
    var mask = e.detail.value
    for( let i of summaryList){
      i.mask = mask
    }
    that.setData({
      isMask: mask,
      summaryList: summaryList
    })
  },

  chineseSwitchChange: function(e){
    this.setData({
      isChinese: !this.data.isChinese
    })
  },

  unknownmark: function(e){
    that.setData({
      isUnknown: true
    })
  },

  viewQueryWordInfo: function(e){
    wx.navigateTo({
      url: '../wordInfo/wordInfo?name='+that.data.queryWordInfo.name,
    })
  }
})