import serial

serialBT = serial.Serial('/dev/tty.ESP32test',115200)

while True:
    res = serialBT.readline().decode()
    if res != "":
        print(res)
