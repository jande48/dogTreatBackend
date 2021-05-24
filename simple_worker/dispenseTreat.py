
import time
import board
import busio
import RPi.GPIO as GPIO
import board

class DispenseTreat():
    def __init__(self):
        self.name = "dispense"

    def run(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(17,GPIO.OUT)
        servo1 = GPIO.PWM(17,50)# 50hz frequency
        servo1.start(7)# starting duty cycle ( it set the servo to 0 degree )
        time.sleep(0.2)

        servo1.ChangeDutyCycle(10)
        time.sleep(0.1)

        servo1.stop()
        GPIO.cleanup()

def dispenseTreat():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17,GPIO.OUT)
    servo1 = GPIO.PWM(17,50)# 50hz frequency
    servo1.start(7)# starting duty cycle ( it set the servo to 0 degree )
    time.sleep(0.2)

    servo1.ChangeDutyCycle(10)
    time.sleep(0.1)

    servo1.stop()
    GPIO.cleanup()

    return 1
