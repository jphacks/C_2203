import serial
import time
import requests

# serialBT = serial.Serial('/dev/tty.ESP32test',115200, timeout=5)
serialBT = serial.Serial('COM4', 9600)

def write_to_esp(code):
    serialBT.write(code.encode())

# while True:
#     command = input("Enter command: ")
#     serialBT.write(command.encode())

if __name__ == "__main__":
    # write_to_esp("s")
    while True:
        c = input("command: ")
        write_to_esp(c)
        if c == "f":
            r = requests.get('http://localhost:8000/animate?q=walk_with_ball')
        if c == "s":
            r = requests.get('http://localhost:8000/animate?q=stop_with_ball')
        if c == "o":
            time.sleep(2)
            r = requests.get('http://localhost:8000/animate?q=stop')
            break