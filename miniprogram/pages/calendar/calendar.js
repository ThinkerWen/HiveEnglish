const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    year: 2018,
    month: 12,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    monthArr: [],
    continueDays: 0,
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    signed:[
      {
        year: 2019,
        month: 4,
        day: 24
      },
      {
        year: 2019,
        month: 3,
        day: 20
      }
    ]
  },
  onLoad: function () {
    if(!app.globalData.openId){
      this.setData({
        monthArr: this.monthInit()
      })
    }else{
      this.dataPull()
    }
  },

  dataPush: function(){
    db.collection('userInfo').doc(app.globalData.openId).update({
      data: {
        learnedDays: this.data.monthArr
      }
    })
  },

  dataPull: function(){
    var that = this
    db.collection('userInfo').doc(app.globalData.openId).get({
      success: function(res) {
        var now = new Date()
        var y = now.getFullYear()
        var m = now.getMonth()
        var d = now.getDate()
        var monthArr = res.data.learnedDays

        for(let j of monthArr){
          if(y != j.year) continue;
          if(m != j.month) continue;
          else{
            var k = 0
            while(!(j.dateArr[k].dateNum)) k++
            j.dateArr[k-1+d].status = 2
          }
        }
        var count = 0;
        for(let i of monthArr[0].dateArr){
          if(!i);
          else if(i.status) count ++;
        }
        console.log(monthArr)
        that.setData({
          continueDays: count,
          monthArr: monthArr,
          now_month: m
        })
        that.countDays()
      }
    })
  },

  // 未登录时初始化当前月份列表，无需改动
  monthInit: function(){
    var monthArr = []
    var tempArr = {}
    var dateArr = []
    var now = new Date()
    var y = now.getFullYear()
    var m = now.getMonth()
    var d = now.getDate()
    const getMonthStartDay = (year, month) => new Date(year, month-1,1).getDay()
    const getMonthCountDay = (year, month) => new Date(year, month, 0).getDate()
    var num = getMonthStartDay(y,m+1)
    var dayNUm = getMonthCountDay(y, m+1)
    tempArr.year = y
    tempArr.month = m
    for(let i=0; i<num; i++){
      dateArr.push({})
    }
    for(let i=1; i<=dayNUm; i++){
      dateArr.push({"dateNum": i})
    }
    for(let j=0; j<dateArr.length; j++){
      if(!dateArr[j]) continue;
      else{
        if(dateArr[j].dateNum == d) dateArr[j].status=2
      }
    }
    tempArr.dateArr = dateArr
    monthArr.push(tempArr)
    return monthArr
  },
})