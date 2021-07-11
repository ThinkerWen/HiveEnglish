// miniprogram/pages/main/main.js
var utils = require("../../utils/utils");
const db = wx.cloud.database()
const API = "https://dict.youdao.com/dictvoice?audio="
var that
var pushuserLearned = {
	bookId: '',
	learnedSequence: 20,
	newWord: [],
	reviewWord: []
};

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isOver: false,
		myData: {},
		wordInfo: {},
		wordSequence: 0,
		myWordList: [],
		pattern: 0,
		isUnknown: false,
		isReviewing: true,
		isChinese: false,
		list: [{
			name: 'fade',
			color: 'green',
			text: '想起来了'
		  },
		  {
			name: 'shake',
			color: 'red',
			text: '没想起来'
		  }
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;
		var date = new Date()
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on('acceptDataFromOpenerPage', function (data) {
			console.log(data)
			that.setData({
				doc_id: data._id,
				bookId: data.bookId,
				openId: data._openid,
				remainPercent: that.mathPercent(data.reviewWord.length, data.newWord.length)
			})
			if (!that.getProgress()) {
				that.getWords(data);
			}
		})
	},

	onUnload: function () {
		this.saveProgress();
	},
	
	toggle(e) {
		console.log(e);
		var anmiaton = e.currentTarget.dataset.class;
		var that = this;
		if (e.currentTarget.dataset.class == 'fade')
			this.knownHandle();
		else if (e.currentTarget.dataset.class == 'shake')
			this.unknownHandle();
		that.setData({
			animation: anmiaton
		})
		setTimeout(function () {
			that.setData({
				animation: ''
			})
		}, 1000)
	},

	getWords: function (data) {
		console.log("getWords")
		var learnedInfo = {}
		pushuserLearned.bookId = data.bookId; // 书籍id
		pushuserLearned.newWord = data.newWord; // 新单词
		pushuserLearned.learnedSequence = data.learnedSequence; // 已学单词序列
		var myWordList = data.reviewWord.concat(data.newWord)

		that.setData({
			myWordList: myWordList,
			wordInfo: myWordList[that.data.wordSequence]
		})
	},

	mathPercent: function (learn, all) {
		return Math.round(learn / all * 100)
	},

	atLarge: function () {
		that = this
		console.log(this.data.bookId + '_all')
		console.log(that.data.wordInfo.wordHead)
		db.collection(this.data.bookId + '_all').where({
				headWord: that.data.wordInfo.wordHead
			})
			.get({
				success: function (res) {
					that.setData({
						wordInfo: res.data[0]
					})
					console.log(res.data)
				}
			})
	},

	saveProgress: function () {
		var that = this
		console.log(this.data.doc_id)
		db.collection('userLearned').doc(that.data.doc_id).update({
			data: pushuserLearned,
			success: function (res) {
				console.log(res.data)
			}
		})
		wx.setStorageSync('isOver', that.data.isOver);
		wx.setStorageSync('pushuserLearned', pushuserLearned);
		wx.setStorageSync('myWordList', that.data.myWordList);
		wx.setStorageSync('wordSequence', that.data.wordSequence);
	},

	getProgress: function () {
		console.log("pro")
		var myWordList = wx.getStorageSync('myWordList');
		var wordSequence = wx.getStorageSync('wordSequence');
		if (myWordList) {
			pushuserLearned = wx.getStorageSync('pushuserLearned')
			this.setData({
				remainPercent: that.mathPercent(pushuserLearned.reviewWord.length, pushuserLearned.newWord.length + pushuserLearned.reviewWord.length),
				myWordList: myWordList,
				wordSequence: wordSequence,
				wordInfo: myWordList[wordSequence],
				isOver: wx.getStorageSync('isOver', that.data.isOver)
			})
			return true
		}
		return false
	},

	pronounce: function (e) {
		console.log(e)
		const innerAudioContext = wx.createInnerAudioContext()
		innerAudioContext.autoplay = true
		innerAudioContext.src = API + e.currentTarget.dataset.word
		innerAudioContext.onPlay(() => {
			console.log('开始播放')
		})
		innerAudioContext.onError((res) => {
			console.log(res.errMsg)
			console.log(res.errCode)
		})
	},

	changePattern: function () {
		var pattern = that.data.pattern;
		if (pattern == 0) {
			that.setData({
				pattern: 1
			})
		} else {
			that.setData({
				pattern: 0
			})
		}
	},

	formatData: function (data) {
		var myProgress = []
		var tempProgress = {}
		var tempData = data
		var easyWords = []
		tempProgress.type = 0
		tempProgress.complete = 0
		tempProgress.studiedWords = data.reviewWord
		for (let i = 0; i < data.reviewWord.length; i++) {
			if (data.reviewWord[i].simple) {
				easyWords.push(data.reviewWord[i])
			}
		}
		tempProgress.easyWords = easyWords
		myProgress.push(tempProgress)
		var tempProgress = {}
		tempProgress.type = 1
		tempProgress.complete = 0
		tempProgress.studingWords = data.newWord
		for (let i = 0; i < data.reviewWord.length; i++) {
			if (data.newWord[i].simple) {
				easyWords.push(data.reviewWord[i])
			}
		}
		tempProgress.easyWords = easyWords
		myProgress.push(tempProgress)
		return myProgress
	},

	knownHandle: function () {
		console.log(pushuserLearned)
		console.log(this.data.wordSequence)
		console.log(this.data.wordInfo)
		if ((this.data.wordSequence < this.data.myWordList.length) && !this.data.isOver) {
			// 增加进度条
			this.setData({
				remainPercent: that.mathPercent(pushuserLearned.reviewWord.length + 1, pushuserLearned.newWord.length + pushuserLearned.reviewWord.length)
			})

			if (this.data.wordSequence != this.data.myWordList.length - 1)
				this.setData({
					wordInfo: that.data.myWordList[that.data.wordSequence + 1],
					wordSequence: that.data.wordSequence + 1
				})
			else this.setData({
				isOver: true
			})

			// 改变准备上传数据
			pushuserLearned.learnedSequence = pushuserLearned.learnedSequence + 1
			pushuserLearned.reviewWord.push(pushuserLearned.newWord.shift())
		} else {
			// 已经学完了
			this.setData({
				wordInfo: that.data.myWordList[that.data.wordSequence]
			})
			wx.showToast({
				title: '已经学完了今天的任务！',
				icon: 'none',
				duration: 1500,
			})
		}
		// 如果是从两次不知道页面点击的下一个，改变布尔值
		if (that.data.isUnknown) {
			that.setData({
				isUnknown: false,
				isReviewing: true
			})
		}
		// this.changePattern();
	},

	unknownHandle: function (e) {
		if (!that.data.isReviewing && that.data.isUnknown) { // 不知道且已经点击了两次
			this.atLarge(); // 获取详细数据
			this.changePattern(); // 改变页面
		} else { // 第一次点击不知道
			that.setData({
				isUnknown: true,
				isReviewing: false
			})
		}
	},

	nextHandle: function (e) {
		this.setData({
			pattern: 0
		})
		this.knownHandle()

		// that.updateWordInfo()
		// that.changePattern()
		// that.updateTopBar()
	},

	chineseSwitchChange: function (e) {
		this.setData({
			isChinese: !this.data.isChinese
		})
	}
})