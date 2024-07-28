// pages/sweep/sweep.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    connectedDeviceId:'',
    name:'',
    sservices: {},
    characteristics: {},
    device_status:'',
    cycles: []
  },

  startCycle: function () {
    let startTime = new Date().toLocaleString();
    let cycles = wx.getStorageSync('cycles') || [];
    cycles.push({ startTime: startTime });
    wx.setStorageSync('cycles', cycles);
    console.log('周期开始时间：', startTime);
  },
  
  endCycle: function () {
    let endTime = new Date().toLocaleString();
    let cycles = wx.getStorageSync('cycles') || [];
    // 获取最后一个周期，并添加结束时间
    if (cycles.length > 0) {
      cycles[cycles.length - 1].endTime = endTime;
      wx.setStorageSync('cycles', cycles);
    }
    console.log('周期结束时间：', endTime);
  },
  
  viewLog:function () {
    wx.navigateTo({
      url: '/pages/log/log?cycles=' + JSON.stringify(this.data.cycles)
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    var that = this ;
    console.log(options) 
    let name = options.name;
    let connectedDeviceId = options.connectedDeviceId;
    app.data.deviceId=connectedDeviceId; 
    wx.createBLEConnection({
      deviceId:app.data.deviceId,
      success: (res) => {
        console.log('BLE 连接成功');}})
    console.log('接收到的 name：', app.data.deviceId);
    console.log('接收到的 connectedDeviceId：', connectedDeviceId);
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
      },
      fail: (res) => {
        console.log(res)
      }
    })
    
      
    // 在页面中使用接收到的数据
    self.setData({
    connectedDeviceId: connectedDeviceId,
    name: name,
    
    });               
  wx.getBLEDeviceServices({
    deviceId: that.data.connectedDeviceId,
    success: function (res) {
      console.log(1)
      console.log(res.services)
      that.setData({
        services: res.services,
        device_status:"在线",
      })
      wx.getBLEDeviceCharacteristics({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[that.data.services.length - 1].uuid,
        success: function (res) {
          //console.log(res.characteristics)
          console.log(2)
          console.log('服务 ' + that.data.services[that.data.services.length - 1].uuid+ ' 的特征列表：', res.characteristics);
          app.data.serviceId=that.data.services[that.data.services.length - 1].uuid;
          app.data.characteristicId=res.characteristics[0].uuid;
          that.setData({
            characteristics: res.characteristics
            
            
          })

          wx.notifyBLECharacteristicValueChange({
            state: true,
            deviceId: that.data.connectedDeviceId,
            serviceId: that.data.services[that.data.services.length - 1].uuid,
            characteristicId: that.data.characteristics[0].uuid,
            success: function (res) {
              console.log('启用notify成功')
            }
          })
        }
      })
    },
    fail:function(error)
    {
      that.setData({
        device_status:"离线",
      })

      console.log(error)
    }
  })           
  wx.onBLEConnectionStateChange(function (res) {
    console.log(res.connected)
    that.setData({
      connected: res.connected
    })
  })
        this.progress1 =this.selectComponent("#progress1");
        this.progress1.getScore();
        this.progress2 =this.selectComponent("#progress2");
        this.progress2.getScore();
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

  },
  yanbian :function()
  {
    this.send('r');
    // wx.navigateTo({
    //   url: '/pages/canvaspage/canvaspage'
    // });
  },
  dingdian :function()
  {
    wx.navigateTo({
      url: '/pages/canvaspage/canvaspage'
    });

  },
  gotocontrol :function () {
    this.send('7')
    wx.navigateTo({
      url: `/pages/control/control`,
    })
  },
  send: function(utf8String) {
    // 构造包含数据和回车符的Uint8Array
    const dataLength = utf8String.length ; // 加1是为了回车符
    const dataArray = new Uint8Array(dataLength);
    
    // 将UTF-8字符串编码为ArrayBuffer
    for (let i = 0; i < utf8String.length; i++) {
      dataArray[i] = utf8String.charCodeAt(i);
    }
    
    // 添加回车符（'\r'）
    //dataArray[dataLength - 1] = 13; // 13 是回车字符的ASCII码
  
    // 写入数据到蓝牙设备的特征值，包括数据和回车符
    wx.writeBLECharacteristicValue({
      //deviceId: this.data.connectedDeviceId,
      //serviceId: this.data.services[this.data.services.length - 1].uuid,
      //characteristicId: this.data.characteristics[0].uuid,
      //value: dataArray.buffer,
      deviceId: app.data.deviceId,
      serviceId: app.data.serviceId,
      characteristicId: app.data.characteristicId,//HC-08
      value: dataArray.buffer,


      
      success: function (res) {
        console.log('发送数据和回车符成功', res);
      },
      fail: function (err) {
        console.error('发送数据和回车符失败', err);
      }
    });
  },



  handleMyEvent1: function(event) {
    console.log("Received myevent1:", event.detail); // 输出触发的事件和传递的参数值
    this.setData({
      pwm:event.detail
    })
    console.log(this.data.pwm)
    var pwmString = JSON.stringify(this.data.pwm);
    this.send("x")
    this.send(pwmString)
  },
  handleMyEvent2: function(event) {
    console.log("Received myevent2:", event.detail); // 输出触发的事件和传递的参数值
    this.setData({
      pwm:event.detail
    })
    console.log(this.data.pwm)
    var pwmString = JSON.stringify(this.data.pwm);
    this.send("w")
    this.send(pwmString)
  },




  auto()
  {
    this.startCycle();
    this.send('6');
  },

  charge()
  {
    this.endCycle()

    this.send('8');

  }
})