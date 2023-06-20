from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response, BackgroundTasks
from config import Paths
from .helpers import make_list, session, dummy_model
import models
import datetime
import os
import time

from .analysis import AnalyzeInvestigationTask


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

tasks = {}

@router4.post("/investigations/{id}/analyze")
async def analyze_investigation_soundchains(id: int, background_tasks: BackgroundTasks):
    # Create a new AnalyzeInvestigationTask instance for the investigation ID
    task = AnalyzeInvestigationTask(dummy_model) # Switch out dummy_model to real ML-model.
    tasks[id] = task

    # Execute the analysis function as a background task
    background_tasks.add_task(task.analyze, id)

    return {"message": f"Analysis started for investigation {id}."}

@router4.get("/investigations/{id1}/soundchains/{id2}/analyze")
async def analyze_investigation_progress(id1: int, id2: int):
    task = tasks[id1]
    if task:
        return {"result": task.get_progress(id2)}
    return {"result": None}


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


