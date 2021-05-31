// miniprogram/pages/status/status.js
var CryptoJS = require('../../utils/crypto-js.js');
const API = "https://dict.youdao.com/dictvoice?audio="
const db = wx.cloud.database()
const app = getApp()

function rpx2px(rpx) {
  var px = rpx / 750 * wx.getSystemInfoSync().windowWidth
  return px
}

function listMax(list){
  var listMax = -99999;
  for(var i=0; i<list.length; i++){
    if(list[i] > listMax){
      listMax = list[i]
    }
  }
  return listMax
}

function listMin(list){
  var listMin = 99999;
  for(var i=0; i<list.length; i++){
    if(list[i]<listMin){
      listMin = list[i]
    }
  }
  return listMin
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    continueDays: 0,    // 连续学习天数
    totalNum: 0,
    masterNum: 0,       // 已掌握单词数
    studingNum: 0,      // 正在学单词数
    progress: {
      date:["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],    // 绘制日期
      total:[0, 25, 50, 75, 100, 125, 150],         // 绘制单词总数
      master:[0, 0, 0, 0, 0, 0, 0]             // 绘制学习单词数
    },
    hasReasult: false,  // 是否有单词翻译
    searchReasult: {
      wordHead: "tset",   // 输入单词
      tranCn: "测试",     // 翻译结果
      fromspeech: "test", // 翻以前语音
      tospeech: "test"    // 翻译后语音
    }
  },

  onShow: function () {
    if(!app.globalData.openId){   // 检测是否登录
      this.drawCanvas1();         // 为登录绘制默认数据
      return;
    }
    this.getData();     // 获取用户学习数据
  },

  // 获取用户学习数据
  getData: function(){
    var that = this
    var progress = {
      master: [],
      total: [],
      date: [],
    }
    var today = new Date()          // 获取今日，用于Canvas
    var month = today.getMonth()+1
    var day = today.getDate()

    db.collection('userInfo').where({
      _id: app.globalData.openId
    })
    .get({
      success: function(res) {
        var count = 0
        var totalCount = 0
        for(let i=0; i<7; i++){       // 循环赋值近七天的单词学习量
          count += res.data[0].days[i]
          progress.master.push(count)
        }
        // progress.date = []
        for(let i=0; i<7; i++){       // 循环赋值近七天的每日累计单词理论量，默认每日20
          totalCount += 20            // 循环计数近七天的单词理论学习总量
          progress.total.push(totalCount)
        }
        for(let i=6; i>=0; i--){      // 循环赋值近七天的日期，今天为最后一天
          progress.date.push(month+"."+day)
          day--
        }
        progress.date = progress.date.reverse()   // 日期逆序
        that.setData({
          continueDays:res.data[0].continueDays,
          progress: progress,
          studingNum: totalCount,
          masterNum: progress.master[6]
        })
        that.drawCanvas1();
      }
    })
  },

  // 获取要翻译的单词
  bindInput: function (e) {
    this.setData({
      query: e.detail.value
    })
  },

  // 翻译获取接口
  translate:function(e){
    var query = e.detail.value ? e.detail.value : this.data.query
    var that = this
    var appKey = '34a69e1ca7b7274f';
    var key = 'cNh4xArEls6qsF1FnqlgDpbaFNCxT4WC';
    var salt = (new Date).getTime();
    var curtime = Math.round(new Date().getTime()/1000);
    var from = 'auto';
    var to = 'auto';
    var str1 = appKey + this.truncate(query) + salt + curtime + key;
    var vocabId =  '您的用户词表ID';

    var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
    wx.request({
      url: 'https://openapi.youdao.com/api',
      data: {
        q: query,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: "v3",
        curtime: curtime,
        vocabId: vocabId,
      },
      success:res=>{
        var result = {}
        result.wordHead = res.data.query
        result.tranCn = res.data.translation[0]
        result.tospeech = res.data.tSpeakUrl
        result.fromspeech = res.data.speakUrl
        that.setData({
          hasReasult: true,
          searchReasult:result
        })
      },
      fail:res=>{
        console.log('fail:',res)
      }
    })
  },

  // 翻译接口配套加密
  truncate: function(q){
    var len = q.length;
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
  },

  // 朗读
  pronounce: function(e){
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    if(e.currentTarget.dataset.type == 0){      // 读来源
      if(this.testHans(this.data.searchReasult.wordHead)){    // 含英文
        innerAudioContext.src = API + this.data.searchReasult.wordHead + "&type=1"
      }else wx.showToast({title: '暂不支持非英文', icon: 'none', duration: 1500,})
    }else{                                      // 读结果
      if(this.testHans(this.data.searchReasult.tranCn)){      // 含英文
        innerAudioContext.src = API + this.data.searchReasult.tranCn + "&type=1"
      }else wx.showToast({title: '暂不支持非英文', icon: 'none', duration: 1500,})
    }
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  // 校验是否含有英文
  testHans: function(str){
    for (var i in str) {
      var asc = str.charCodeAt(i);
      if ((asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
          return true;
      }
    }
    return false
  },

  toPhotoTrans: function(){
    if(!this.loginTest()) return;
  },

  toVsFriends: function(){
    if(!this.loginTest()) return;
    wx.navigateTo({
      url: '../fightHome/fightHome',
    })
  },

  toWordGame: function(){
    if(!this.loginTest()) return;
    wx.navigateTo({
      url: '../game/game',
    })
  },

  // Canvas绘制
  drawCanvas1: function(e){
    var progress = this.data.progress
    var yLabelInc = (listMax(progress.total) - listMin(progress.master))/6
    var ctx1 = wx.createCanvasContext('canvas1');
    ctx1.translate(rpx2px(75),rpx2px(50))
    ctx1.setStrokeStyle("#eeeeee")
    ctx1.setGlobalAlpha(1)
    ctx1.setFillStyle('#333333')
    ctx1.setFontSize(rpx2px(20))
    //init grid
    for(var i=0; i<7; i++){
      var x = rpx2px(i*540/6)
      var y = rpx2px(300)
      ctx1.moveTo(x, 0)
      ctx1.lineTo(x, y)
      ctx1.fillText(progress.date[i], x-ctx1.measureText(progress.date[i]).width/2, y+15)
    }
    for(var i=0; i<7; i++){
      var x = rpx2px(540)
      var y = rpx2px(i*300/6)
      ctx1.moveTo(0, y)
      ctx1.lineTo(x, y)
      if(i!=6)
        ctx1.fillText((listMax(progress.total)-yLabelInc*i).toString(), -ctx1.measureText((listMax(progress.total)-yLabelInc*i).toString()).width-5, y+5)
    } 
    ctx1.stroke()
    ctx1.draw()
    //draw data1
    ctx1.setGlobalAlpha(0.3)
    ctx1.setFillStyle('#7bed9f')
    ctx1.moveTo(0, rpx2px(300))
    for(var i=0; i<7; i++){
      var x = rpx2px(i*540/6)
      var y = rpx2px((1-((progress.total[i]-listMin(progress.master))/parseFloat(yLabelInc*6)))*300)
      ctx1.lineTo(x,y)
    }
    ctx1.lineTo(rpx2px(540),rpx2px(300))
    ctx1.lineTo(0,rpx2px(300))
    ctx1.fill()
    ctx1.draw(true)
    //draw data2
    ctx1.setGlobalAlpha(0.2)
    ctx1.setFillStyle('#2ed573')
    ctx1.moveTo(0, rpx2px(300))
    for(var i=0; i<7; i++){
      var x = rpx2px(i*540/6)
      var y = rpx2px((1-((progress.master[i]-listMin(progress.master))/parseFloat(yLabelInc*6)))*300)
      ctx1.lineTo(x,y)
    }
    ctx1.lineTo(rpx2px(540),rpx2px(300))
    ctx1.lineTo(0,rpx2px(300))
    ctx1.fill()
    ctx1.draw(true)
  },

  loginTest: function(){
    if(!app.globalData.openId){   //未登录跳转登录
      wx.showToast({
         title: '请授权登录！',
         icon: 'none',
         duration: 1500,
         success: function () {
         setTimeout(function () { // 等待1.5秒后跳转到userCenter
         wx.reLaunch({
         url: '../userCenter/userCenter',
            })
          }, 1500);
         }
      })
      return false
    }
    return true
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

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