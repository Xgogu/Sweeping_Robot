#include "sys.h"
#include "delay.h"
#include "usart.h"
#include "led.h"
#include "includes.h"
#include "key.h"
#include "beep.h"
#include "pwm.h"
#include "tb6612.h"
#include "usartx.h"
#include "auto.h"
#include "adc.h"
#include "encoder.h"
#include "simulate.h"


/////////////////////////UCOSII任务堆栈设置///////////////////////////////////
//START 任务
//设置任务优先级
#define START_TASK_PRIO      			10 //开始任务的优先级设置为最低
//设置任务堆栈大小
#define START_STK_SIZE  				64
//创建任务堆栈空间	
OS_STK START_TASK_STK[START_STK_SIZE];
//任务函数接口
void start_task(void *pdata);	
 			   
//串口发送任务
//设置任务优先级
#define SEND_TASK_PRIO       			6 
//设置任务堆栈大小
#define SEND_STK_SIZE  					64
//创建任务堆栈空间	
OS_STK SEND_TASK_STK[SEND_STK_SIZE];
//任务函数接口
void send_task(void *pdata);


//自动清扫任务
//设置任务优先级
#define AUTO_TASK_PRIO       			5 
//设置任务堆栈大小
#define AUTO_STK_SIZE  					256
//创建任务堆栈空间	
OS_STK AUTO_TASK_STK[AUTO_STK_SIZE];
//任务函数接口
void auto_task(void *pdata);


//传感器（红外及碰撞开关）任务
//设置任务优先级
#define CHECK_TASK_PRIO       		  4
//设置任务堆栈大小
#define CHECK_STK_SIZE  					256
//创建任务堆栈空间	
OS_STK CHECK_TASK_STK[CHECK_STK_SIZE];
//任务函数接口
void check_task(void *pdata);

//数据接收任务
//设置任务优先级
#define REC_TASK_PRIO       			3 
//设置任务堆栈大小
#define REC_STK_SIZE  					256
//创建任务堆栈空间	
OS_STK REC_TASK_STK[REC_STK_SIZE];
//任务函数接口
void rec_task(void *pdata);


//定点清扫任务
//设置任务优先级
#define GO_TASK_PRIO       			7 
//设置任务堆栈大小
#define GO_STK_SIZE  					256
//创建任务堆栈空间	
OS_STK GO_TASK_STK[GO_STK_SIZE];
//任务函数接口
void go_task(void *pdata);

//语音处理任务
//设置任务优先级
#define YUYIN_TASK_PRIO       			8
//设置任务堆栈大小
#define YUYIN_STK_SIZE  					256
//创建任务堆栈空间	
OS_STK YUYIN_TASK_STK[YUYIN_STK_SIZE];
//任务函数接口
void yuyin_task(void *pdata);


int main(void)
{ 
	delay_init(168);		  //初始化延时函数
	uart_init(115200); //串口1初始化
	Gpio_Init();    //电机对应信号IO口初始化
	uart3_init(115200);  //串口3初始化
	uart2_init(9600);     //串口2初始化
	TIM1_PWM_Init(100-1,120-1);	 //电机pwm初始化
	GPIO_ADC_Init();    //ADC对应io口初始化
  DMA_Config();      //ADC DMA通道打开
  ADC_Config();				//ADC初始化配置
  Encoder_Init_TIM2();  //左轮编码器初始化
	Encoder_Init_TIM5();  //右轮编码器初始化
	TIM14_Int_Init(10000-1,42-1);   //编码器数据读取及结算
	OSInit();  	 			//初始化UCOSII		 			  
 	OSTaskCreate(start_task,(void *)0,(OS_STK *)&START_TASK_STK[START_STK_SIZE-1],START_TASK_PRIO );//创建起始任务
	OSStart();	

}

//开始任务
void start_task(void *pdata)
{
    OS_CPU_SR cpu_sr=0;
	pdata = pdata; 		  		 			  
	OSStatInit();					//初始化统计任务.这里会延时1秒钟左右	
 	OS_ENTER_CRITICAL();			//进入临界区(无法被中断打断)    
	OSTaskCreate(send_task,(void *)0,(OS_STK*)&SEND_TASK_STK[SEND_STK_SIZE-1],SEND_TASK_PRIO); //数据发送任务
 	OSTaskCreate(auto_task,(void *)0,(OS_STK*)&AUTO_TASK_STK[AUTO_STK_SIZE-1],AUTO_TASK_PRIO); //自动回字形清扫任务
	OSTaskCreate(rec_task,(void *)0,(OS_STK*)&REC_TASK_STK[REC_STK_SIZE-1],REC_TASK_PRIO); //蓝牙数据处理任务
	OSTaskCreate(check_task,(void *)0,(OS_STK*)&CHECK_TASK_STK[CHECK_STK_SIZE-1],CHECK_TASK_PRIO); //外部传感器读取任务
	OSTaskCreate(go_task,(void *)0,(OS_STK*)&GO_TASK_STK[GO_STK_SIZE-1],GO_TASK_PRIO); //定点清扫任务
	OSTaskCreate(yuyin_task,(void *)0,(OS_STK*)&YUYIN_TASK_STK[YUYIN_STK_SIZE-1],YUYIN_TASK_PRIO); //语音数据处理任务			   	
 	OSTaskSuspend(START_TASK_PRIO);	//挂起起始任务.
	OSTaskSuspend(AUTO_TASK_PRIO);
	OSTaskSuspend(GO_TASK_PRIO);
	OS_EXIT_CRITICAL();				//退出临界区(可以被中断打断)
}	  
  

//串口发送任务
void send_task(void *pdata)
{
	while(1)
	{
		usart3_send(x_tran);
		usart3_send(y_tran);
		delay_ms(100);
	}
}


//自动清扫任务（回字形清扫）
void auto_task(void *pdata)
{
	while(1)
	{
		walkbyhui();
		delay_ms(100);
	}

}

//语音数据接收任务
void yuyin_task(void *pdata)
{
	while(1)
	{
		switch (Yuyin)
		 {
			case 0x03: //自动清扫
				OSTaskResume(AUTO_TASK_PRIO);
				break;
			case 0x04: 
				OSTaskSuspend(AUTO_TASK_PRIO);
				motor_stop();
				break;
			case 0x08: //回仓充电
				OSTaskSuspend(AUTO_TASK_PRIO);
				xtarget=0;
				ytarget=0;
				OSTaskResume(GO_TASK_PRIO);
				break;
			case 0x06: //开启沿边
				OSTaskSuspend(AUTO_TASK_PRIO);
				yanbian();
				break;
			case 0x07:
				motor_stop();
				break;				
		 }
		delay_ms(100);
	}

}

//蓝牙数据接收任务
void rec_task(void *pdata)
{
	while(1)
	{
		switch (Adjust_res)
		 {
			case 0x31: //前进
				motor_forward(speedtest);
				break;
			case 0x32: //后退
				motor_back(speedtest);
				break;
			case 0x33: //左转
				motor_left(speedtest);
				break;
			case 0x35:  //停止
				motor_stop();
				break;
			case 0x34: //右转
				motor_right(speedtest);
				break;
			case 0x36: //自动清扫（回字形清扫）
				OSTaskResume(AUTO_TASK_PRIO);
				break;
			case 0x37:  //手动控制
				OSTaskSuspend(AUTO_TASK_PRIO);
				break;
			case 0x38: //回仓充电
				OSTaskSuspend(AUTO_TASK_PRIO);
				xtarget=0;
				ytarget=0;
				OSTaskResume(GO_TASK_PRIO);
				break;
			case 0x39:  //自动清扫（随机碰撞清扫）
				OSTaskSuspend(AUTO_TASK_PRIO);
				autotest(); 
				break;
			case 0x72: //R 开启沿边
				OSTaskSuspend(AUTO_TASK_PRIO);
				yanbian();
				break;
			case 0x55:  //定点清扫
				OSTaskSuspend(AUTO_TASK_PRIO);
				OSTaskResume(GO_TASK_PRIO);
				break;
		 }
		delay_ms(100);
	}
}


//定点清扫任务
void go_task(void *pdata)
{
	while(1)
	{
		posgo();
		delay_ms(10);
		if(bias==0)
		{
		goready=0;
		Adjust_res=0;}
		else
		{
		Adjust_res=0x55;
		bias=0;
		}
		OSTaskSuspend(GO_TASK_PRIO);
	}
}

//传感器数据获取任务
void check_task(void *pdata)
{
	while(1)
	{
	a1=ADC_ConvertedValue[7]/100;//左2
	a2=ADC_ConvertedValue[8]/100;//左1
	a3=ADC_ConvertedValue[3]/100;//右1
	a4=ADC_ConvertedValue[6]/100;//右2
	PD12=GPIO_ReadInputDataBit(GPIOD, GPIO_Pin_12);
	PC14=GPIO_ReadInputDataBit(GPIOC, GPIO_Pin_14);
	delay_ms(100);
	}

}




