#include "timer.h"


////定时器7中断服务程序		    
//void TIM6_DAC_IRQHandler(void)
//{ 	
//	if (TIM_GetITStatus(TIM6, TIM_IT_Update) != RESET)//是更新中断
//	{	 			   
//		ADC_Filter();
//		TIM_ClearITPendingBit(TIM6, TIM_IT_Update  );  //清除TIM7更新中断标志    
//	}	    
//}
// 
////通用定时器中断初始化
////这里始终选择为APB1的2倍，而APB1为36M
////arr：自动重装值。
////psc：时钟预分频数		 
//void TIM6_Int_Init(u32 arr,u32 psc)
//{	
//	NVIC_InitTypeDef NVIC_InitStructure;
//	TIM_TimeBaseInitTypeDef  TIM_TimeBaseStructure;

//	RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM6, ENABLE);//TIM7时钟使能    
//	
//	//定时器TIM7初始化
//	TIM_TimeBaseStructure.TIM_Period = arr; //设置在下一个更新事件装入活动的自动重装载寄存器周期的值	
//	TIM_TimeBaseStructure.TIM_Prescaler =psc; //设置用来作为TIMx时钟频率除数的预分频值
//	TIM_TimeBaseStructure.TIM_ClockDivision = TIM_CKD_DIV1; //设置时钟分割:TDTS = Tck_tim
//	TIM_TimeBaseStructure.TIM_CounterMode = TIM_CounterMode_Up;  //TIM向上计数模式
//	TIM_TimeBaseInit(TIM6, &TIM_TimeBaseStructure); //根据指定的参数初始化TIMx的时间基数单位
// 
//	TIM_ITConfig(TIM6,TIM_IT_Update,ENABLE ); //使能指定的TIM7中断,允许更新中断
//   
//	TIM_Cmd(TIM6,ENABLE);//使能定时器7
//	
//	NVIC_InitStructure.NVIC_IRQChannel = TIM6_DAC_IRQn;
//	NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority=0 ;//抢占优先级0
//	NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1;		//子优先级1
//	NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;			//IRQ通道使能
//	NVIC_Init(&NVIC_InitStructure);	//根据指定的参数初始化VIC寄存器
//	
//}


