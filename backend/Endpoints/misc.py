from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response, BackgroundTasks, WebSocket
from config import Paths
from .helpers import make_list, session, analyse
from .taskState import Task
import models
import datetime
import os
import time


router4 = APIRouter()


"""
Hämta vilken ljudkejda och utredning en ljufdil hör till
id: id:t på ljudfilen
"""
@router4.get("/info/soundfile/{id}")
async def get_soundfile_info(id: int):
    sound_file = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.id == id)).fetchall())

    # Den önskade ljudfilen finns inte
    if len(sound_file) == 0:
        return "No such soundfile"

    sound_chain = make_list(session.execute(select(models.SoundChain).where(models.SoundChain.id == sound_file[0].sound_chain_id)).fetchall())
    investigation = sound_chain[0].investigations_id

    response = {"investigation": investigation, "soundchain": sound_file[0].sound_chain_id}
    return response



""" Hämtar alla ljudklasser som vi har i vårt system """
@router4.get("/sound_class")
async def read_soundClass():
    return make_list(session.execute(select(models.SoundClass)).fetchall())



# TODO: Need to send to frontend when analysis is done!
""" Analysera ljudkedjor (EJ IMPLEMENTERAD) """
# @router4.get("/investigations/{id}/analyze")
# async def analyze_investigation_soundchains(id: int, background_tasks: BackgroundTasks):
#     sound_chains = make_list(session.execute(select(models.SoundChain).where(models.SoundChain.investigations_id == id)).fetchall())

#     for sound_chain in sound_chains:
#         state = sound_chain.chain_state
#         if state == "0":
#             sound_files = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.sound_chain_id == sound_chain.id)).fetchall())
#             for file in sound_files:

#                 ###### INSERT ML-FUNKTION HERE ######
#                 # The function should take a file id and return the corresponding analysed numpy data.
#                 background_tasks.add_task(analyse, file.id)
#                 # data = dummy_model(file.id) # Fake analysis!

#                 # Send the analysed data to the database.
#                 # TODO: This is when analysis is done and should not happen in the background
#                 # not in this api request.
#                 # npy_to_database(file.id, data)

#     response = "success"
#     return response

tasks = []

@router4.post("/investigations/{id}/analyze")
async def analyze_investigation_soundchains(id: int, background_tasks: BackgroundTasks):
    sound_chains = make_list(session.execute(select(models.SoundChain).where(models.SoundChain.investigations_id == id)).fetchall())

    for sound_chain in sound_chains:
        state = sound_chain.chain_state
        if state == "0":
            sound_files = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.sound_chain_id == sound_chain.id)).fetchall())
            for file in sound_files:
                task = Task(file.id)
                tasks.append(task)
                background_tasks.add_task(task.background_work)

    response = "ACCEPTED"
    return response

@router4.get("/investigations/{id}/analyze")
async def analyze_status(id: int):
    response = []
    for task in tasks:
        response.append({"id": task.get_id(), "percentage": task.get_percentage()})

    return response

@router4.websocket_route("/investigation/{id}/analyze")
async def hello(websocket: WebSocket):
    await websocket.accept()
    response = []
    for task in tasks:
        response.append({"id": task.get_id(), "percentage": task.get_percentage()})

    await websocket.send_text(response)
    await websocket.close()


    # await websocket.accept()
    # await websocket.send_text("Router Hello!")
    # response = await websocket.receive_text()
    # print(response)
    # await websocket.close()
    # print("Router Closed")




"""
Skapa en kommentar
Input {"fileID": "id:t kommentaren ska vara kopplad till",
       "time": "sekunder in i ljudfilen kommentaren ligger",
       "text": "kommentars-texten"}
id1: investigation id:t
id2: soundchain id:t
"""
@router4.post("/investigations/{id1}/soundchains/{id2}/comments")
async def create_comment(request: Request, id1: int, id2: int):
    response = "Inget ljudklipp här :("
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, saker behövs"

    # Ljudkedjan
    soundchain = make_list(session.execute(select(models.SoundChain).where(models.SoundChain.id == id2)).fetchall())
    if not soundchain:
        return response
    chain_starttime = soundchain[0].start_time

    # Ljudfilen
    soundfile = soundchain = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.id == data["fileId"])).fetchall())
    if not soundfile:
        return response

    # Tid för komentaren in i ljudfilen
    file_time = int(data["time"])
    if file_time > soundfile[0].end_time - soundfile[0].start_time:
        return response

    # TId för kommentaren in i ljudkedjan
    chain_time = (soundfile[0].start_time + file_time) - chain_starttime

    # Tid när kommentaren är skapad
    time_stamp = datetime.datetime.now()
    time_zone_add = datetime.timedelta(hours=2)  # Rätt tidszon
    new_time_stamp = time_stamp + time_zone_add
    time_stamp_unix = time.mktime(new_time_stamp.timetuple())


    # Lägg till kommentaren i databasen
    comment = make_list(session.execute(insert(models.Comments).values(time_file = file_time,
                                                time_chain = chain_time,
                                                text = data["text"],
                                                time_stamp = time_stamp_unix,
                                                sound_file_id = soundfile[0].id).returning(models.Comments)).fetchall())[0]

    return {"comment": comment}



"""
Hämta kommentarer för ett specifikt ljudklipp
id1: investigation id:t
id2: soundchain id:t
id3: soundfile id:t
"""
@router4.get("/investigations/{id1}/soundchains/{id2}/soundfiles/{id3}/comments")
async def select_comment(id1: int, id2: int, id3: int):
    return make_list(session.execute(select(models.Comments).where(models.Comments.sound_file_id == id3)).fetchall())



"""
Redigera texten för en kommentar
Input {"id": "id:t till kommentaren",
       "text": "nya kommentars-texten"}
id1: investigation id:t
id2: soundchain id:t
"""
@router4.put("/investigations/{id1}/soundchains/{id2}/comments")
async def update_comment(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, saker behövs"

    return session.execute(update(models.Comments).where(models.Comments.id == data["id"]).values(text = data["text"]))



"""
Ta bort en kommentar
Input {"id": "id:t till kommentaren"}
id1: investigation id:t
id2: soundchain id:t
"""
@router4.delete("/investigations/{id1}/soundchains/{id2}/comments")
async def remove_comment(request: Request):
    try:
        data = await request.json()
    except:
        return "Inget data skickas, 'id' behövs"

    return session.execute(delete(models.Comments).where(models.Comments.id == data["id"]))



"""
Skicka ljuddata för ljudklippet med det givna id:t
id1: investigation id:t
id2: soundchain id:t
id3: soundfile id:t
"""
@router4.get("/investigations/{id1}/soundchains/{id2}/soundfiles/{id3}")
async def read_sounddata(id1: int, id2: int, id3: int):
    soundFile = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.id == id3)).fetchall())

    if not soundFile:
        return "Filen finns inte"

    soundFile = soundFile[0]
    fileFormat = soundFile.file_name.split(".")[1]

    path = Paths.uploads + f"{id1}/{id2}/files/{soundFile.id}." + fileFormat

    if not os.path.isfile(path):
        return "Vägen till filen gick inte att hitta"

    with open(path, "rb") as file:
        contents = file.read()

    # Returnera ljudfilen
    return Response(contents, media_type=f"audio/" + fileFormat)


