import sqlalchemy
import models
import datetime
import time
import base64
import os
import shutil
import dummy_data

from typing import Union
from fastapi import FastAPI, Response, Request
from sqlalchemy import select, insert, update, delete
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine

from Endpoints.helpers import session
from Endpoints.investigations import router1
from Endpoints.dossier import router2
from Endpoints.soundChains import router3
from Endpoints.misc import router4

from Tests import testDossiers
from Tests import testSoundchains
from Tests import testInvestigations
from config import Paths

"""
To run: python3 -m uvicorn main:app --reload
To add on items on webb: http://127.0.0.1:8000/docs
DB browser for sql-lite: app to se database
sql_app.db local database
"""

# Sätt till true under utveckling för just nu rensas databasen efter varje omstart
DEV = True
app = FastAPI()

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

    models.Base.metadata.create_all(bind=engine)

main()
