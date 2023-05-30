import models
import os
import shutil
import DummyData.dummy_data as dummy_data
import json
import math



from fastapi import FastAPI
from sqlalchemy import select, insert
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, engine
from database import SessionLocal, engine

from Endpoints.helpers import session, make_list, Soundclass
from Endpoints.investigations import router1
from Endpoints.dossier import router2
from Endpoints.soundChains import router3
from Endpoints.misc import router4

from Tests import testDossiers
from Tests import testSoundchains
from Tests import testInvestigations
from config import Paths

import numpy as np
from pathlib import Path

import datetime
import time



# Sätt till true under utveckling för just nu rensas databasen efter varje omstart
DEV = True
app = FastAPI()

app.include_router(router1)
app.include_router(router2)
app.include_router(router3)
app.include_router(router4)

models.Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def npy_to_database(sound_file_id:int, npy_file_path:str):
    data = np.load(Path(npy_file_path), allow_pickle=True)

    # Hämtar alla ljudintervall som hör till en ljudfil
    result = session.execute(select(models.SoundInterval.id, models.SoundInterval.start_time).where(models.SoundInterval.sound_file_id == sound_file_id))
    interval_list = []
    for row in result:
        interval_list.append(row)

    sorted_data = sorted(interval_list, key=lambda d: d[1]) # Sorterar dem så att de är i rätt ordning efter start_time

    time = 0
    for row in data:
        interval_id = sorted_data[time][0] # Intervall id
        for type in list(Soundclass):
            session.execute(insert(models.Sound).values(trust_value = float(row[type.value]), sound_class = type.name, sound_interval_id = interval_id))
        time += 1




def cleanUp():
    for investigations in os.listdir(Paths.uploads):
        if investigations == "README.md":
            continue
        for soundchains in os.listdir(os.path.join(Paths.uploads, investigations)):
            if investigations == "1" and soundchains == "1":
                continue
            elif investigations == "5" and soundchains == "5":
                continue
            # else:
            #     file_path = os.path.join(Paths.uploads, investigations, soundchains)
            #     try:
            #         shutil.rmtree(file_path)
            #     except:
            #         print("Something went wrong when removing old files")


def runTests():
    testDossiers.run();
    testSoundchains.run();
    testInvestigations.run();

def initializeFolders():
    if not os.path.isdir(Paths.uploads):
        os.mkdir(Paths.uploads)

def createDummyInvestigation(session: any, timestep: int, investigation_name: str, investigation_id: int):
    with open("./DummyData/investigation" + str(investigation_id) + ".json", "r") as file:
        data = file.read()
    json_data = json.JSONDecoder().decode(data)

    chain_start_time = None
    end_time = None
    for info in json_data:
        t = info["start_time"]
        st_date = datetime.datetime(t["year"], t["month"], t["day"], t["hour"], t["minute"], t["second"])
        d = info["duration"]
        dd = datetime.timedelta(hours=d["hours"], minutes=d["minutes"], seconds=d["seconds"])
        et_date = st_date + dd

        start_time = time.mktime(st_date.timetuple())
        end_time = time.mktime(et_date.timetuple())
        duration = dd.total_seconds()

        if chain_start_time == None:
            chain_start_time = start_time

        id = make_list(session.execute(insert(models.SoundFile).values(
            start_time = start_time,
            end_time = end_time,
            file_name = st_date.strftime("%Y-%m-%d_%H-%M-%S") + ".wav",
            file_state = info["file_state"],
            sound_chain_id = info["sound_chain_id"]
        ).returning(models.SoundFile.id)).fetchall())[0]

        for i in range(math.ceil(duration / timestep)):
            session.execute(insert(models.SoundInterval).values(
                start_time = i * timestep,
                end_time = i * timestep + timestep,
                highest_volume = timestep,
                sound_file_id = id
            ))

        npy_to_database(id, "./DummyData/testNPYfiles/" + info["id"] + ".npy")

    session.execute(insert(models.Investigations).values(name = investigation_name))
    session.execute(insert(models.SoundChain).values(
        start_time = chain_start_time,
        end_time =  end_time,
        investigations_id = investigation_id,
        chain_state = "1"
    ))

def main():
    initializeFolders()
    #runTests()

    models.Base.metadata.create_all(bind=engine)

    if DEV:

        cleanUp()
        dummy_data.insert_dummy(session)
        # createDummyInvestigation(
        #     session=session,
        #     timestep=10,
        #     investigation_name="Case-C01",
        #     investigation_id=5
        # )

        with open("./uploads/1/1/files/fileInfo.json", "r") as file:
            data = file.read()
        json_data = json.JSONDecoder().decode(data)

        for info in json_data:
            id = make_list(session.execute(insert(models.SoundFile).values(
                start_time = info["start_time"],
                end_time = info["end_time"],
                file_name = "uploads/1/1/files/" + info["id"] + ".wav",
                file_state = info["file_state"],
                sound_chain_id = info["sound_chain_id"]
            ).returning(models.SoundFile.id)).fetchall())[0]

            for i in range(math.floor((info["end_time"] - info["start_time"]) / 10)):
                session.execute(insert(models.SoundInterval).values(start_time = i * 10, end_time = i * 10 + 10, highest_volume = 10, sound_file_id = id))

            npy_to_database(id, "./testNPYfiles/" + info["id"] + ".npy")

    origins = [
        "http://localhost:3000",
        "http://0.0.0.0:3000",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router1)
    app.include_router(router2)
    app.include_router(router3)
    app.include_router(router4)

main()
