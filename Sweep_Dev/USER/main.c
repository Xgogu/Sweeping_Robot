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


/////////////////////////UCOSII�����ջ����///////////////////////////////////
//START ����
//�����������ȼ�
#define START_TASK_PRIO      			10 //��ʼ��������ȼ�����Ϊ���
//���������ջ��С
#define START_STK_SIZE  				64
//���������ջ�ռ�	
OS_STK START_TASK_STK[START_STK_SIZE];
//�������ӿ�
void start_task(void *pdata);	
 			   
//���ڷ�������
//�����������ȼ�
#define SEND_TASK_PRIO       			6 
//���������ջ��С
#define SEND_STK_SIZE  					64
//���������ջ�ռ�	
OS_STK SEND_TASK_STK[SEND_STK_SIZE];
//�������ӿ�
void send_task(void *pdata);


//�Զ���ɨ����
//�����������ȼ�
#define AUTO_TASK_PRIO       			5 
//���������ջ��С
#define AUTO_STK_SIZE  					256
//���������ջ�ռ�	
OS_STK AUTO_TASK_STK[AUTO_STK_SIZE];
//�������ӿ�
void auto_task(void *pdata);


//�����������⼰��ײ���أ�����
//�����������ȼ�
#define CHECK_TASK_PRIO       		  4
//���������ջ��С
#define CHECK_STK_SIZE  					256
//���������ջ�ռ�	
OS_STK CHECK_TASK_STK[CHECK_STK_SIZE];
//�������ӿ�
void check_task(void *pdata);

//���ݽ�������
//�����������ȼ�
#define REC_TASK_PRIO       			3 
//���������ջ��С
#define REC_STK_SIZE  					256
//���������ջ�ռ�	
OS_STK REC_TASK_STK[REC_STK_SIZE];
//�������ӿ�
void rec_task(void *pdata);


//������ɨ����
//�����������ȼ�
#define GO_TASK_PRIO       			7 
//���������ջ��С
#define GO_STK_SIZE  					256
//���������ջ�ռ�	
OS_STK GO_TASK_STK[GO_STK_SIZE];
//�������ӿ�
void go_task(void *pdata);

//������������
//�����������ȼ�
#define YUYIN_TASK_PRIO       			8
//���������ջ��С
#define YUYIN_STK_SIZE  					256
//���������ջ�ռ�	
OS_STK YUYIN_TASK_STK[YUYIN_STK_SIZE];
//�������ӿ�
void yuyin_task(void *pdata);


int main(void)
{ 
	delay_init(168);		  //��ʼ����ʱ����
	uart_init(115200); //����1��ʼ��
	Gpio_Init();    //�����Ӧ�ź�IO�ڳ�ʼ��
	uart3_init(115200);  //����3��ʼ��
	uart2_init(9600);     //����2��ʼ��
	TIM1_PWM_Init(100-1,120-1);	 //���pwm��ʼ��
	GPIO_ADC_Init();    //ADC��Ӧio�ڳ�ʼ��
  DMA_Config();      //ADC DMAͨ����
  ADC_Config();				//ADC��ʼ������
  Encoder_Init_TIM2();  //���ֱ�������ʼ��
	Encoder_Init_TIM5();  //���ֱ�������ʼ��
	TIM14_Int_Init(10000-1,42-1);   //���������ݶ�ȡ������
	OSInit();  	 			//��ʼ��UCOSII		 			  
 	OSTaskCreate(start_task,(void *)0,(OS_STK *)&START_TASK_STK[START_STK_SIZE-1],START_TASK_PRIO );//������ʼ����
	OSStart();	

}

//��ʼ����
void start_task(void *pdata)
{
    OS_CPU_SR cpu_sr=0;
	pdata = pdata; 		  		 			  
	OSStatInit();					//��ʼ��ͳ������.�������ʱ1��������	
 	OS_ENTER_CRITICAL();			//�����ٽ���(�޷����жϴ��)    
	OSTaskCreate(send_task,(void *)0,(OS_STK*)&SEND_TASK_STK[SEND_STK_SIZE-1],SEND_TASK_PRIO); //���ݷ�������
 	OSTaskCreate(auto_task,(void *)0,(OS_STK*)&AUTO_TASK_STK[AUTO_STK_SIZE-1],AUTO_TASK_PRIO); //�Զ���������ɨ����
	OSTaskCreate(rec_task,(void *)0,(OS_STK*)&REC_TASK_STK[REC_STK_SIZE-1],REC_TASK_PRIO); //�������ݴ�������
	OSTaskCreate(check_task,(void *)0,(OS_STK*)&CHECK_TASK_STK[CHECK_STK_SIZE-1],CHECK_TASK_PRIO); //�ⲿ��������ȡ����
	OSTaskCreate(go_task,(void *)0,(OS_STK*)&GO_TASK_STK[GO_STK_SIZE-1],GO_TASK_PRIO); //������ɨ����
	OSTaskCreate(yuyin_task,(void *)0,(OS_STK*)&YUYIN_TASK_STK[YUYIN_STK_SIZE-1],YUYIN_TASK_PRIO); //�������ݴ�������			   	
 	OSTaskSuspend(START_TASK_PRIO);	//������ʼ����.
	OSTaskSuspend(AUTO_TASK_PRIO);
	OSTaskSuspend(GO_TASK_PRIO);
	OS_EXIT_CRITICAL();				//�˳��ٽ���(���Ա��жϴ��)
}	  
  

//���ڷ�������
void send_task(void *pdata)
{
	while(1)
	{
		usart3_send(x_tran);
		usart3_send(y_tran);
		delay_ms(100);
	}
}


//�Զ���ɨ���񣨻�������ɨ��
void auto_task(void *pdata)
{
	while(1)
	{
		walkbyhui();
		delay_ms(100);
	}

}

//�������ݽ�������
void yuyin_task(void *pdata)
{
	while(1)
	{
		switch (Yuyin)
		 {
			case 0x03: //�Զ���ɨ
				OSTaskResume(AUTO_TASK_PRIO);
				break;
			case 0x04: 
				OSTaskSuspend(AUTO_TASK_PRIO);
				motor_stop();
				break;
			case 0x08: //�زֳ��
				OSTaskSuspend(AUTO_TASK_PRIO);
				xtarget=0;
				ytarget=0;
				OSTaskResume(GO_TASK_PRIO);
				break;
			case 0x06: //�����ر�
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

//�������ݽ�������
void rec_task(void *pdata)
{
	while(1)
	{
		switch (Adjust_res)
		 {
			case 0x31: //ǰ��
				motor_forward(speedtest);
				break;
			case 0x32: //����
				motor_back(speedtest);
				break;
			case 0x33: //��ת
				motor_left(speedtest);
				break;
			case 0x35:  //ֹͣ
				motor_stop();
				break;
			case 0x34: //��ת
				motor_right(speedtest);
				break;
			case 0x36: //�Զ���ɨ����������ɨ��
				OSTaskResume(AUTO_TASK_PRIO);
				break;
			case 0x37:  //�ֶ�����
				OSTaskSuspend(AUTO_TASK_PRIO);
				break;
			case 0x38: //�زֳ��
				OSTaskSuspend(AUTO_TASK_PRIO);
				xtarget=0;
				ytarget=0;
				OSTaskResume(GO_TASK_PRIO);
				break;
			case 0x39:  //�Զ���ɨ�������ײ��ɨ��
				OSTaskSuspend(AUTO_TASK_PRIO);
				autotest(); 
				break;
			case 0x72: //R �����ر�
				OSTaskSuspend(AUTO_TASK_PRIO);
				yanbian();
				break;
			case 0x55:  //������ɨ
				OSTaskSuspend(AUTO_TASK_PRIO);
				OSTaskResume(GO_TASK_PRIO);
				break;
		 }
		delay_ms(100);
	}
}


//������ɨ����
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

//���������ݻ�ȡ����
void check_task(void *pdata)
{
	while(1)
	{
	a1=ADC_ConvertedValue[7]/100;//��2
	a2=ADC_ConvertedValue[8]/100;//��1
	a3=ADC_ConvertedValue[3]/100;//��1
	a4=ADC_ConvertedValue[6]/100;//��2
	PD12=GPIO_ReadInputDataBit(GPIOD, GPIO_Pin_12);
	PC14=GPIO_ReadInputDataBit(GPIOC, GPIO_Pin_14);
	delay_ms(100);
	}

}




