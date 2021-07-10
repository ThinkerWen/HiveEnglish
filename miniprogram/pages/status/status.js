// miniprogram/pages/status/status.js
var wxCharts = require('../../utils/wxcharts.js');
const API = "https://dict.youdao.com/dictvoice?audio="
const db = wx.cloud.database()
const app = getApp()
var lineChart = null;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		continueDays: 0, // 连续学习天数
		totalNum: 0,
		masterNum: 0, // 已掌握单词数
		studingNum: 0, // 正在学单词数
		progress: {
			date: ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"], // 绘制日期
			total: [0, 25, 50, 75, 100, 125, 150], // 绘制单词总数
			master: [0, 0, 0, 0, 0, 0, 0] // 绘制学习单词数
		},
		textcolor1: '#014f8e',
		textcolor2: '#bfbfbf',
	},

	onShow: function() {
		if (!app.globalData.openId) { // 检测是否登录
			this.drawCanvas1(); // 为登录绘制默认数据
			return;
		}
		this.getData(); // 获取用户学习数据
	},
	
	//图表点击事件
	touchcanvas: function(e) {
		lineChart.showToolTip(e, {
			format: function(item, category) {
				console.log(category)
				console.log(item.name)
				console.log(item.data)
				return category + ' ' + item.name + ': ' + item.data
			}
		});
	},
	
	//折线图绘制方法
	OnWxChart: function(x_data, y_data, name) {
		var windowWidth = '',
			windowHeight = ''; //定义宽高
		try {
			var res = wx.getSystemInfoSync(); //试图获取屏幕宽高数据
			windowWidth = res.windowWidth / 750 * 690; //以设计图750为主进行比例算换
			windowHeight = res.windowWidth / 750 * 550 //以设计图750为主进行比例算换
		} catch (e) {
			console.error('getSystemInfoSync failed!'); //如果获取失败
		}
		lineChart = new wxCharts({
			canvasId: 'lineCanvas', //输入wxml中canvas的id
			type: 'line',
			categories: x_data, //模拟的x轴横坐标参数
			animation: true, //是否开启动画
	
			series: [{
				name: name,
				data: y_data,
				format: function(val, name) {
					return val;
				}
			}],
			xAxis: { //是否隐藏x轴分割线
				disableGrid: true,
			},
			yAxis: { //y轴数据
				title: '单词数量', //标题
				format: function(val) { //返回数值
					return val;
				},
				min: 400000.00, //最小值
				gridColor: '#D8D8D8',
			},
			width: windowWidth * 1.1, //图表展示内容宽度
			height: windowHeight, //图表展示内容高度
			dataLabel: false, //是否在图表上直接显示数据
			dataPointShape: true, //是否在图标上显示数据点标志
			extra: {
				lineStyle: 'Broken' //曲线
			},
		});
	},

	// 获取用户学习数据
	getData: function() {
		var that = this
		var progress = {
			master: [],
			total: [],
			date: [],
		}
		var today = new Date() // 获取今日，用于Canvas
		var month = today.getMonth() + 1
		var day = today.getDate()

		db.collection('userInfo').where({
				_id: app.globalData.openId
			})
			.get({
				success: function(res) {
					var count = 0
					var totalCount = 0
					for (let i = 0; i < 7; i++) { // 循环赋值近七天的单词学习量
						count += res.data[0].days[i]
						progress.master.push(count)
					}
					// progress.date = []
					for (let i = 0; i < 7; i++) { // 循环赋值近七天的每日累计单词理论量，默认每日20
						progress.total.push(totalCount)
						totalCount += 25 // 循环计数近七天的单词理论学习总量
					}
					for (let i = 6; i >= 0; i--) { // 循环赋值近七天的日期，今天为最后一天
						progress.date.push(month + "月" + day + "日")
						day--
					}
					progress.date = progress.date.reverse() // 日期逆序
					that.setData({
						continueDays: res.data[0].continueDays,
						progress: progress,
						studingNum: totalCount,
						masterNum: progress.master[6]
					})
					// that.drawCanvas1();
					that.OnWxChart(that.data.progress.date, that.data.progress.master, '学习单词')
				}
			})
	},

	toPhotoTrans: function () {
	    if (!this.loginTest()) return;
	    else {
	      wx.showToast({
	        title: '暂未开放！',
	        icon: 'none',
	        duration: 1000
	      })
	    }
	  },
	
	toVsFriends: function () {
	if (!this.loginTest()) return;
	wx.navigateTo({
	  url: '../fightHome/fightHome',
	})
	},

	toWordGame: function () {
	if (!this.loginTest()) return;
	wx.navigateTo({
	  url: '../game/game',
	})
	},

	loginTest: function () {
	if (!app.globalData.openId) { //未登录跳转登录
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
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
