//获取应用实例
var angleX = Math.PI / 300
var angleY = Math.PI / 300
var angleZ = Math.PI / 300
var tInt
const app = getApp()
const size = 500
function rpx2px(rpx) {
  var px = rpx / 750 * wx.getSystemInfoSync().windowWidth
  return px
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    words : [
      {
        title: '被子',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '咖啡機',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '飛機',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '电脑',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '手机',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '键盘',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '奶飞机',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '桌子',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '板凳',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '杯子',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '被子',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '咖啡機',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '飛機',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '电脑',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '手机',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1
      },
      {
        title: '键盘',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '奶飞机',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '桌子',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '板凳',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      },
      {
        title: '杯子',
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        o: 1,
      }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.init()
    this.resetAngle()
    wx.startGyroscope()
    wx.onGyroscopeChange((res) => {
      console.log(res)
      angleX += res.x / 30
      angleY += res.y / 30
      angleZ += res.z / 30
    })
  },

  onUnload: function() {
    clearInterval(tInt)
  },

  init: function () {
    var words = this.data.words
    for (var i = 0; i < words.length; i++) {
      words[i].x = size * Math.random() - (size / 2)
      words[i].y = size * Math.random() - (size / 2)
      words[i].z = size * Math.random() - (size / 2)
      words[i].s = (words[i].z + size) / size
    }
    var ctx = wx.createCanvasContext('cloud');
    tInt = setInterval(() => {
      ctx.translate(rpx2px((size / 2 + (750 - size) / 2)), rpx2px((size / 2) + (750 - size) / 2))
      ctx.setFontSize(20)
      //ctx.fillText('center', -ctx.measureText('center').width / 2, 0)
      ctx.fillText('center', 0, 0)
      ctx.moveTo(0, 0)
      ctx.setLineWidth(0.5)
      ctx.setStrokeStyle('grey')
      var cosx = Math.cos(angleX)
      var sinx = Math.sin(angleX)
      var cosy = Math.cos(angleY)
      var siny = Math.sin(angleY)
      var cosz = Math.cos(angleZ)
      var sinz = Math.sin(angleZ)
      for (var i = 0; i < words.length / 2; i++) {

        var y1 = words[i].y * cosx - words[i].z * sinx
        var z1 = words[i].z * cosx + words[i].y * sinx
        words[i].y = y1
        words[i].z = z1

        var x2 = words[i].x * cosy - words[i].z * siny
        var z2 = words[i].z * cosy + words[i].x * siny
        words[i].x = x2
        words[i].z = z2

        var x3 = words[i].x * cosz - words[i].y * sinz
        var y3 = words[i].y * cosz + words[i].x * sinz
        words[i].x = x3
        words[i].y = y3
        words[i].s = (words[i].z + size) / size
        ctx.setFontSize(20 * words[i].s)
        //ctx.fillText(words[i].title, rpx2px(words[i].x) - ctx.measureText(words[i].title).width / 2, rpx2px(words[i].y))
        ctx.fillText(words[i].title, rpx2px(words[i].x), rpx2px(words[i].y))
        ctx.lineTo(rpx2px(words[i].x), rpx2px(words[i].y))
      }
      ctx.stroke()
      ctx.draw()
    }, 30)
  },
  resetAngle: function () {
    angleX = Math.PI / 300
    angleY = Math.PI / 300
    angleZ = Math.PI / 300
  }
})
