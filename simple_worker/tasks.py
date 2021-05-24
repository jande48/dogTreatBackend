import time
from celery import Celery
from celery.utils.log import get_task_logger
# from dispenseTreat import dispenseTreat
# import board
import time
import board
import busio
import RPi.GPIO as GPIO
#import adafruit_mpr121
#import Adafruit_GPIO as GPIO

logger = get_task_logger(__name__)

app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

@app.task()
def dispenseTreatCelery():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17,GPIO.OUT)
    servo1 = GPIO.PWM(17,50)# 50hz frequency
    servo1.start(7)# starting duty cycle ( it set the servo to 0 degree )
    time.sleep(0.2)

    servo1.ChangeDutyCycle(10)
    time.sleep(0.1)

    servo1.stop()
    GPIO.cleanup()
    logger.info(' Logger is working ')
    return 0
    # i2c = busio.I2C(board.SCL, board.SDA)
    #     mpr121 = adafruit_mpr121.MPR121(i2c)
    #     trigger = True

    #     while trigger:
    #         if mpr121[2].value:
    #             if canDispenseTreat():
    #                 time.sleep(1)
    #                 #dispenseTreat()
    #                 #playGoodGirl()
    #                 time.sleep(1)
    #             trigger=False
    # return 0

@app.task()
def longtime_add(x, y):
    logger.info('Got Request - Starting work ')
    time.sleep(4)
    logger.info('Work Finished ')
    return x + y
