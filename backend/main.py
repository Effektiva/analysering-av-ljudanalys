import models
import os
import shutil
import dummy_data

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
            session.execute(insert(models.Sound).values(trust_value = row[type.value], sound_class = type.name, sound_interval_id = interval_id))
        time += 1




def cleanUp():
    for investigations in os.listdir(Paths.uploads):
        if investigations == "README.md":
            continue
        for soundchains in os.listdir(os.path.join(Paths.uploads, investigations)):
            if investigations == "1" and soundchains == "1":
                continue
            else:
                file_path = os.path.join(Paths.uploads, investigations, soundchains)
                try:
                    shutil.rmtree(file_path)
                except:
                    print("Something went wrong when removing old files")


def runTests():
    testDossiers.run();
    testSoundchains.run();
    testInvestigations.run();

def initializeFolders():
    if not os.path.isdir(Paths.uploads):
        os.mkdir(Paths.uploads)

def main():
    initializeFolders()
    #runTests()

    models.Base.metadata.create_all(bind=engine)

    if DEV:

        cleanUp()
        dummy_data.insert_dummy(session)

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
