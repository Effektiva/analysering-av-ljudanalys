import sqlalchemy
from sqlalchemy import select, insert, update, delete
from fastapi import FastAPI, Response, Request
from typing import Union
from fastapi.middleware.cors import CORSMiddleware

import models
from database import SessionLocal, engine
from Endpoints.helpers import session, makeList
from Endpoints.investigations import router1
from Endpoints.dossier import router2
from Endpoints.soundChains import router3
from Endpoints.misc import router4

import datetime
import time
import base64


def insert_dummy(session):
    ######## CREATE TIME ########
    print("-------- creating time --------")
    datum1 = datetime.datetime(1970, 1, 1, 1, 0, 0)
    datum2 = datetime.datetime(1970, 1, 1, 1, 1, 0)
    datum3 = datetime.datetime(1970, 1, 1, 1, 2, 0)


    datum4 = datetime.datetime(1970, 1, 2, 2, 0, 0)
    datum5 = datetime.datetime(1970, 1, 2, 2, 1, 0)
    datum6 = datetime.datetime(1970, 1, 2, 2, 2, 0)

    datum7 = datetime.datetime(1970, 1, 3, 3, 0, 0)
    datum8 = datetime.datetime(1970, 1, 3, 3, 1, 0)
    datum9 = datetime.datetime(1970, 1, 3, 3, 2, 0)

    datum10 = datetime.datetime(1970, 1, 3, 4, 0, 0)
    datum11 = datetime.datetime(1970, 1, 3, 4, 1, 0)
    datum12 = datetime.datetime(1970, 1, 3, 4, 2, 0)


    time1 = time.mktime(datum1.timetuple())
    time2 = time.mktime(datum2.timetuple())
    time3 = time.mktime(datum3.timetuple())

    time4 = time.mktime(datum4.timetuple())
    time5 = time.mktime(datum5.timetuple())
    time6 = time.mktime(datum6.timetuple())

    time7 = time.mktime(datum7.timetuple())
    time8 = time.mktime(datum8.timetuple())
    time9 = time.mktime(datum9.timetuple())

    time10 = time.mktime(datum10.timetuple())
    time11 = time.mktime(datum11.timetuple())
    time12 = time.mktime(datum12.timetuple())

    timelist= [time1, time2, time3, time4, time5, time6, time7, time8, time9, time10, time11, time12]
    ######## CREATE INVESTIGATIONS ########
    print("-------- creating inestigations --------")
    session.execute(insert(models.Investigations).values(name = "Kalles Knarkaffärer"))
    session.execute(insert(models.Investigations).values(name = "Länsmansjäveln"))


    ######## CREATE SOUNDCLASSES ########
    print("-------- creating soundclasses --------")
    session.execute(insert(models.SoundClass).values(name = "OUCH"))
    session.execute(insert(models.SoundClass).values(name = "BOOM"))
    session.execute(insert(models.SoundClass).values(name = "BAAM"))
    session.execute(insert(models.SoundClass).values(name = "CRASH"))


    ######## CREATE SOUNDCHAINS ########
    print("-------- creating soundchains --------")
    session.execute(insert(models.SoundChain).values(start_time = time1, end_time =  time3, investigations_id = 1))
    session.execute(insert(models.SoundChain).values(start_time =  time4, end_time =  time6, investigations_id = 1))
    session.execute(insert(models.SoundChain).values(start_time =  time7, end_time =  time9, investigations_id = 2))
    session.execute(insert(models.SoundChain).values(start_time =  time10, end_time =  time12, investigations_id = 2))


    ######## CREATE SOUNDFILES ########
    print("-------- creating soundfiles --------")
    session.execute(insert(models.SoundFile).values(start_time =  time1, end_time =  time2, file_name = "soundfile_1", sound_chain_id = 1))
    session.execute(insert(models.SoundFile).values(start_time =  time2, end_time =  time3, file_name = "soundfile_2", sound_chain_id = 1))
    session.execute(insert(models.SoundFile).values(start_time =  time4, end_time =  time5, file_name = "soundfile_3", sound_chain_id = 2))
    session.execute(insert(models.SoundFile).values(start_time =  time5, end_time =  time6, file_name = "soundfile_4", sound_chain_id = 2))


    session.execute(insert(models.SoundFile).values(start_time =  time7, end_time =  time8, file_name = "soundfile_5", sound_chain_id = 3))
    session.execute(insert(models.SoundFile).values(start_time =  time8, end_time =  time9, file_name = "soundfile_6", sound_chain_id = 3))
    session.execute(insert(models.SoundFile).values(start_time =  time10, end_time =  time11, file_name = "soundfile_7", sound_chain_id = 4))
    session.execute(insert(models.SoundFile).values(start_time =  time11, end_time =  time12, file_name = "soundfile_8", sound_chain_id = 4))


    ######## CREATE COMMENTS ########
    print("-------- creating comments --------")
    session.execute(insert(models.Comments).values(time = time1 + 40, text = "SKOTT_i_soundfile1", sound_file_id = 1))
    session.execute(insert(models.Comments).values(time = time1 + 50, text = "PRAT_i_soundfile1", sound_file_id = 1))

    session.execute(insert(models.Comments).values(time = time7 + 5, text = "SKOTT_i_soundfile2", sound_file_id = 2))
    session.execute(insert(models.Comments).values(time = time7 + 10, text = "PRAT_i_soundfile2", sound_file_id = 2))


    ######## CREATE SOUNDINTERVALS ########
    print("-------- creating soundintervals --------")

    for i in range(8):
        for j in range(6):
            start_t = timelist[i] + 10*j
            end_t = start_t + 10
            session.execute(insert(models.SoundInterval).values(start_time = start_t, end_time = end_t, highest_volume = 5000, sound_file_id = i + 1))



     ######## CREATE SOUNDS ########
    print("-------- creating sounds --------")
    session.execute(insert(models.Sound).values(trust_value = 0.6, sound_class = "BOOM", sound_interval_id = 1))
    session.execute(insert(models.Sound).values(trust_value = 0.6, sound_class = "BAAM", sound_interval_id = 1))


    ######## CREATE TAGS ########
    print("-------- creating tags --------")
    session.execute(insert(models.Tags).values(tag_id = "MYSTISKT", sound_file_id = 1))
    session.execute(insert(models.Tags).values(tag_id = "MYSTISKT", sound_file_id = 2))
    session.execute(insert(models.Tags).values(tag_id = "MYSTISKT", sound_file_id = 4))
    session.execute(insert(models.Tags).values(tag_id = "MYSTISKT", sound_file_id = 5))



    ######## CREATE DOSSIERS ########
    print("-------- creating dossiers --------")
    session.execute(insert(models.Dossier).values(name = "Favoriter"))
    session.execute(insert(models.Dossier).values(name = "Suspekt snack"))

    ######## CREATE UNDER-DOSSIERS ########
    print("-------- creating under-dossiers --------")
    session.execute(insert(models.Dossier).values(name = "Kalle snackar", parent_folder_id = 2))
    session.execute(insert(models.Dossier).values(name = "Länsman snackar", parent_folder_id = 2))


    ######## CONNECTIING FILES TO DOSSIER ########
    print("-------- connecting files to dossiers --------")
    session.execute(insert(models.Folder).values(dossier_id = 1, sound_file_id = 1))
    session.execute(insert(models.Folder).values(dossier_id = 1, sound_file_id = 2))
    session.execute(insert(models.Folder).values(dossier_id = 2, sound_file_id = 3))
    session.execute(insert(models.Folder).values(dossier_id = 3, sound_file_id = 4))
    session.execute(insert(models.Folder).values(dossier_id = 4, sound_file_id = 5))
    session.execute(insert(models.Folder).values(dossier_id = 4, sound_file_id = 6))


    return 200










