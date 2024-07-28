#include "auto.h"
uint8_t PD12 = 0, PC14 = 0; 
uint16_t a1=0,a2=0,a3=0,a4=0;
int flag=0;
int n=0;
int nobias=0;
int speedtest=20;

//随机碰撞全局清扫（防坠落）
void automove(void) 
{
    if (a1 < 6 || a2 < 20) {
        flag = 0;
        motor_stop();
        delay_ms(500);
        motor_right(10);
        delay_ms(1000);
    } else if (a3 < 20 || a4 < 6) {
        flag = 1;
        motor_stop();
        delay_ms(500);
        motor_left(10);
        delay_ms(1000);
    } else if (a1 < 4 || a4 < 4) {
        motor_stop();
        delay_ms(500);
        motor_back(15);
        delay_ms(1000);
    } else if (PD12 == RESET && PC14 == SET) {
        motor_left(10);
        flag = 3;
    } else if (PD12 == SET && PC14 == RESET) {
        motor_right(10);
        flag = 4;
    } else {
        flag = 5;
        motor_forward(20);
        delay_ms(200);
    }
}


//随机碰撞全局清扫（无防坠落）
void autotest(void) 
{
    if (PD12 == RESET && PC14 == SET) {
        motor_left(speedtest);
        flag = 3;
    } else if (PD12 == SET && PC14 == RESET) {
        motor_right(speedtest);
        flag = 4;
    } else if (PD12 == RESET && PC14 == RESET) {
        motor_back(speedtest);
    } else {
        flag = 5;
        motor_forward(speedtest);
        delay_ms(200);
    }
}


//回字形清扫
void walkbyhui(void)
{
	if(PD12 == SET && PC14 == SET)
	{
		motor_forward(30);
	}
	else 
	{
		motor_back(10);
		delay_ms(1000);
		turntheta=theta+1.59*pow(-1,n);
		turn();
		int y_now=y_tran;
		while(y_tran-y_now<20)
		{
			motor_forward(30);
		}	
		if(n%2==0)
		{
			turntheta=theta+1.62*pow(-1,n);
		}
		else
		{
		turntheta=theta+1.85*pow(-1,n);}
		turn();
		n+=1;
	}
}


//沿边清扫
void yanbian(void) {
    motorleft_set(20);
    motorright_set(50);

    if (PD12 == SET && PC14 == RESET) { // 左碰
        nobias = 0;
        while (PC14 == RESET) {
            motor_right(40);
            delay_ms(100);
        }
    } else if (PD12 == RESET && PC14 == RESET) { // 全碰
        nobias = 0;
        while (PD12 == RESET || PC14 == RESET) {
            motor_back(10);
            delay_ms(100);
            motor_right(10);
            delay_ms(50);
        }
    } else if (PD12 == RESET && PC14 == SET) { // 右碰
        nobias = 0;
        while (PD12 == RESET) {
            motor_right(10);
            delay_ms(100);
        }
    } else if (PD12 == SET && PC14 == SET) { // 都没碰
        nobias++;
        delay_ms(5);
        if (nobias > 300) {
            int leftpwm = 20;
            while (PD12 == SET && PC14 == SET) {
                if (leftpwm < 50) {
                    leftpwm++;
                }
                motorleft_set(leftpwm);
                motorright_set(50);
                delay_ms(100);
            }
        }
    }
}

