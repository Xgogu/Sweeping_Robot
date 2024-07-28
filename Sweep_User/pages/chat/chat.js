const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

let socketOpen = false;
let socketMsgQueue = [];
let lineCount = Math.floor(windowWidth / 16) - 6;
let curAnsCount = 0;
/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';
  msgList = [{
    speaker: 'server',
    contentType: 'text',
    content: '你好，我是精洗助手，请输入衣物种类，我来为你配置机器参数。'
  }, 

]
  that.setData({
    msgList,
    inputVal
  })
}

function sendSocketMessage(msg) {
  if (socketOpen) {
    wx.sendSocketMessage({
      data: msg
    })
  } else {
    socketMsgQueue.push(msg)
  }
}



Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initData(this);
    let self = this;
    let storedUserInfo;
    wx.getStorage({
      key: 'avatarUrl',
      success: function(res) {
        storedUserInfo = res.data;
        console.log('已存储的用户头像：', storedUserInfo);
            self.setData({
              cusHeadIcon: storedUserInfo,
            });
          },
         
    });

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
//   msgList[msgList.length - 1].content = msgList[msgList.length - 1].content + 'abcd'
// this.setData({
//   msgList
// })
  },
  onHide: function () {
    wx.closeSocket()
    wx.onSocketClose((result) => {
      console.log("socket关闭成功");
      wx.showToast({
        icon: 'none',
        title: '会话关闭成功',
        duration: 500
      })
    })
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
   * 获取聚焦
   */
  focus: function (e) {
    let res = wx.getSystemInfoSync()
    let navBarHeight = res.statusBarHeight + 44 //顶部状态栏+顶部导航，大部分机型默认44px
    keyHeight = e.detail.height - navBarHeight;
    if (keyHeight < 0) {
      keyHeight = 0
    }
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: (keyHeight) + 'px'
    })
  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    sendSocketMessage(e.detail.value)
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    // Generate random parameters
    let waterTemperature = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
    let dryingTemperature = Math.floor(Math.random() * (80 - (waterTemperature + 1) + 1)) + (waterTemperature + 1);
    let flowRate = (Math.random() * (0.8 - 0.2) + 0.2).toFixed(2);
    let time = (36 / flowRate).toFixed(2);
    

// Combine parameters into text
    let content = `- 水温: ${waterTemperature}°C\n- 流速: ${flowRate} L/min\n- 烘温: ${dryingTemperature}°C\n- 时间: ${time} s`;

console.log(content);

    msgList.push({
      speaker: 'server',
      contentType: 'text',
      content: content
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})