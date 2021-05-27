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
    totalNum: 0,
    masterNum: 0,
    studingNum: 0,
    easyNum: 0,
    progress: {
      date:["4.05", "4.06", "4.07", "4.08", "4.09", "4.10", "4.11"],
      total:[1200, 1292, 1412, 1532, 1672, 1921, 2100],
      master:[600, 700, 800, 900, 1100, 1200, 1400]
    },
    hasReasult: false,
    searchReasult: {
      wordHead: "tset",
      tranCn: "测试",
      ukspeech: "test",
      ukphone: "test"
    }
    // stastistics: {
    //   date:["4.05", "4.06", "4.07", "4.08", "4.09", "4.10", "4.11"],
    //   total:[140, 122, 142, 152, 162, 151, 110],
    //   master:[60, 70, 80, 90, 110, 120, 100]
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.openId){
      this.getData();
    }else{
      wx.showToast({
         title: '请授权登录！',
         icon: 'none',
         duration: 1500,
         success: function () {
         setTimeout(function () {
         wx.reLaunch({
         url: '../userCenter/userCenter',
            })
          }, 1500);
         }
      })
    }
    // this.drawCanvas1();
    // this.drawCanvas2();
  },

  getData: function(){
    var that = this
    var masterCount = 0
    var progress = {}
    var master = []
    var total = []
    var today = new Date()
    var month = today.getMonth()+1
    var day = today.getDate()
    db.collection('userInfo').where({
      _id: app.globalData.openId
    })
    .get({
      success: function(res) {
        var count = 0
        var totalCount = 0
        for(let i=0; i<7; i++){
          count += res.data[0].days[i]
          master[i] = count
        }
        console.log(master)
        progress.master = master
        progress.date = []
        for(let i=0; i<7; i++){
          totalCount += 20
          total[i] = totalCount
        }
        for(let i=6; i>=0; i--){
          progress.date.push(month+"."+day)
          day--
        }
        progress.date = progress.date.reverse()
        console.log(progress.date)
        progress.total = total
        console.log(progress)
        that.setData({
          progress: progress,
          studingNum: totalCount,
          masterNum: master[6]
        })
        console.log(that.data.progress)
        that.drawCanvas1();
        // that.drawCanvas2();
      }
    })
  },

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

  drawCanvas2: function(){
    var progress = this.data.stastistics
    var yLabelInc = (listMax(progress.total) - listMin(progress.master))/6
    var ctx1 = wx.createCanvasContext('canvas2');
    ctx1.translate(rpx2px(75),rpx2px(50))
    ctx1.setStrokeStyle("#eeeeee")
    ctx1.setFillStyle('#333333')
    ctx1.setGlobalAlpha(1)
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
    ctx1.setGlobalAlpha(0.5)
    ctx1.setFillStyle('#f3a683')
    for(var i=1; i<7; i++){
      var x = rpx2px(i*540/6)
      var y = rpx2px((1-((progress.total[i]-listMin(progress.master))/parseFloat(yLabelInc*6)))*300)
      ctx1.rect(x-10, y, 20, rpx2px(300)-y)
    }
    ctx1.fill()
    ctx1.draw(true)
    //draw data2
    ctx1.setGlobalAlpha(0.3)
    ctx1.setFillStyle('#e77f67')
    for(var i=1; i<7; i++){
      var x = rpx2px(i*540/6)
      var y = rpx2px((1-((progress.master[i]-listMin(progress.master))/parseFloat(yLabelInc*6)))*300)
      ctx1.rect(x-10, y, 20, rpx2px(300)-y)
    }
    ctx1.fill()
    ctx1.draw(true)
  },

  translate:function(e){
    var that = this
    var appKey = '34a69e1ca7b7274f';
    var key = 'cNh4xArEls6qsF1FnqlgDpbaFNCxT4WC';
    var salt = (new Date).getTime();
    var curtime = Math.round(new Date().getTime()/1000);
    var query = e.detail.value;
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
        console.log(res.data.tSpeakUrl)
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

  truncate: function(q){
    var len = q.length;
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
  },

  pronounce: function(e){
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    if(e.currentTarget.dataset.type == 0){
      if(this.testHans(this.data.searchReasult.wordHead)){
        innerAudioContext.src = API + this.data.searchReasult.wordHead + "&type=1"
      }
    }else{
      if(this.testHans(this.data.searchReasult.tranCn)){
        innerAudioContext.src = API + this.data.searchReasult.tranCn + "&type=1"
      }
    }
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  testHans: function(str){
    for (var i in str) {
      var asc = str.charCodeAt(i);
      if ((asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
          return true;
      }
    }
    return false
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