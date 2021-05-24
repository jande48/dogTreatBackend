import board
import busio
import adafruit_mpr121


class WaitForTouch():
    def __init__(self):
        self.name = "wait"

    def run(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        mpr121 = adafruit_mpr121.MPR121(i2c)
        trigger = True

        while trigger:
            if mpr121[2].value:
                if canDispenseTreat():
                    time.sleep(1)
                    #dispenseTreat()
                    #playGoodGirl()
                    time.sleep(1)
                trigger=False

def determineIfTouched():
    i2c = busio.I2C(board.SCL, board.SDA)
    mpr121 = adafruit_mpr121.MPR121(i2c)
    trigger = True

    while trigger:
        if mpr121[2].value:
            if canDispenseTreat():
                time.sleep(1)
                dispenseTreat()
                
                #playGoodGirl()
                time.sleep(1)
            trigger=False
    return 1