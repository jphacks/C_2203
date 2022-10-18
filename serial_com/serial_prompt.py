import serial

serialBT = serial.Serial('/dev/tty.ESP32test',115200, timeout=5)

while True:
    command = input("Enter command: ")
    serialBT.write(command.encode())