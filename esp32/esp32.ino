#include <unistd.h>

// RIGHT_WHEEL_ENABLE_PINでもある
#define DRIVER_ENABLE_PIN1 17
#define DRIVER_ENABLE_PIN2 16

#define LEFT_WHEEL_PIN 32
#define RIGHT_WHEEL_PIN1 18
#define RIGHT_WHEEL_PIN2 19
#define ARM_PIN 33 
#define ARM_ROTATION_TIME 5

// wheel クラス
class Wheel
{
private:
  int pin;
public:
  Wheel(int pin);
  void Forward();
  void Stop();
};

Wheel::Wheel(int pin) {
  this->pin = pin;
}

void Wheel::Forward() {
  digitalWrite(this->pin, HIGH);
}

void Wheel::Stop() {
  digitalWrite(this->pin, LOW);
}

// ReversibleWheel クラス
class ReversibleWheel {
  private:
    int pin1;
    int pin2;
  public:
    ReversibleWheel(int pin1, int pin2);
    void Forward();
    void Reverse();
    void Stop();
};

ReversibleWheel::ReversibleWheel(int pin1, int pin2) {
  this->pin1 = pin1;
  this->pin2 = pin2;
}

void ReversibleWheel::Forward() {
  digitalWrite(this->pin1, HIGH);
  digitalWrite(this->pin2, LOW);
}

void ReversibleWheel::Reverse() {
  digitalWrite(this->pin1, LOW);
  digitalWrite(this->pin2, HIGH);
}

void ReversibleWheel::Stop() {
  digitalWrite(this->pin1, LOW);
  digitalWrite(this->pin2, LOW);
}


// Car クラス
class Car
{
private:
  Wheel *left_wheel;
  ReversibleWheel *right_wheel;
public:
  Car(Wheel *left_wheel, ReversibleWheel *right_wheel);
  void Straight();
  void Stop();
  void Rotate();
};

Car::Car(Wheel *left_wheel, ReversibleWheel *right_wheel) {
  this->left_wheel = left_wheel;
  this->right_wheel = right_wheel;
}

void Car::Straight() {
  this->left_wheel->Forward();
  this->right_wheel->Forward();
}

void Car::Stop() {
  this->left_wheel->Stop();
  this->right_wheel->Stop();
}

void Car::Rotate() {
  this->left_wheel->Forward();
  this->right_wheel->Reverse();
}

// Arm クラス
class Arm
{
private:
  Wheel *wheel;
  bool is_closed;
public:
  Arm(Wheel *wheel);
  void open();
  void close();
};

Arm::Arm(Wheel *wheel) {
  this->wheel = wheel;
}

void Arm::open() {
  if (!this->is_closed) return;
  this->wheel->Forward();
  // アームを開けるまでの時間スリープ
  sleep(ARM_ROTATION_TIME/2);
  this->wheel->Stop();
  this->is_closed = false;
}

void Arm::close() {
  if(this->is_closed) return;
  this->wheel->Forward();
  sleep(ARM_ROTATION_TIME/2);
  this->wheel->Stop();
  this->is_closed = true;
}

Wheel arm_wheel = Wheel(ARM_PIN);
Wheel left_wheel = Wheel(LEFT_WHEEL_PIN);
ReversibleWheel right_wheel = ReversibleWheel(RIGHT_WHEEL_PIN1, RIGHT_WHEEL_PIN2);
Car car = Car(&left_wheel, &right_wheel);
Arm arm = Arm(&arm_wheel);

void setup() {
  // put your setup code here, to run once:
  // Serial.begin(9600);

  // PIN初期化する LEFT_WHEEL_ENABLE_PIN
  // PIN初期化する RIGHT_WHEEL_ENABLE_PIN
  // PIN初期化する ARM_ENABLE_PIN
  pinMode(LEFT_WHEEL_PIN, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  left_wheel.Forward();
  sleep(3);
  left_wheel.Stop();
  sleep(3);
}

