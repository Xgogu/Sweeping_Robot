Page({
  data: {
    cycles: []
  },

  onLoad: function () {
    // 从本地缓存中获取所有周期信息
    let cycles = wx.getStorageSync('cycles') || [];
    // 更新页面数据
    this.setData({
      cycles: cycles
    });
  },

  clearLogs: function () {
    // 清除所有周期日志
    wx.removeStorageSync('cycles');
    // 更新页面数据
    this.setData({
      cycles: []
    });
    wx.showToast({
      title: '日志已清除',
      icon: 'success'
    });
  }
});