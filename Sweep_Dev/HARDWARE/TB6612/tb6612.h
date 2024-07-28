#ifndef _TB6612_H
#define _TB6612_H

#include "sys.h"


#define OUTAIN1(x) PEout(7)
#define OUTAIN2(x) PEout(8)
#define OUTBIN1(x) PEout(12)
#define OUTBIN2(x) PEout(13)
#define STBY(x) PEout(10)


void Gpio_Init(void);
void motor_forward(uint8_t speed);
void motorleft_set(int speed);
void motorright_set(int speed);
void motor_back(uint8_t speed);
void motor_left(uint8_t speed);
void motor_right(uint8_t speed);
void motor_stop(void);

#endif
