#ifndef _AUTO_H
#define _AUTO_H

#include "sys.h"
#include "tb6612.h"
#include "dealadc.h"
#include "delay.h"
#include "simulate.h"

extern uint8_t PD12,PC14; 
extern uint16_t a1,a2,a3,a4;
extern int speedtest;

void automove(void);  //随机碰撞全局清扫（防坠落）
void yanbian(void);		 //沿边清扫
void walkbyhui(void);  //回字形清扫
void autotest(void);  //随机碰撞全局清扫（无防坠落）

#endif
