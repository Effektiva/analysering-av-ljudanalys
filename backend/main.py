import sqlalchemy
from sqlalchemy import select, insert, update, delete
from fastapi import FastAPI, Response, Request
from typing import Union
from fastapi.middleware.cors import CORSMiddleware

import models
from database import SessionLocal, engine
from Endpoints.helpers import session
from Endpoints.investigations import router1
from Endpoints.dossier import router2
from Endpoints.soundChains import router3
from Endpoints.misc import router4
import dummy_data

import datetime
import time
import base64

import os
import shutil

# Sätt till true under utveckling för just nu rensas databasen efter varje omstart
DEV = True

if DEV:
    directory = "./parent"

    for file_name in os.listdir(directory):
        file_path = os.path.join(directory, file_name)
        try:
            shutil.rmtree(file_path)

        except:
            print("Something went wrong when removing old files")


app = FastAPI()

app.include_router(router1)
app.include_router(router2)
app.include_router(router3)
app.include_router(router4)

models.Base.metadata.create_all(bind=engine)

"""
To run: python3 -m uvicorn main:app --reload
To add on items on webb: http://127.0.0.1:8000/docs
DB browser for sql-lite: app to se database
sql_app.db local database
"""

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

#session = SessionLocal() # Ligger i Endpoints/helpers nu



def temp():
    print("Dummy thick data")

temp()
dummy_data.insert_dummy(session)


# Real
# Kanske inte ska ha med usersettings


# Takes a response object and make sure that it can be sent back. Object should be with a fetchall()


@app.get("/brewCoffe")
async def funnystuff(response: Response):
    print("WHY?")
    response.status_code = 418
    return "You funny guy UwU"





######################## TEST FÖR ALLA VETTIGA FUNKTIONER #################################

# Testar create_investigations, read_investigations, insert_investigations, remove_investigations
def test_invest():
    print("------------ Create 3 investigations ------------ ")
    print(create_investigations("Inv1"))
    print(create_investigations("Inv2"))
    print(create_investigations("Inv3"))


    print("---------- GET ALL investigations -----------")
    print("Should be three with name Inv1, Inv2, Inv3")
    getinvest = read_investigations()
    for i in getinvest:
        print((i[0].id, i[0].name))

    print("------------ CHANGE NAME ON Inv1 ------------ ")
    print(insert_investigations(1, "New_Inv1"))


    print("---------- GET ALL investigations -----------")
    print("Should be three with name New_Inv1, Inv2, Inv3")
    getinvest = read_investigations()
    for i in getinvest:
        print((i[0].id, i[0].name))

    print("---------- DELETE Inv2 -----------")
    print(remove_investigations(2))

    print("---------- GET ALL investigations -----------")
    print("Should be two with name New_Inv1, Inv3")
    getinvest = read_investigations()
    for i in getinvest:
        print((i[0].id, i[0].name))



# Testar create_dossier, read_dossier, insert_dossier, create_underdossier, delete_dossier
def test_dossier():
    print("------------ Create 3 Dossiers ------------ ")
    print(create_dossier("Doss1"))
    print(create_dossier("Doss2"))
    print(create_dossier("Doss3"))

    print("---------- GET ALL dossiers -----------")
    print("Should be three with name Doss1, Doss2, Doss3")
    getdoss = read_dossier()
    for i in getdoss:
        print((i[0].id, i[0].name))

    print("------------ CHANGE NAME ON Doss1 ------------ ")
    print(insert_dossier(1, "New_Doss1"))

    print("---------- GET ALL dossiers -----------")
    print("Should be three with name New_Doss1, Doss2, Doss3")
    getdoss = read_dossier()
    for i in getdoss:
        print((i[0].id, i[0].name))


    print("------------ Create 2 Under_Dossiers ------------ ")
    print(create_underdossier("UnderDoss1", 1))
    print(create_underdossier("UnderDoss2", 2))

    print("---------- GET ALL dossiers -----------")
    print("Should be three with name New_Doss1, Doss2, Doss3, UnderDoss1, Underdoss2")
    getdoss = read_dossier()
    for i in getdoss:
        print((i[0].id, i[0].name), i[0].parent_folder_id)


    print("---------- GET ALL overdossiers -----------")
    print("Should be three with name New_Doss1, Doss2, Doss3")
    getdoss = read_overdossier()
    for i in getdoss:
        print((i[0].id, i[0].name, i[0].parent_folder_id))

    print("---------- DELETE Doss2 -----------")
    print(delete_dossier(2))

    print("---------- GET ALL dossiers -----------")
    print("Should be three with name New_Doss1, Doss3, UnderDoss1")
    getdoss = read_dossier()
    for i in getdoss:
        print((i[0].id, i[0].name, i[0].parent_folder_id))


def test_soundchains():
    print("------------ Create 1 Investigations and 2 soundchains ------------ ")
    print(create_investigations("Inv1"))
    sound_files = [{"start_time": "08:10", "end_time": "09:10", "inv_id": "1", "file_name": "File1"},
    {"start_time": "09:10", "end_time": "09:20", "inv_id": "1", "file_name": "File2"},
    {"start_time": "09:25", "end_time": "09:55", "inv_id": "1", "file_name": "File3"}]
    print(create_investigationsSoundChains(sound_files))

    print(read_investigations()[0][0].id)

    print("---------- GET ALL soundchains -----------")
    print("Should be two with (ID: 1, Inv_id: Inv1, Star_time: 08:10, End_time: 09:20) (ID: 2, Inv_id: Inv1, Star_time: 09:25, End_time: 09:55)")
    getsoundchains = read_investigationsSoundChains(1)
    for i in getsoundchains:
        print((f"ID: {i[0].id} Inv_id: {i[0].investigations_id} Start_time: {i[0].start_time} End_time: {i[0].end_time}"))

    print("---------- Update soundchains (EJ FIXAT) -----------")

    print("---------- DELETE Soundchain with ID: 2 -----------")
    print(remove_investigationsSoundChains(2))

    print("---------- GET ALL soundchains -----------")
    print("Should be one with (ID: 1, Inv_id: Inv1, Star_time: 08:10, End_time: 09:20)")
    getsoundchains = read_investigationsSoundChains(1)
    for i in getsoundchains:
        print((f"ID: {i[0].id} Inv_id: {i[0].investigations_id} Start_time: {i[0].start_time} End_time: {i[0].end_time}"))

    print("-------------- ADD COMMENT ----------------")
    print(create_comment(1, "08:20", "Kommentar1"))
    print(create_comment(1, "08:30", "Kommentar2"))
    print("---------- READ Soundchain data -----------")
    print("Sould be (ID: 1, Inv_id: Inv1, Star_time: 08:10, End_time: 09:20)")
    data = read_soundchaindata(1,1)
    print(data)
    chain = data[0][0]
    print((f"ID: {chain.id} Inv_id: {chain.investigations_id} Start_time: {chain.start_time} End_time: {chain.end_time}"))
    print("-------------- Soundfiles data -------------")
    for i in range(1, len(data)):
        chain = data[i][0]

        if isinstance(data[i][0], models.SoundFile):
            print((f"ID: {chain.id} Sound_Chain_ID: {chain.sound_chain_id} Start_time: {chain.start_time} End_time: {chain.end_time} File_name: {chain.file_name}"))
        elif isinstance(data[i][0], models.Comments):
             print((f"ID: {chain.sound_chain_id} Sound_Chain_ID: {chain.sound_chain_id} Time: {chain.time} Text: {chain.text}"))
    print()





def test():
    #test_invest()
    #test_dossier()
    test_soundchains()
    return 0

#test()
