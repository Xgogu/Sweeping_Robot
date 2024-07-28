#ifndef __DEALADC_H
#define __DEALADC_H	
#include "sys.h" 
#include "adc.h"

extern uint16_t update_ADC[10];  

void ADC_Filter(void);
void ADC_Start(void);
void ADC_Stop(void);

#endif 















