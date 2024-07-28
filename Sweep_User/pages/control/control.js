const app=getApp();
Page({
  data: {
    showCanvas: false,
    inputText: '',
    showModal: false,
    receiveText: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    name:'',
    advertisData:'',
    connected: true,
    salt:'',
    lastx:0,
    lasty:0,
    lastgridy:-20,
    lastgridx:-20,
    context:'',
    time1:''
  },

  preventTouchMove: function () {

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
    // dataArray[dataLength - 1] = 13; // 13 是回车字符的ASCII码
  
    // 写入数据到蓝牙设备的特征值，包括数据和回车符
    wx.writeBLECharacteristicValue({
      deviceId: app.data.deviceId,
      serviceId: app.data.serviceId,
      //characteristicId: this.data.characteristics[1].uuid,//BT-04
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
  
  
  Sendforward: function () {
    this.send('1')
  }, 
  Sendback: function () {
    this.send('2')
  },
  Sendleft: function () {
    this.send('3')
  }, 
  Sendright: function () {
    this.send('4')
  },
  Sendset: function () {
    this.send('5')
  },
  Sendju: function () {
    this.send('M 21')
  },
  Sendmoon: function () {
    this.send('6')
  },
  Sendwave: function () {
    this.send('M 22')
  },
  Sendtiptoe: function () {
    this.send('M 14')
  },
  Sendflap: function () {
    this.send('M 12')
  },
  Sendjump: function () {
    this.send('M 11')
  },
  
  onLoad: function (options) {
    let currentTime = new Date().toLocaleString();
    // 设置 time1 为当前时间
    this.setData({
      time1: currentTime
    });

    // 启动定时器，每秒更新一次 time1
    this.data.timer = setInterval(() => {
      this.setData({
        time1: new Date().toLocaleString()
      });
    }, 1000);
    var context1 = wx.createContext()
    this.setData({
      context:context1
    })
    console.log(this.data.context)
    let that=this;
    this.setData({
      name:"小智扫地机",
      connectedDeviceId:app.data.deviceId,
    })
    this.data.connectedDeviceId=app.data.deviceId;
    this.data.serviceId=app.data.serviceId;
    this.data.characteristicId=app.data.characteristicId;
    console.log(this.data.connectedDeviceId);
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: that.data.connectedDeviceId,
              serviceId: app.data.serviceId,
              characteristicId: app.data.characteristicId,
              success: function (res) {
                console.log('启用notify成功')
              }
            })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    }),
    //注册消息之后的回调函数
    //蓝牙设备发送的消息
    wx.onBLECharacteristicValueChange(function (res) {
      
      var receiveText = app.buf2string(res.value)
      if(receiveText.indexOf('salt:')==0)
      {
        that.setData({
          salt: receiveText.substr(5)
        })
      }
      console.log('接收到数据：' + receiveText)
      that.setData({
        receiveText: receiveText
      })
    })
  },

  showDisconnectModal: function () {
    this.setData({
      showModal: true,
    });
  },
  onUnload: function () {
    // 页面卸载时清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },
  confirmDisconnect: function () {
    // 执行断开连接的操作
    wx.closeBLEConnection({
      deviceId: this.data.connectedDeviceId
    })

    // 更新连接状态为已断开
    this.setData({
      connected: false,
      showModal: false, // 关闭弹窗
    });
    wx.redirectTo({
      url: '/index/index?back='+false,
    })
  },

  cancelDisconnect: function () {
    
    this.setData({
      showModal: false,
    });
  },



  
  open(){
    let that=this;
    this.setData({
      showCanvas: true
    });
    console.log(1)
    this.drawGridBackground(this.data.context)
    that.drawtest(0,0,0,0);
    // that.drawline(20,20);
    // that.drawline(22,30);
    // that.drawline(200,250);

    // that.drawline(20,30);
    // that.drawline(100,100);
     wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      if(res.connected==="false")
      {that.setData({
        connected:false
      })}
      else
      {that.setData({
        connected:true
      })}
    })
    
    wx.onBLECharacteristicValueChange(function (res) {
      console.log("读取数据")
      console.log(res)
      console.log(res.value)
      console.log("serviceId:" + res.serviceId)
      console.log("deviceId" + res.deviceId)
      console.log("Length:" + res.value.byteLength)
      // 获取 res.value 中的 ArrayBuffer
      let buffer = res.value;
      // 创建一个 Int32Array
      let int8Array = new Int8Array(buffer);
      // 打印 Int32Array
      let globalx=int8Array[0];
      let globaly=int8Array[1];
      console.log(globalx);
      console.log(globaly);
      that.drawline(globalx,globaly)
      // console.log("hexvalue:" + ab2hex(res.value))
      // let uint8View = new Uint8Array(res.value);
      // let fifthValue = uint8View[5]-48; // 获取第五位的值
      // let sixthValue = uint8View[6]-48; // 获取第六位的值
      // let temp=fifthValue*10+sixthValue;
      // let tenValue = uint8View[10]-48; // 获取第五位的值
      // let elevenValue = uint8View[11]-48; // 获取第六位的值
      // let sidu=tenValue*10+elevenValue;
      // console.log(temp);
      // console.log(sidu);

      
    })
    
     
    
  },

  gotocanvespage: function() {
    this.send('9');
    wx.navigateTo({
      url: '/pages/canvaspage/canvaspage'
    });
  },

  closeCanvas  : function (event) {
    const x = event.detail.x;
    const y = event.detail.y;
    console.log('Clicked point:', { x, y });
    wx.showToast({
      title: `x: ${x}, y: ${y}`,
      icon: 'none'
    });

    this.send('x'+x+'y'+y+'w')
  },


  drawGridBackground: function (context) {
    let that=this;
    context.setStrokeStyle('blue');
    context.setLineWidth(1);
  
    // 画布的宽高
    const canvasWidth = 300;
    const canvasHeight = 300;
    const gridSize = 20;
  
    // 绘制垂直线
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      context.moveTo(x, 0);
      context.lineTo(x, canvasHeight);
    }
  
    // 绘制水平线
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
    }
  
    // 绘制网格
    context.stroke();
    this.data.context.save();
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: that.data.context.getActions()
    })
  },

  drawtest(lastx,lasty,x, y) {
    let that=this
    this.data.context.restore(); // 保存当前上下文状态
    this.data.context.beginPath(0);
    this.data.context.setStrokeStyle('black');
    let movex=x;
    let movey=y;
    let num=Math.floor(x/20)-Math.ceil(lastx/20)
    let k=(y-lasty)/(x-lastx)
    
    if(num>0)
    {
      let xchu=Math.ceil(lastx/20)*20;
      ychu=k*(xchu-x)+y;
      let dischu=Math.abs(Math.floor(ychu/20)-Math.floor(lasty/20));
      let y_minchu=Math.min(Math.floor(ychu/20),Math.floor(lasty/20))
      for(let j=0;j<=dischu;j++)
      {
          let gridX = Math.floor(lastx/20)*20;
          let gridY = (y_minchu+j)*20;
          this.data.context.setFillStyle('green');
          this.data.context.fillRect(gridX , gridY , 20, 20);
      }
      for(let i=0;i<num;i++)
      {
        let x1=(Math.ceil(lastx/20)+i)*20;
        let y1=k*(x1-x)+y;
        let x2=(Math.ceil(lastx/20)+i+1)*20;
        let y2=k*(x2-x)+y;
        let dis=Math.abs(Math.floor(y2/20)-Math.floor(y1/20));
        if(y2%20==0 && y2 !=y1)
        {
          dis=dis-1;
        }
        let y_min=Math.min(Math.floor(y2/20),Math.floor(y1/20))
        for(let j=0;j<=dis;j++)
        {
          console.log("zhong")
          
          let gridX = x1;
          let gridY = (y_min+j)*20;
          console.log(gridX);
          console.log(gridY)
          that.data.context.setFillStyle('green');
          that.data.context.fillRect(gridX , gridY , 20, 20);
        }      
      }
      let xhou=Math.floor(x/20)*20;
      let yhou=k*(xhou-x)+y;
      let dishou=Math.abs(Math.floor(yhou/20)-Math.floor(y/20));
      let y_minhou=Math.min(Math.floor(yhou/20),Math.floor(y/20))
      if(dishou!=0)
      {
      for(let j=0;j<=dishou;j++)
      {
          let gridX = xhou;
          let gridY = (y_minhou+j)*20;
          this.data.context.setFillStyle('green');
          this.data.context.fillRect(gridX , gridY , 20, 20);
      }
    }
    }
    else if(num==0)
    {
      let xchu=Math.ceil(lastx/20)*20;
      ychu=k*(xchu-x)+y;
      let dischu=Math.abs(Math.floor(ychu/20)-Math.floor(lasty/20));
      let y_minchu=Math.min(Math.floor(ychu/20),Math.floor(lasty/20))
      for(let j=0;j<=dischu;j++)
      {
          let gridX = Math.floor(lastx/20)*20;
          let gridY = (y_minchu+j)*20;
          this.data.context.setFillStyle('green');
          this.data.context.fillRect(gridX , gridY , 20, 20);
      }

      let xhou=Math.floor(x/20)*20;
      let yhou=k*(xhou-x)+y;
      let dishou=Math.abs(Math.floor(yhou/20)-Math.floor(y/20));
      let y_minhou=Math.min(Math.floor(yhou/20),Math.floor(y/20))
      for(let j=0;j<=dishou;j++)
      {
          let gridX = xhou;
          let gridY = (y_minhou+j)*20;
          this.data.context.setFillStyle('green');
          this.data.context.fillRect(gridX , gridY , 20, 20);
      }
    }
    else{
      let gridX = Math.floor(x/20)*20;
      let gridY = Math.floor(y/20)*20;
      this.data.context.setFillStyle('green');
      this.data.context.fillRect(gridX , gridY , 20, 20);
    }
   
    
    this.data.context.moveTo(lastx, lasty)   //起始点
    this.data.context.lineTo(movex, movey)     //连接到的坐标点
    this.data.context.stroke()     //沿着绘制的坐标点路径绘制直线

    that.setData({
      lastx:movex,
      lasty:movey,
    })
    this.data.context.save(); // 恢复之前保存的上下文状态
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: that.data.context.getActions()
    })
 
  },

  draw(lastx,lasty,x, y) {
    let that=this
    this.data.context.restore(); // 保存当前上下文状态
    this.data.context.beginPath(0);
    this.data.context.setStrokeStyle('black');
    let movex=x;
    let movey=y;
    let lastgrix=this.data.lastgridx;
    let lastgriy=this.data.lastgridy;
    let dx = x - lastgrix;
    let dy = y - lastgriy;
    let distance = Math.max(Math.abs(dx),Math.abs(dy));
  // 根据距离确定要绘制的方格数量
    let numGrids = Math.ceil(distance / 20);
  // 绘制方格
    //10  110   20  201
    for (let i = 0; i <=numGrids; ++i) {
    let gridX = lastgrix + (Math.ceil(dx*i/numGrids/20)-1)*20;
    let gridY = lastgriy + (Math.ceil(dy*i/numGrids/20)-1)*20;
    this.data.context.setFillStyle('green');
    this.data.context.fillRect(gridX , gridY , 20, 20); // 在当前点绘制 20x20 的绿色方格

    that.setData({
      lastgridx:gridX,
      lastgridy:gridY
    })
    console.log(gridX);
    console.log(gridY);
    
    }
    
    this.data.context.moveTo(lastx, lasty)   //起始点
    this.data.context.lineTo(movex, movey)     //连接到的坐标点
    this.data.context.stroke()     //沿着绘制的坐标点路径绘制直线

    that.setData({
      lastx:movex,
      lasty:movey,
    })
    this.data.context.save(); // 恢复之前保存的上下文状态
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: that.data.context.getActions()
    })
 
  },

  drawline(x, y) {
    let startx=this.data.lastx;
    let starty=this.data.lasty;
    this.drawtest(startx,starty,x,y);

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
