// index.js
// 获取应用实例
const app = getApp()
// pages/code/mode.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false, // 控制对话框显示隐藏
    buttons: [{ text: '取消' }, { text: '确定' }],
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
// 在目标页面的 onLoad 方法中获取传递的参数
onLoad() {
  let self = this;
  let storedUserInfo, nickName1;

  wx.getStorage({
    key: 'avatarUrl',
    success: function(res) {
      storedUserInfo = res.data;
      console.log('已存储的用户头像：', storedUserInfo);
      // 在这里使用存储的用户信息进行相关操作
      wx.getStorage({
        key: 'nickName',
        success: function(res) {
          nickName1 = res.data;
          console.log('已存储的用户名称：', nickName1);
          // 在这里使用存储的用户信息进行相关操作
          self.setData({
            "userInfo.avatarUrl": storedUserInfo,
            "userInfo.nickName": nickName1
          });
        },
        fail: function(err) {
          console.error('读取存储失败', err);
        }
      });
    },
    fail: function(err) {
      console.error('读取存储失败', err);
    }
  });
  

},

logout() {
  this.setData({
    isShow: true, // 显示对话框
  });
},

// 确认退出对话框按钮点击事件
confirmLogout(e) {
  const index = e.detail.index; // 获取点击的按钮索引
  console.log(index)
  if (index === 1) { // 如果点击的是确定按钮
    // 执行退出登录操作，比如清除用户信息、跳转登录页等
    wx.removeStorageSync('nickName');
    wx.removeStorageSync('avatarUrl');
    wx.redirectTo({
      url: '/pages/logi/logi',
    })
  }

  this.setData({
    isShow: false, // 关闭对话框
  });
},
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})