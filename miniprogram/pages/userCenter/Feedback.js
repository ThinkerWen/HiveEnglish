const MY_API = 'https://www.hive-net.cn:8443/wechat/suggest/'
const app = getApp()
Page({
  data: {
    list_remind: '加载中',
    status: false,  //是否显示列表
    itemopen:false,
    feednum: 0, //反馈的次数
    hasFeed: false,
    email: '',
    content: '',
    info: '',
    showTopTips: false,
    TopTips: '',
  },
  onLoad: function () {
    if(!app.globalData.openId){
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
    var that = this;
    that.setData({//初始化数据
      src: "",
      isSrc: false,
      ishide: "0",
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false
    })
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
  },
  onShow:function(){
    console.log("调用onShow")
  },
  //获取评论信息

  //上传图片
  uploadPic: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '上传图片需要消耗流量，是否继续？',
      confirmText: '继续',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              that.setData({
                isSrc: true,
                src: tempFilePaths
              })
            }
          })
        }
      }
    });
  },

  
  //提交表单
  submitForm: function (e) {
    var that = this
    var email = e.detail.value.email;
    var content = e.detail.value.content;
    //先进行表单非空验证
    if (email == "") {
      that.showWarning("请输入您的邮箱")
    } else if (content == "") {
      that.showWarning("请输入反馈内容")
    } else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      wx.request({
        url: MY_API,
        method: 'POST',
        data: {
          mail: email,
          name: "微信小程序反馈",
          text: content
        },
        success: res => {
          if (res.statusCode === 200) {
            setTimeout(function () {}, 1500);
            that.setData({
              isLoading: false,
              isdisabled: false
            })
            that.showWarning("您的反馈已提交，感谢您的支持!")
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500);
            if(!res.data){
              wx.showToast({
                title: '错误，请联系管理员',
                icon: 'none',
                duration: 1000
              });
              return;
            }
          } else{
            wx.showToast({
              title: '错误，请联系管理员',
              icon: 'none',
              duration: 1000
            });
            console.error('错误，请联系管理员');
          }
        },
      })
    }
  },
  
  showWarning: function(title){
    wx.showToast({
       title: title,
       icon: 'none',
       duration: 500
    })
  }

});