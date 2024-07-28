#ifndef __USRATX_H
#define __USRATX_H 

#include "stdio.h"
#include "sys.h"
#include "simulate.h"



void USART3_SEND(void);

void uart3_init(u32 bound);


void USART3_IRQHandler(void);
void uart2_init(u32 bound);

void usart3_send(u8 data);

void process(void);

extern u8 Res;
extern u8 Adjust_res;
extern int goready;
extern u8 Yuyin;
#endif

