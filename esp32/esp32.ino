#include "BluetoothSerial.h"
#include <unistd.h>

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT;

// RIGHT_WHEEL_ENABLE_PINでもある
#define DRIVER_ENABLE_PIN1 17
#define DRIVER_ENABLE_PIN2 16
#define DRIVER_ENABLE_PIN3 26

#define LEFT_WHEEL_PIN1 33
#define LEFT_WHEEL_PIN2 32
#define RIGHT_WHEEL_PIN1 18
#define RIGHT_WHEEL_PIN2 19
#define ARM_PIN 27
float arm_speed = 3.742;

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
  ReversibleWheel *left_wheel;
  ReversibleWheel *right_wheel;
public:
  Car(ReversibleWheel *left_wheel, ReversibleWheel *right_wheel);
  void Straight();
  void Back();
  void Stop();
  void RotateRight();
  void RotateLeft();
};

Car::Car(ReversibleWheel *left_wheel, ReversibleWheel *right_wheel) {
  this->left_wheel = left_wheel;
  this->right_wheel = right_wheel;
}

void Car::Straight() {
  this->left_wheel->Forward();
  this->right_wheel->Forward();
}

void Car::Back() {
  this->left_wheel->Reverse();
  this->right_wheel->Reverse();
}

void Car::Stop() {
  this->left_wheel->Stop();
  this->right_wheel->Stop();
}

void Car::RotateRight() {
  this->left_wheel->Reverse();
  this->right_wheel->Forward();
}

void Car::RotateLeft() {
  this->left_wheel->Forward();
  this->right_wheel->Reverse();
}

// Arm クラス
class Arm
{
private:
  Wheel *wheel;
  bool is_closed = false;
public:
  Arm(Wheel *wheel);
  void Open();
  void Close();
};

Arm::Arm(Wheel *wheel) {
  this->wheel = wheel;
}

void Arm::Open() {
  if (this->is_closed) return;
  this->wheel->Forward();
  usleep(arm_speed/2*1000000);
  this->wheel->Stop();
  this->is_closed = false;
}

void Arm::Close() {
  if(!this->is_closed) return;
  this->wheel->Forward();
  usleep(arm_speed/2*1000000);
  this->wheel->Stop();
  this->is_closed = true;
}

Wheel arm_wheel = Wheel(ARM_PIN);
ReversibleWheel left_wheel = ReversibleWheel(LEFT_WHEEL_PIN1, LEFT_WHEEL_PIN2);
ReversibleWheel right_wheel = ReversibleWheel(RIGHT_WHEEL_PIN1, RIGHT_WHEEL_PIN2);
Car car = Car(&left_wheel, &right_wheel);
Arm arm = Arm(&arm_wheel);

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32test"); //Bluetooth device name
  Serial.println("The device started, now you can pair it with bluetooth!");
  SerialBT.println("bluetooth setup");

  // PIN初期化する LEFT_WHEEL_ENABLE_PIN
  // PIN初期化する RIGHT_WHEEL_ENABLE_PIN
  // PIN初期化する ARM_ENABLE_PIN
  pinMode(DRIVER_ENABLE_PIN1, OUTPUT);
  pinMode(DRIVER_ENABLE_PIN2, OUTPUT);
  pinMode(DRIVER_ENABLE_PIN3, OUTPUT);
  pinMode(LEFT_WHEEL_PIN1, OUTPUT);
  pinMode(LEFT_WHEEL_PIN2, OUTPUT);
  pinMode(RIGHT_WHEEL_PIN1, OUTPUT);
  pinMode(RIGHT_WHEEL_PIN2, OUTPUT);
  pinMode(ARM_PIN, OUTPUT);
  
  digitalWrite(DRIVER_ENABLE_PIN1, HIGH);
  digitalWrite(DRIVER_ENABLE_PIN2, HIGH);
  digitalWrite(DRIVER_ENABLE_PIN3, HIGH);
}

void loop() { 
  // Bluetoothから受け取ったデータがある場合
  if (SerialBT.available())
  {
    // データ取得
    char c = SerialBT.read();
    // 取得データをログに表示
    SerialBT.println(c);

    if (c == 'f')
    {
      // 前進処理
      SerialBT.println("forward");
      car.Straight();
    }
    else if (c == 'b')
    {
      // 前進処理
      SerialBT.println("back");
      car.Back();
    }
    else if (c == 's')
    {
      // 停止処理
      SerialBT.println("stop");
      car.Stop();
    }
    else if (c == 'r')
    {
      // 回転処理
      SerialBT.println("rotate right");
      car.RotateRight();
    }
    else if (c == 'l')
    {
      // 回転処理
      SerialBT.println("rotate left");
      car.RotateLeft();
    }
    else if (c == 'o')
    {
      // 開腕処理
      SerialBT.println("open");
      arm.Open();
    }
    else if (c == 'c')
    {
      // 閉腕処理
      SerialBT.println("close");
      arm.Close();
    }
    // TODO: 一時的なものあとで消す
    else if (c == 'a')
    {
      // 閉腕処理
      SerialBT.println("rotate arm");
      arm_wheel.Forward();
    }
    else if (c == 'A')
    {
      // 閉腕処理
      SerialBT.println("stop arm");
      arm_wheel.Stop();
    }
    else if (c == 'x')
    {
      SerialBT.println("speed up arm");
      arm_speed += 0.001;
      SerialBT.println(arm_speed, 4);
    }
    else if (c == 'z')
    {
      SerialBT.println("speed down arm");
      arm_speed -= 0.001;
      SerialBT.println(arm_speed, 4);
    }
    else if (c == 'q')
    {
      // 修了処理
      // car.Stop();
      // arm.open();
      digitalWrite(DRIVER_ENABLE_PIN1, LOW);
      digitalWrite(DRIVER_ENABLE_PIN2, LOW);
      digitalWrite(DRIVER_ENABLE_PIN3, LOW);
    }
  }
}