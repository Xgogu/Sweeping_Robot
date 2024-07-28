#include "tb6612.h"
 //对应传感器IO口初始化
void Gpio_Init(void)
{
	//tb6612
	GPIO_InitTypeDef  GPIO_InitStructure;
	RCC_AHB1PeriphClockCmd(RCC_AHB1Periph_GPIOE, ENABLE);
	
 	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_7|GPIO_Pin_8|GPIO_Pin_12|GPIO_Pin_13|GPIO_Pin_10;  
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_OUT;
	GPIO_InitStructure.GPIO_OType = GPIO_OType_PP;
	GPIO_InitStructure.GPIO_Speed = GPIO_Low_Speed;
	GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_NOPULL;
	GPIO_Init(GPIOE, &GPIO_InitStructure);
	
	//
	RCC_AHB1PeriphClockCmd(RCC_AHB1Periph_GPIOB, ENABLE);
	
 	GPIO_InitStructure.GPIO_Pin =GPIO_Pin_12;  
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_OUT;
	GPIO_InitStructure.GPIO_OType = GPIO_OType_PP;
	GPIO_InitStructure.GPIO_Speed = GPIO_Low_Speed;
	GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_NOPULL;
	GPIO_Init(GPIOB, &GPIO_InitStructure);
	
	//chupeng
	RCC_AHB1PeriphClockCmd(RCC_AHB1Periph_GPIOD, ENABLE);
 	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_12;  
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN;
	GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_NOPULL;
	GPIO_Init(GPIOD, &GPIO_InitStructure);

	RCC_AHB1PeriphClockCmd(RCC_AHB1Periph_GPIOC, ENABLE);
 	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_14;  
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN;
	GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_NOPULL;
	GPIO_Init(GPIOC, &GPIO_InitStructure);
		
	
}

void motor_forward(uint8_t speed)
{
    TIM_SetCompare1(TIM1,speed);
    TIM_SetCompare2(TIM1, speed);
	GPIO_ResetBits(GPIOE, GPIO_Pin_7);
	GPIO_SetBits(GPIOE, GPIO_Pin_8);
	GPIO_SetBits(GPIOE, GPIO_Pin_12);
	GPIO_ResetBits(GPIOE, GPIO_Pin_13);
	GPIO_SetBits(GPIOE, GPIO_Pin_10);

}

void motorleft_set(int speed)
{

	if(speed>0)
	{
		GPIO_ResetBits(GPIOE, GPIO_Pin_7);
		GPIO_SetBits(GPIOE, GPIO_Pin_8);
		TIM_SetCompare1(TIM1,speed);
	}
	else
	{
		GPIO_SetBits(GPIOE, GPIO_Pin_7);
		GPIO_ResetBits(GPIOE, GPIO_Pin_8);
		TIM_SetCompare1(TIM1,-speed);
	}
    GPIO_SetBits(GPIOE, GPIO_Pin_10);
}

void motorright_set(int speed)
{

	if(speed>0)
	{
		GPIO_SetBits(GPIOE, GPIO_Pin_12);
		GPIO_ResetBits(GPIOE, GPIO_Pin_13);
		TIM_SetCompare2(TIM1, speed);
	}
	else
	{
		GPIO_ResetBits(GPIOE, GPIO_Pin_12);
		GPIO_SetBits(GPIOE, GPIO_Pin_13);
		TIM_SetCompare2(TIM1, -speed);
	}
    GPIO_SetBits(GPIOE, GPIO_Pin_10);
}

void motor_back(uint8_t speed)
{

    TIM_SetCompare1(TIM1,speed);
    TIM_SetCompare2(TIM1, speed);
	GPIO_SetBits(GPIOE, GPIO_Pin_7);
	GPIO_ResetBits(GPIOE, GPIO_Pin_8);
	GPIO_ResetBits(GPIOE, GPIO_Pin_12);
	GPIO_SetBits(GPIOE, GPIO_Pin_13);
	GPIO_SetBits(GPIOE, GPIO_Pin_10);

}

void motor_left(uint8_t speed)
{
    TIM_SetCompare1(TIM1,speed);
    TIM_SetCompare2(TIM1, speed);
	GPIO_SetBits(GPIOE, GPIO_Pin_7);
	GPIO_ResetBits(GPIOE, GPIO_Pin_8);
	GPIO_SetBits(GPIOE, GPIO_Pin_12);
	GPIO_ResetBits(GPIOE, GPIO_Pin_13);
	GPIO_SetBits(GPIOE, GPIO_Pin_10);
}

void motor_right(uint8_t speed)
{
    TIM_SetCompare1(TIM1,speed);
    TIM_SetCompare2(TIM1, speed);
	GPIO_ResetBits(GPIOE, GPIO_Pin_7);
	GPIO_SetBits(GPIOE, GPIO_Pin_8);
	GPIO_ResetBits(GPIOE, GPIO_Pin_12);
	GPIO_SetBits(GPIOE, GPIO_Pin_13);
	GPIO_SetBits(GPIOE, GPIO_Pin_10);
}

void motor_stop(void)
{
    
	GPIO_ResetBits(GPIOE, GPIO_Pin_7);
	GPIO_ResetBits(GPIOE, GPIO_Pin_8);
	GPIO_ResetBits(GPIOE, GPIO_Pin_12);
	GPIO_ResetBits(GPIOE, GPIO_Pin_13);
	GPIO_ResetBits(GPIOE, GPIO_Pin_10);

}
