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

void automove(void);  //�����ײȫ����ɨ����׹�䣩
void yanbian(void);		 //�ر���ɨ
void walkbyhui(void);  //��������ɨ
void autotest(void);  //�����ײȫ����ɨ���޷�׹�䣩

#endif
