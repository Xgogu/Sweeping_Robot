const app = getApp()
// pages/shebei/shebei.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peidui:0,
    connect:0,
    disconnect:0,
    start:0,
    end:0,
    goodslist: [
      {
        id: 1,
        name: '台灯',
        status: '商品状态1',
        imageUrl: '/images/light.png', // 图片路径，请替换成实际图片路径
      },
      {
        id: 2,
        name: '台灯',
        status: '商品状态2',
        imageUrl: '/utils/img/lighton.png', // 图片路径，请替换成实际图片路径
      },
    ],
  },
  initgoodlist() {
    let myDeviceList = wx.getStorageSync('myDeviceList') || [];
    let goodslist = [];
    let connect=0;
    let disconnect=0;
    function getDeviceStatus(deviceId, index) {
      return new Promise((resolve, reject) => {
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success: function (res) {
            resolve('在线');
            connect=connect+1;
          },
          fail: function (err) {
            disconnect=disconnect+1;
            resolve('离线'); // 修改为 resolve('离线') 表示离线状态
          }
        });
      });
    }
  
    // function fetchData() {
    //   let promises = myDeviceList.map((item, index) => {
    //     return getDeviceStatus(item.deviceId, index).then(status => {
    //       goodslist.push({
    //         id: index + 1,
    //         name: `台灯${index + 1}`,
    //         status: status,
    //         imageUrl: '/images/light.png',
    //         bleName: item.name,
    //         connectedDeviceId: item.deviceId
    //       });
    //     });
    //   });
  
    //   return Promise.all(promises);
    // }
    function fetchData() {
      let robotCount = 0; // 用于跟踪扫地机器人的数量
    
      let promises = myDeviceList.map((item, index) => {
        return getDeviceStatus(item.deviceId, index).then(status => {
          let name, imageUrl;
    
          if (item.name === 'HC-08') {
            robotCount++; // 每遇到一个扫地机器人，增加计数
            name = `扫地机器人${robotCount}`;
            imageUrl = '/images/robot.png';
          } else {
            name = `台灯${index + 1}`;
            imageUrl = '/images/light.png';
          }
    
          goodslist.push({
            id: index + 1,
            name: name,
            status: status,
            imageUrl: imageUrl,
            bleName: item.name,
            connectedDeviceId: item.deviceId
          });
        });
      });
    
      return Promise.all(promises);
    }
    
  
    fetchData()
      .then(() => {
        // 所有设备状态获取完成后的逻辑
        console.log('goodslist:', goodslist);
  
        // 根据是否有离线状态来决定是否更新数据
        let hasOffline = goodslist.some(item => item.status === '离线');
        if (hasOffline) {
          console.log('有设备离线');
        } else {
          console.log('所有设备在线');
        }
  
        // 将 goodslist 赋值给页面的数据变量（假设页面有个名为 goodslist 的数据变量）
        this.setData({
          goodslist: goodslist,
          peidui:goodslist.length,
          connect:connect,
          disconnect:disconnect
        });
  
        // 输出 goodslist 的长度
        console.log('goodslist 的长度：', goodslist.length);
      })
      .catch(error => {
        console.error('获取设备状态失败:', error);
      });
  },
  
touchstart(e) {
  console.log(e);
  this.start=e.timeStamp;
  let b=e.timeStamp
  this.setData({
    start : b
  })
  
  console.log(b)
},

touchend(e) {
  console.log(e);
  this.end=e.timeStamp;
  let a=e.timeStamp
  this.setData({
    end: a
  })
  console.log(a)
},

  mylongtap(e)
  {
    console.log(e); // 输出: [1, 2, 4, 5]
    let device=e.currentTarget.dataset;
    let connectedDeviceId = e.currentTarget.dataset.connecteddeviceid;
    console.log(connectedDeviceId);
    var that=this;
    wx.showModal({
      title: '设备取消配对申请', //提示的标题
      content: '是否确定删除这个设备', //提示的内容
      success: function(res) {
        if(res.confirm) {
          console.log('用户点击了确定')
          let myDeviceList = wx.getStorageSync('myDeviceList') || [];  
          console.log(myDeviceList); 
          myDeviceList = myDeviceList.filter(item => item.deviceId !== connectedDeviceId); // 删除元素3
          console.log(myDeviceList);
          wx.setStorage({
            key: 'myDeviceList', // 存储的键名
            data: myDeviceList, // 更新后的数据
            success: function(res) {

              console.log('设备信息已添加到本地缓存');
              that.onLoad()
              // 在当前页面的代码中
            //   wx.redirectTo({
            //   url: '/pages/shebei/shebei' // 这里的URL应该替换为你当前页面的实际路径
            // });

            },
            fail: function(err) {
              console.error('存储失败', err);

            }
          });
        } else if (res.cancel) {
          console.log('用户点击了取消')
        }
      }
    })

  },

  searchdetials(e) {
    let c=this.end  - this.start;
    console.log(c)
    if(this.end  - this.start < 350) {
      console.log("点击")
      console.log(e);
    console.log(e.currentTarget);
    let name = e.currentTarget.dataset.name;
    let connectedDeviceId = e.currentTarget.dataset.connecteddeviceid;
    let blename=e.currentTarget.dataset.blename;
    console.log(e.currentTarget.dataset.blename)
    console.log(e.currentTarget.dataset.connecteddeviceid)
    

    if (blename === 'HC-08') {
      // 如果 blename 是 "HC-08"，跳转到其他页面
      wx.navigateTo({
        url: `/pages/sweep/sweep?name=${name}&connectedDeviceId=${connectedDeviceId}`
      });
    } else {
      // 否则，跳转到默认页面
      wx.navigateTo({
        url: `/pages/index/index?name=${name}&connectedDeviceId=${connectedDeviceId}`
      });
    }
    // // 进行页面跳转，并传递参数 name 和 connectedDeviceId
    // wx.navigateTo({
    //   url: `/pages/index/index?name=${name}&connectedDeviceId=${connectedDeviceId}`
    // });
    }
    
  },
  // initgoodlist()
  // {
  //   // 获取本地缓存中的 myDeviceList
  //   wx.getBLEDeviceServices({
  //     deviceId: that.data.connectedDeviceId,
  //     success: function(res) {
  //       // 获取服务列表成功，res 中包含服务列表信息
  //       console.log('获取服务列表成功', res.services);
  //     },
  //     fail: function(err) {
  //       // 获取服务列表失败，err 中包含错误信息
  //       console.error('获取服务列表失败', err);
  //     }
  //   });    
  //   let myDeviceList = wx.getStorageSync('myDeviceList') || [];
  //   // 创建一个新数组 goodslist，用于存储格式化后的设备信息
  //   let goodslist = myDeviceList.map((item, index) => {
  //     return {
  //       id: index + 1, // 使用索引+1作为ID，也可以使用item中的某个唯一标识符
  //       name: `台灯${index + 1}`, // 商品名称
  //       status: '', // 你可以根据实际情况设置状态
  //       imageUrl: '/images/light.png', // 默认图片路径，请替换成实际的默认图片路径
  //       bleName: item.name, // 蓝牙名称，这里使用 deviceId 作为蓝牙名称
  //       connectedDeviceId: item.deviceId // 初始状态下设备未连接，设为空字符串
  //     };
  //   });

  //   // 将 goodslist 赋值给页面的数据变量（假设页面有个名为 goodslist 的数据变量）
  //   this.setData({
  //     goodslist: goodslist
  //   });

  //   // 输出 goodslist 的长度
  //   console.log('goodslist 的长度：', goodslist.length);


  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initgoodlist()
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
  onTabItemTap(item)
  {
    this.onLoad();


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