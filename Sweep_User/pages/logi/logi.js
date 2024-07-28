// pages/logi/logi.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    flag1:0,
    flag2:0,
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
    handleTap() {
      if (this.data.userInfo.avatarUrl===defaultAvatarUrl ||this.data.userInfo.nickName==='') {
        this.show(); 
         
      } else {
        this.goto();
      }
    },
    show(){
      wx.showModal({
        title: '提示',
        content: '请选择头像和填写昵称',
        showCancel: false, // 不显示取消按钮
        confirmText: '我知道了',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
          }
        }
      })
    },

    goto()
    {
      // wx.navigateTo({
      //   url: `pages/mode/mode?avatarUrl=${this.data.userInfo.avatarUrl}&nickName=${this.data.userInfo.nickName}`
      // });
      wx.switchTab({
        url: '/pages/home/home'
      })
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
      wx.setStorage({
        key: 'avatarUrl', 
        data: avatarUrl, 
        success: function(res) {
          console.log('存储成功');
          console.log(avatarUrl);
        },
        fail: function(err) {
          console.error('存储失败', err);
        }
      });
    },
    onInputChange(e) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
      wx.setStorage({
        key: 'nickName', 
        data: nickName, 
        success: function(res) {
          console.log('存储成功');
          console.log(nickName);
        },
        fail: function(err) {
          console.error('存储失败', err);
        }
      });
    },

    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorage({
            key: 'userInfo', // 设置存储的 key
            data: res.userInfo, // 要存储的数据
            success: function(res) {
              console.log('存储成功');
              console.log(res.userInfo);
            },
            fail: function(err) {
              console.error('存储失败', err);
            }
          });
        }
      })
    },
  init()
  {
    this.setData({
      "userInfo.avatarUrl": defaultAvatarUrl,
      "userInfo.nickName":'',
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("初始化")
    this.init()
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