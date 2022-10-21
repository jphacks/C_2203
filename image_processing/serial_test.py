import serial
import time

# serialBT = serial.Serial('/dev/tty.ESP32test',115200, timeout=5)
serialBT = serial.Serial('COM4', 9600)

def write_to_esp(code):
    serialBT.write(code.encode())

# while True:
#     command = input("Enter command: ")
#     serialBT.write(command.encode())

if __name__ == "__main__":
    write_to_esp("a")
    c = input("command: ")
    write_to_esp("A")