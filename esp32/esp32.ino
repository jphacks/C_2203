#define LEFT_WHEEL_ENABLE_PIN 1000
#define LEFT_WHEEL_PIN 1001
#define RIGHT_WHEEL_ENABLE_PIN 1002
#define RIGHT_WHEEL_PIN1  1003
#define RIGHT_WHEEL_PIN2 1004
#define ARM_ENABLE_PIN 1005
#define ARM_PIN 1006

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
}

void Wheel::Stop() {
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
}

void ReversibleWheel::Reverse() {
}

void ReversibleWheel::Stop() {
}


// Car クラス
class Car
{
private:
  Wheel *left_wheel;
  ReversibleWheel *right_wheel;
public:
  Car(Wheel *left_wheel, ReversibleWheel *right_wheel);
  void straight();
  void back();
  void stop();
  void rotate();
};

Car::Car(Wheel *left_wheel, ReversibleWheel *right_wheel) {
  this->left_wheel = left_wheel;
  this->right_wheel = right_wheel;
}

// Arm クラス
class Arm
{
private:
  Wheel *wheel;
public:
  Arm(Wheel *wheel);
  void open();
  void close();
};

Arm::Arm(Wheel *wheel) {
  this->wheel = wheel;
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

}

void loop() {
  // put your main code here, to run repeatedly:
}

