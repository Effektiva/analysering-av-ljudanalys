from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response
import models

from .helpers import makeList, session

router4= APIRouter()

# Hämtar alla ljudklasser som vi har i vårt system
@router4.get("/sound_class")
async def read_soundClass():
    return makeList(session.execute(select(models.SoundClass)).fetchall())


#
@router4.get("/investigations/{id}/soundchains/analyze")
async def analyze_investigationSoundchains():
    # Doesnt work yet (❁´◡`❁)
    return 0


# Skapa en kommentar som är kopplad med en ljudkedja och har en tidpunkt samt text. sound_chain_id: int, time: str, text: str)
@router4.post("/investigations/{id1}/sound/{id2}/comments")
async def create_comment(request: Request, id1: int, id2: int):
    response = "Inget ljudklipp här :("
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, saker behövs"

    # Ljudkedjan i fråga
    soundchain = makeList(session.execute(select(models.SoundChain).where(models.SoundChain.id == id2)).fetchall())
    if not soundchain:
        return response
    chain_starttime = soundchain[0].start_time

    # Tid för komentaren in i ljudkedjan
    comment_time = int(data["time"]) + chain_starttime

    # Ljudfilerna i den angivna ljudkedjan
    soundfiles = makeList(session.execute(select(models.SoundFile).where(models.SoundFile.sound_chain_id == id2)).fetchall())
    for file in soundfiles:
        if file.start_time <= comment_time <= file.end_time:

            # Tid för kommentaren in i ljudfilen
            file_time = comment_time - file.start_time
            response = makeList(session.execute(insert(models.Comments).values(time = file_time, text = data["text"], sound_file_id = file.id).returning(models.Comments)).fetchall())
            break
    return response



# HÄMTA KOMENTARER FÖR ETT SPECIFIKT LJUDKLIPP
@router4.get("/investigations/{id1}/soundchains/{id2}/soundfiles/{id3}/comments")
async def remove_comment(id1: int, id2: int, id3: int):
    return makeList(session.execute(select(models.Comments).where(models.Comments.sound_file_id == id3)).fetchall())


# Skapa put för kommentarer så man kan redigera
@router4.put("/investigations/{id1}/sound/{id2}/comments")
async def remove_comment(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, saker behövs"


    return session.execute(update(models.Comments).where(models.Comments.id == data["id"]).values(text = data["text"]))




# Ta bort en kommentar
@router4.delete("/investigations/{id1}/sound/{id2}/comments")
async def remove_comment(request: Request):
    try:
        data = await request.json()
    except:
        return "Inget data skickas, 'id' behövs"

    return session.execute(delete(models.Comments).where(models.Comments.id == data["id"]))


# Hämta ljuddata som är kopplats med en ljudfils id TODO TA BORT!
@router4.get("investigations/{id1}/soundchains/{id2}/soundfiles/{id3}")
async def read_sounddata(id3 = int):
    return session.execute(select(models.SoundFile).where(models.SoundFile.id == id3)).fetchall()