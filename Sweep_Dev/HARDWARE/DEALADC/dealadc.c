#include "dealadc.h"


uint16_t last_ADC[10];	   
uint16_t current_ADC[10]; 
uint16_t update_ADC[10];    
int testflag=0;
#define FLITER_VAULE (100) 



void ADC_Start(void)
{
	ADC_DMACmd(ADC1, ENABLE);
	ADC_SoftwareStartConv(ADC1);
}


void ADC_Stop(void)
{
	ADC_DMACmd(ADC1, DISABLE);
}


void ADC_Filter(void)
{
	testflag=1;
	int16_t Date_Error = 0;
	ADC_Stop();
	for (uint8_t i = 0; i < 10; i++)
	{
		last_ADC[i] = current_ADC[i];
		current_ADC[i] = ADC_ConvertedValue[i];
		Date_Error = current_ADC[i] - last_ADC[i];
		if (Date_Error < FLITER_VAULE && Date_Error > -FLITER_VAULE)
		{
			update_ADC[i] = last_ADC[i];
			current_ADC[i] = last_ADC[i];
		}
		else
		{
			update_ADC[i] = current_ADC[i];
		}
	}
	ADC_Start();
}
