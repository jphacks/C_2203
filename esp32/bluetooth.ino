#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT;

void setup()
{
  Serial.begin(115200);
  SerialBT.begin("ESP32test"); //Bluetooth device name
  Serial.println("The device started, now you can pair it with bluetooth!");
}

void loop()
{
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
    }
    else if (c == 'b')
    {
      // 後退処理
      SerialBT.println("back");
    }
    else if (c == 's')
    {
      // 停止処理
      SerialBT.println("stop");
    }
    else if (c == 'r')
    {
      // 回転処理
      SerialBT.println("rotate");
    }
    else if (c == 'o')
    {
      // 開腕処理
      SerialBT.println("open");
    }
    else if (c == 'c')
    {
      // 閉腕処理
      SerialBT.println("close");
    }
  }
}
