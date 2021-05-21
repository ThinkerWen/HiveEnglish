// miniprogram/pages/status/status.js
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
    totalNum: 8110,
    masterNum: 7559,
    studingNum: 249,
    easyNum: 559,
    progress: {
      date:["4.05", "4.06", "4.07", "4.08", "4.09", "4.10", "4.11"],
      total:[1200, 1292, 1412, 1532, 1672, 1921, 2100],
      master:[600, 700, 800, 900, 1100, 1200, 1400]
    },
    stastistics: {
      date:["4.05", "4.06", "4.07", "4.08", "4.09", "4.10", "4.11"],
      total:[140, 122, 142, 152, 162, 151, 110],
      master:[60, 70, 80, 90, 110, 120, 100]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.drawCanvas1();
    this.drawCanvas2();
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