#include "simulate.h"

float Position_KP=1.8,Position_KI=0,Position_KD=0.1;

float Theta_KP=70,Theta_KI=0,Theta_KD=0.5;

float pwmtest=0;

int turnflag=1;
int bias=0;
float turntheta=0;
float xtarget=0;
float ytarget=0;

float PID_V_L(float given_v, float current_v)
{
	static float pid_p,V_out,pid_i,pid_d,pid_last;
    pid_p = given_v - current_v;
    pid_i = pid_i + pid_p;
    pid_d = pid_p - pid_last;
    pid_last = pid_p;
    // 积分限幅
    if (pid_i >= I_max)
        pid_i = I_max;
    if (pid_i <= I_min)
        pid_i= I_min;
    if (given_v == 0)
        pid_i = 0;
    V_out = pid_p * Kp_L + pid_i * Ki_L + pid_d * Kd_L;
    // 极限输出限制
    if (V_out >= V_out_max)
        V_out = V_out_max;
    if (V_out <= V_out_min)
        V_out = V_out_min;
    return V_out;
}

/**
 * @brief 右轮PID
 * @param PID结构体，given_v目标速度，current_v当前速度
 */

float PID_V_R(float given_v, float current_v)
{
	static float pid_p,V_out,pid_i,pid_d,pid_last;
    pid_p = given_v - current_v;
    pid_i = pid_i + pid_p;
    pid_d = pid_p - pid_last;
    pid_last = pid_p;
    // 积分限幅
    if (pid_i >= I_max)
        pid_i = I_max;
    if (pid_i <= I_min)
        pid_i= I_min;
    if (given_v == 0)
        pid_i = 0;
    V_out = pid_p * Kp_R + pid_i * Ki_R + pid_d * Kd_R;
    // 极限输出限制
    if (V_out >= V_out_max)
        V_out = V_out_max;
    if (V_out <= V_out_min)
        V_out = V_out_min;
    return V_out;
}


float pos_pid_a(float position,float target)
{
	 static float Bias,Pwm,Last_Bias,Previous_bias;
	 Bias=target-position;                                
	 Pwm+=Position_KP*(Bias-Last_Bias)+Position_KI*Bias+Position_KD*(Bias-2*Last_Bias+Previous_bias);       
	 Last_Bias=Bias;                                     
	 Previous_bias=Last_Bias;
	 return Pwm;                                          
}
float pos_pid_b(float position,float target)
{
	 static float Bias,Pwm,Last_Bias,Previous_bias;
	 Bias=target-position;                                                       
	 Pwm+=Position_KP*(Bias-Last_Bias)+Position_KI*Bias+Position_KD*(Bias-2*Last_Bias+Previous_bias);      
	 Last_Bias=Bias;                                      
	 Previous_bias=Last_Bias;
	 return Pwm;                                        
}

void postarget(float xtarget,float ytarget)
{
//		dl_target=dy*sin(theta)+dx*cos(theta)-(dy*cos(theta)/2)+(dx*sin(theta)/2);
//		dr_target=dy*sin(theta)+dx*cos(theta)+(dy*cos(theta)/2)-(dx*sin(theta)/2);
	 float dx=sqrt((xtarget-x0*100)*(xtarget-x0*100)+(ytarget-y0*100)*(ytarget-y0*100));
	float tmp=(ytarget-y0*100)/(xtarget-x0*100);
   float thetatarget=atan(tmp);  
//	float dz=-thetatarget+theta;
	 dl_target=xl_tran+dx*cos(thetatarget) ; //计算出左轮的目标速度
		dr_target = xr_tran+dl_target ; //计算出右轮的目标速度
}

void postarget2(float xtarget,float ytarget)
{
//		dl_target=dy*sin(theta)+dx*cos(theta)-(dy*cos(theta)/2)+(dx*sin(theta)/2);
//		dr_target=dy*sin(theta)+dx*cos(theta)+(dy*cos(theta)/2)-(dx*sin(theta)/2);
	 float dx=sqrt((xtarget-x0*100)*(xtarget-x0*100)+(ytarget-y0*100)*(ytarget-y0*100));
	float tmp=(ytarget-y0*100)/(xtarget-x0*100);
   float thetatarget=atan(tmp);  
//	float dz=-thetatarget+theta;
	 dl_target=xl_tran+dx*sin(thetatarget) ; //计算出左轮的目标速度
		dr_target =xr_tran +dl_target ; //计算出右轮的目标速度
}

void velpid(float vx,float vy)
{

	float vl_target=vx;
	float vr_target=vx;
	left_out=PID_V_L(vl_target,vl);
	right_out=PID_V_R(vr_target,vr);
	int pwm1=left_out;
	int pwm2=right_out;
	pwm1=pwm_limit(pwm1);
	pwm2=pwm_limit(pwm2);
	motorleft_set(pwm1);
	motorright_set(pwm2);
}

void pospid(void)
{
	
	left_out=pos_pid_a(xl_tran,dl_target);
	right_out=pos_pid_b(xr_tran,dr_target);
	int pwm1=left_out;
	int pwm2=right_out;
	pwm1=pwm_limit(pwm1);
	pwm2=pwm_limit(pwm2);
	motorleft_set(pwm1);
	motorright_set(pwm2);
}

float thetapid(float target)
{
	 
	static float Bias,Pwm,Last_Bias,Previous_bias;
	 Bias=target-theta;                                  
	 Pwm+=Theta_KP*(Bias-Last_Bias)+Theta_KI*Bias+Theta_KD*(Bias-2*Last_Bias+Previous_bias);       
	 Last_Bias=Bias;
	 Previous_bias=Last_Bias;
	 return Pwm; 
}

void turn(void)
{
	
		while(fabs(turntheta-theta)>0.07 || fabs(pwmtest)>5)
	{
		turncontrol();

	}
}


float normalize_angle(float *theta) {
    // 将角度转换为弧度的模运算
	float test=0;
    test = fmod(*theta + 3.14, 2 * 3.14);
    if (test< 0) {
        test += 2 * 3.14;
    }
    test -= 3.14;
		return test;
}

void go(void)
{

	while(fabs(dl_target-xl_tran)>3 || fabs(dr_target-xr_tran)>3 || fabs(left_out)>4 || fabs(right_out)>4)
	{
	if(PD12==RESET || PC14==RESET)  //碰一个
	{
		motor_back(10);
		delay_ms(1000);
		turntheta=theta+1.57;
		turn();
		motor_forward(20);
		delay_ms(2000);
		turntheta=theta-1.57;
		turn();
		motor_forward(20);
		delay_ms(1000);
		bias=1;
		usart3_send('R');
		break;
	}
	else
	{
	pospid();
	}
	
	}
	
}
void posgo(void)
{
	
	float dx=sqrt((xtarget-x0*100)*(xtarget-x0*100)+(ytarget-y0*100)*(ytarget-y0*100)); //结算x，y坐标到距离
	float tmp=(ytarget-y0*100)/(xtarget-x0*100); //结算k值
	float vector1x = 1;  //x方向单位向量
	float vector1y = 0;
	float vector2x = xtarget-x0*100; //目标向量
	float vector2y = ytarget-y0*100;
	float t = ((vector1x)*(vector2x) + (vector1y)*(vector2y))/ (sqrt(pow(vector1x, 2) + pow(vector1y, 2))*sqrt(pow(vector2x, 2) + pow(vector2y, 2))); //旋转角
	float theta_tr=normalize_angle(&theta); //换算当前机器人的角度偏移到0-pi
	theta=theta_tr;
	float theta_target=0;
	if(vector2y>0)
	{
		theta_target=acos(t); //求解偏移角度
	}
	else
	{
		theta_target=-acos(t);
	}
	turntheta=theta_target;
	turn();  //Theta  pid结算
	dl_target=xl_tran+dx; 
	dr_target =xr_tran+dx;
	go();//pos pid结算

}
void turncontrol(void)
{
	pwmtest=thetapid(turntheta);
	int pwm=pwmtest;
	pwm=pwm_limit(pwm);
	motorleft_set(pwm);
	motorright_set(-pwm);
}


int pwm_limit(int pwm)
{
	if(pwm>60)
	{
	pwm=60;
	}
	else if(pwm<-60)
	{
	pwm=-60;
	}
	
	return pwm;
}
