#ifndef __SIMULATE_H
#define __SIMULATE_H

#include "stm32f4xx.h"
#include <stdio.h>
#include "tb6612.h"
#include <math.h>
#include "pwm.h"
#include "auto.h"
#include "usartx.h"

#define Kp 0 // 70
#define Ki 0 // 10.5
#define Kd 0 // 19
// 左轮pid参数
#define Kp_L 20 // 35.5
#define Ki_L 1// 0.815
#define Kd_L 0  // 1.86
// 右轮PID参数
#define Kp_R 20
#define Ki_R 0.8
#define Kd_R 0

#define I_max 150           // 最大积分值
#define I_min -150          // 最小积分值
#define V_out_max 100       // 最大输出
#define V_out_min -100      // 最小输出
#define G_s 0.0002          // 开环传递函数
#define delta 0.05          // 稳态误差
#define V_to_PWM 3500 / 108 // 速度转PWM系数


extern float pwmtest;
extern float turntheta;
extern int turnflag;
extern float xtarget;
extern float ytarget;
extern int bias;
float PID_V_L(float given_v, float current_v);
float PID_V_R(float given_v, float current_v);
float pos_pid_a(float position,float target);
float pos_pid_b(float position,float target);


void velpid(float vx,float vy);
void pospid(void);
void postarget(float xtarget,float ytarget);
int pwm_limit(int pwm);
float thetapid(float target);
void turn(void);
void turncontrol(void);
void go(void);
void posgo(void);

#endif
