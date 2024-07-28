#ifndef _TIMER_H
#define _TIMER_H
#include "sys.h"
#include "dealadc.h"
#include "math.h"
#include "encoder.h"
#include "delay.h"

extern float frequence; //频率 1/单位读取编码器时间
extern float l; //轮胎周长
extern float trans1;
extern float trans2;//
extern int a,b; //左右轮的编码器值
extern float x,y;//机器人短时间内在自身坐标系下移动的距离
extern float xl,xr;//左右轮距离 单位：m
extern int all;

extern float turntheta;
extern float delta_theta;
extern int x_tran,y_tran;
extern float theta;
extern float vl,vr;
extern float left_out,right_out;
extern float dl_target,dr_target;
extern int pos_flag;
extern int xl_tran,xr_tran;
extern float dis_motor;
extern float x0,y0;
void TIM14_Int_Init(u16 arr,u16 psc);
//void TIM14_PWM_Init(u32 arr,u32 psc);
void TIM1_PWM_Init(u32 arr,u32 psc);
void TIM3_Int_Init(u16 arr,u16 psc);
void TIM6_Int_Init(u32 arr,u32 psc);
void TIM4_PWM_Init(void);
void softwarePWM_PB12(uint32_t period_us, uint32_t duty_cycle_us);

#endif
