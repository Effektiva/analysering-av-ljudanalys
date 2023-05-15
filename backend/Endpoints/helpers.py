from database import SessionLocal
from enum import Enum

session = SessionLocal()

# Takes a response object and make sure that it can be sent back. Object should be with a fetchall()
def makeList(object):
    listObject = []
    for row in object:
        listObject.append(row[0])

    return listObject


class Soundclass(Enum):
    SPEECH = 0
    WHISPERING = 15
    SHOUT = 8
    YELL = 11
    SCREAMING = 14
    LAUGHTER = 16
    CRYING = 22
    COUGH = 47
    CRACK = 440
    SLAP = 467
    BREAKING = 470
    CRUSHING = 478
    MUSIC = 137
    TELEVISION = 524
    ALARM = 388
    TELEPHONE = 389
    RINGTONE = 391
    ALARM_CLOCK = 395
    RADIO = 525
    VEHICLE = 300
    CARALARM = 310
    TRAFFIC = 327
    EXPLOSION = 426
    GUNSHOT = 427
    BOOM = 436
    DOOR = 354
