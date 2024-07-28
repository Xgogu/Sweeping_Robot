#ifndef __ADC_H
#define __ADC_H	
#include "sys.h" 


#define ADC_BUFFER_SIZE 10
extern uint16_t ADC_ConvertedValue[ADC_BUFFER_SIZE];

void GPIO_ADC_Init(void);
void ADC_Config(void);
void DMA_Config(void);
	
#endif 















