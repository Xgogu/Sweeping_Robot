// index.js

// import { ConeShapeEmitter } from "XrFrame/components/emitter";

// 获取应用实例
const app = getApp()

Page({
  data: {
    device_status:"离线",// 显示led是否在线的字符串，默认离线
    device_name:"台灯",
    checked: false,//led的状态。默认led关闭
    checked1:false,
    wendu:"",//温度值，默认为空
    shidu:"",//湿度值，默认为空
    ledicon:"/utils/img/lightoff.png",//显示led图标的状态。默认是关闭状态图标
    inputText: '',
    showModal: false,
    receiveText: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    name:'',
    advertisData:'',
    connected: true,
    showButton: true,
    salt:'',
    pwm:''
  },
  //控制灯的函数1，小滑块点击后执行的函数
  onChange({ detail }){
    //detail是滑块的值，检查是打开还是关闭，并更换正确图标
    this.setData({ 
      checked: detail,
     });
     if(detail == true){//如果是打开操作
      this.setData({ 
        ledicon: "/utils/img/lighton.png",//设置led图片为on
       });
       this.send('ON');
     }else{
      this.setData({ 
        ledicon: "/utils/img/lightoff.png",//设置led图片为off
       });
       this.send('OFF');
     }
  },
  //点击led图片执行的函数
  onChange2(){
    var that = this
      //如果点击前是打开状态，现在更换为关闭状态，并更换图标，完成状态切换
      if( that.data.checked == true){
        this.setData({ 
            ledicon: "/utils/img/lightoff.png",//设置led图片为off
            checked:false //设置led状态为false
         });
      }else{
        that.setData({ 
          ledicon: "/utils/img/lighton.png",//设置led图片为on
          checked:true//设置led状态为true
       });
      }
  },
  connectDevice: function () {
    wx.switchTab({
      url: '/pages/ble/ble',

    })
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

  send: function(utf8String) {
    // 构造包含数据和回车符的Uint8Array
    const dataLength = utf8String.length + 1; // 加1是为了回车符
    const dataArray = new Uint8Array(dataLength);
    
    // 将UTF-8字符串编码为ArrayBuffer
    for (let i = 0; i < utf8String.length; i++) {
      dataArray[i] = utf8String.charCodeAt(i);
    }
    
    // 添加回车符（'\r'）
    dataArray[dataLength - 1] = 13; // 13 是回车字符的ASCII码
  
    // 写入数据到蓝牙设备的特征值，包括数据和回车符
    wx.writeBLECharacteristicValue({
      deviceId: this.data.connectedDeviceId,
      serviceId: this.data.services[this.data.services.length - 1].uuid,
      characteristicId: this.data.characteristics[1].uuid,
      value: dataArray.buffer,
      success: function (res) {
        console.log('发送数据和回车符成功', res);
      },
      fail: function (err) {
        console.error('发送数据和回车符失败', err);
      }
    });
  },

  handleMyEvent: function(event) {
    console.log("Received myevent:", event.detail); // 输出触发的事件和传递的参数值
    this.setData({
      pwm:event.detail
    })
    console.log(this.data.pwm)
    var pwmString = JSON.stringify(this.data.pwm);
    this.send(pwmString)
  },
  // onLoad: function (options) {
  //   let self = this;
  //   let connectedDeviceId, blename;
  //   var that = this  
  //       wx.getStorage({
  //         key: 'connectedDeviceId',
  //         success: function(res) {
  //           connectedDeviceId = res.data;
  //           console.log('已存储的用户头像：', connectedDeviceId);
  //           wx.getStorage({
  //             key: 'blename',
  //             success: function(res) {
  //               blename = res.data;
  //               console.log('已存储的用户名称：', blename);
  //               self.setData({
  //                 "connectedDeviceId": connectedDeviceId,
  //                 "name": blename,
  //                 device_status:"在线",
  //                 showButton:false
  //               });
  //               wx.removeStorage({
  //                 key: 'blename',
  //                 success: function(res) {
  //                   console.log('成功删除 Storage');
  //                 }
  //               });
  //               wx.removeStorage({
  //                 key: 'connectedDeviceId',
  //                 success: function(res) {
  //                   console.log('成功删除 Storage');
  //                 }
  //               });
                
  //               console.log("abc")
  //               wx.getBLEDeviceServices({
  //                 deviceId: that.data.connectedDeviceId,
  //                 success: function (res) {
  //                   console.log(1)
  //                   console.log(res.services)
  //                   that.setData({
  //                     services: res.services
  //                   })
  //                   wx.getBLEDeviceCharacteristics({
  //                     deviceId: that.data.connectedDeviceId,
  //                     serviceId: that.data.services[that.data.services.length - 1].uuid,
  //                     success: function (res) {
  //                       //console.log(res.characteristics)
  //                       console.log(2)
  //                       console.log('服务 ' + that.data.services[that.data.services.length - 1].uuid+ ' 的特征列表：', res.characteristics);
  //                       that.setData({
  //                         characteristics: res.characteristics
                          
  //                       })
            
  //                       wx.notifyBLECharacteristicValueChange({
  //                         state: true,
  //                         deviceId: that.data.connectedDeviceId,
  //                         serviceId: that.data.services[that.data.services.length - 1].uuid,
  //                         characteristicId: that.data.characteristics[0].uuid,
  //                         success: function (res) {
  //                           console.log('启用notify成功')
  //                         }
  //                       })
  //                     }
  //                   })
  //                 }
  //               })
  //               that.open();
            
  //               wx.onBLEConnectionStateChange(function (res) {
  //                 console.log(res.connected)
  //                 that.setData({
  //                   connected: res.connected
  //                 })
  //               })
  //               //注册消息之后的回调函数
  //               //蓝牙设备发送的消息
  //               // wx.onBLECharacteristicValueChange(function (res) {
                  
  //               //   console.log("serviceId:" + res.serviceId)
  //               //   console.log("deviceId" + res.deviceId)
  //               //   console.log("Length:" + res.value.byteLength)
  //               //   var receiveText = app.buf2string(res.value)
  //               //   if(receiveText.indexOf('salt:')==0)
  //               //   {
  //               //     that.setData({
  //               //       salt: receiveText.substr(5)
  //               //     })
  //               //   }
  //               //   console.log('接收到数据：' + receiveText)
  //               //   that.setData({
  //               //     receiveText: receiveText
  //               //   })
  //               // })
  //               console.log("abc")


  //             },
  //             fail: function(err) {
  //               console.error('读取存储失败', err);
  //             }
  //           });
  //         },
  //         fail: function(err) {
  //           console.error('读取存储失败', err);
  //         }
  //       });
  //       this.progress1 =this.selectComponent("#progress1");
  //       this.progress1.getScore();

  // },



  onLoad: function (options) {
    let self = this;
    var that = this ;
    console.log(options) 
    let name = options.name;
    let connectedDeviceId = options.connectedDeviceId;
    console.log('接收到的 name：', name);
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

  },
  showDisconnectModal: function () {
    this.setData({
      showModal: true,
    });
  },

  confirmDisconnect: function () {
    // 执行断开连接的操作
    wx.closeBLEConnection({
      deviceId: this.data.connectedDeviceId
    })

    // 更新连接状态为已断开
    this.setData({
      connected: false,
      device_status:"离线",
      showModal: false, // 关闭弹窗
    });
  },

  cancelDisconnect: function () {
    
    this.setData({
      showModal: false,
    });
  },

  redirectToStatusPage: function () {
    console.log('函数开始执行');
    let that = this;
    const deviceId = this.data.connectedDeviceId;
    if (this.data.device_status === "离线") {
      console.log('设备离线，尝试创建 BLE 连接');
  
      wx.createBLEConnection({
        deviceId,
        success: (res) => {
          console.log('BLE 连接成功');
  
          wx.getBLEDeviceServices({
            deviceId: that.data.connectedDeviceId,
            success: function (res) {
              console.log('获取设备服务成功');
              console.log('服务列表:', res.services);
  
              that.setData({
                services: res.services
              });
  
              wx.getBLEDeviceCharacteristics({
                deviceId: that.data.connectedDeviceId,
                serviceId: that.data.services[that.data.services.length - 1].uuid,
                success: function (res) {
                  console.log('获取设备特征成功');
                  console.log('服务 ' + that.data.services[that.data.services.length - 1].uuid + ' 的特征列表：', res.characteristics);
  
                  that.setData({
                    characteristics: res.characteristics
                  });
  
                  wx.notifyBLECharacteristicValueChange({
                    state: true,
                    deviceId: that.data.connectedDeviceId,
                    serviceId: that.data.services[that.data.services.length - 1].uuid,
                    characteristicId: that.data.characteristics[0].uuid,
                    success: function (res) {
                      console.log('启用 notify 成功');
                      that.setData({
                        device_status: "在线",
                      });
                      console.log("设备在线");
                    },
                    fail: function (err) {
                      console.error('启用 notify 失败', err);
                    }
                  });
                },
                fail: function (err) {
                  console.error('获取设备特征失败', err);
                }
              });
            },
            fail: function (err) {
              console.error('获取设备服务失败', err);
            }
          });
        },
        fail: function (err) {
          console.error('创建 BLE 连接失败', err);
        }
      });
    } else {
      console.log('设备在线，尝试关闭 BLE 连接');
      wx.closeBLEConnection({
        deviceId: this.data.connectedDeviceId,
        success: function () {
          that.setData({
            device_status: "离线",
          });
          console.log("设备离线");
        },
        fail: function (err) {
          console.error('关闭 BLE 连接失败', err);
        }
      });
    }
  },
  
  open({ detail }){
    let that=this;
    this.setData({ 
      checked1: detail,
     });
     wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      if(res.connected==="false")
      {that.setData({
        device_status:"离线"
      })}
      else
      {that.setData({
        device_status:"在线"
      })}
      // wx.reLaunch({
      //   url: '/pages/index/index',
      // })
    })
    wx.onBLECharacteristicValueChange(function (res) {
              
      console.log("serviceId:" + res.serviceId)
      console.log("deviceId" + res.deviceId)
      console.log("Length:" + res.value.byteLength)
      console.log("hexvalue:" + ab2hex(res.value))
      let uint8View = new Uint8Array(res.value);
      let fifthValue = uint8View[5]-48; // 获取第五位的值
      let sixthValue = uint8View[6]-48; // 获取第六位的值
      let temp=fifthValue*10+sixthValue;
      let tenValue = uint8View[10]-48; // 获取第五位的值
      let elevenValue = uint8View[11]-48; // 获取第六位的值
      let sidu=tenValue*10+elevenValue;
      console.log(temp);
      console.log(sidu);
      if(detail == true){//如果是打开操作
        that.setData({ 
          wendu:temp,//温度值，默认为空
          shidu:sidu
         });
       }else{
        that.setData({ 
          wendu:"",//温度值，默认为空
          shidu:""
         });
       }  
    })
    
     
    
  },


})
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',');
  }