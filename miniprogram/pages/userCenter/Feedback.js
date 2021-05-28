const MY_API = 'https://www.hive-net.cn:8443/wechat/suggest/'
const app = getApp()
Page({
  data: {
    email: '',          // 反馈邮箱
    content: '',        // 反馈内容
    src: "",            // 反馈图片路径
    isSrc: false,       // 反馈图片是否存在
    isLoading: false,   // 提交按钮是否加载
    isdisabled: false   // 提交按钮是否可点击提交
  },
  onLoad: function () {
  },
  onReady: function () {
  },
  onShow:function(){
  },

  //上传图片
  uploadPic: function () {
    if(!this.loginTest()) return;
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
    if(!this.loginTest()) return;
    var that = this
    var email = e.detail.value.email;     // 反馈邮箱
    var content = e.detail.value.content; // 反馈内容
    //先进行表单非空验证
    if (email == "") {
      that.showWarning("请输入您的邮箱")
    } else if (content == "") {
      that.showWarning("请输入反馈内容")
    } else {                // 表单不为空
      that.setData({        // 按钮不可点击，加载转圈
        isLoading: true,
        isdisabled: true
      })
      wx.request({          // 发送邮件到后台
        url: MY_API,
        method: 'POST',
        data: {
          mail: email,
          name: "微信小程序反馈",
          text: content
        },
        success: res => {
          if (res.statusCode === 200) {   //发送成功
            setTimeout(function () {}, 1500);     // 按键不缓冲，设置可用
            that.setData({
              isLoading: false,
              isdisabled: false
            })
            that.showWarning("您的反馈已提交，感谢您的支持!")
            setTimeout(function () {              // 等待1.5秒返回上一页
              wx.navigateBack({
                delta: 1,
              })
            }, 1500);
            if(!res.data){                  // 后端返回false
              wx.showToast({
                title: '错误，请联系管理员',
                icon: 'none',
                duration: 1000
              });
              return;
            }
          } else{                           // 返回状态码不是200
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
  
  showWarning: function(title){     // 提示弹窗，传入title为提示内容
    wx.showToast({
       title: title,
       icon: 'none',
       duration: 500
    })
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
  }
});