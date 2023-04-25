from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response
import models

from .helpers import makeList, session

router3= APIRouter()


# Hämta alla ljudkedjor (med ljudklasser och tags) som tillhör en viss investigation
@router3.get("/investigations/{id}/soundchains")
async def read_investigationsSoundChains(id: int):

    soundChains = makeList(session.execute(select(models.SoundChain).where(models.SoundChain.investigations_id == id)).fetchall())
    soundChainList = []

    for soundchain in soundChains:
        soundfiles = makeList(session.execute(select(models.SoundFile)
                                          .where(models.SoundFile.sound_chain_id == soundchain.id)).fetchall())

        soundClassList = []
        tagList = []

        for soundFile in soundfiles:
            # hämta ut alla ljud intervall som ljudfilen har
            soundIntervals = makeList(session.execute(select(models.SoundInterval)
                                                  .where(models.SoundInterval.sound_file_id == soundFile.id)))

            # Gå igenom alla ljudintervall för att hitta vilka ljudklasser som de innehåller
            for soundInter in soundIntervals:
                soundClass = makeList(session.execute(select(models.Sound)
                                            .where(models.Sound.sound_interval_id == soundInter.id)).fetchall())
                if soundClass:
                    for sound in soundClass:
                        if sound.sound_class not in soundClassList: # Lägg till de ljudklasser som inte har lagts till än
                            soundClassList.append(sound.sound_class)

            # Hämta alla taggar som är kopplade med ljudfilen
            tags = makeList(session.execute(select(models.Tags)
                                            .where(models.Tags.sound_file_id == soundFile.id)).fetchall())

            # Sätt ihop en lista med alla taggar utan upprepning
            for tag in tags:
                if tag.tag_id not in tagList:
                    tagList.append(tag.tag_id)


        dic = {"id": soundchain.id, "startTime": soundchain.start_time, "endTime": soundchain.end_time, "tags": soundClassList, "state": tagList}

        soundChainList.append(dic)


    return soundChainList


# Skapar nya ljudkedjor med hjälp av massor av ljudfiler, skapar också ljudfiler
# Indata får gärna se ut såhär tex
# Denna kan inte hantera flera ljudfiler med samma start_time eller överlapp
# INDATA = [{starttime: 120312, endtime: 12973, inv_id: 1, filename: path/filnamn}, {}, {}] # TODO
@router3.post("/investigations/{id}/soundchains")
async def create_investigationsSoundChains(id: int, request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas" # Kolla vad vi ska få för data för guds
    # id är investigation id

    # Vi kanske får in en lista med ljudfilsnamn

    # Vi hämtar ut start och endtime



    sorted_data = sorted(data, key=lambda d: d['start_time'])  # Sorterar listan efter start_time
    last_time = None # Senaste end_time, behövs för att kolla ifall vi ska skapa en ny ljudkedja eller ej
    curr_SCID = None # Nuvarande ljudkedjan vi håller på att bygga nu
    for object in sorted_data:
        # Första ljudfilen skapar ny ljudkedja eller om starttiden inte överensstämmer med nuvarande ljudkedjans sluttid, skapa ny ljudkedja
        if last_time == None or last_time != object["start_time"]:
            curr_SCID = session.execute(insert(models.SoundChain)
                                        .values(start_time = object["start_time"], investigations_id = object["inv_id"])
                                        .returning(models.SoundChain.id)).fetchone()[0]

        # Lägg till ljudfilerna i databasen
        session.execute(insert(models.SoundFile)
                        .values(start_time = object["start_time"], end_time = object["end_time"], file_name = object["file_name"], sound_chain_id = curr_SCID))

        last_time = object["end_time"]

        # Updatera end_time varje gång så att det blir rätt senare
        session.execute(update(models.SoundChain)
                        .where(models.SoundChain.id == curr_SCID).values(end_time = last_time))
    return 1


# Ta bort en ljudkedja med ett visst id.
@router3.delete("/investigations/{id}/soundchains")
async def remove_investigationsSoundChains(id: int):
    return session.execute(delete(models.SoundChain).where(models.SoundChain.id == id))




#### Sätta taggar på varje ljudifl som finns i den valda ljudkedjan
@router3.put("/investigations/{id}/soundchains")
async def update_investigationsSoundChains(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' och eller 'tag' behövs"

    if data.get("id") is None:
        return "'id' Saknas"


    if data.get("tags"):
        sound_chain = makeList(session.execute(select(models.SoundFile).where(models.SoundFile.sound_chain_id == data["id"])))

        for file in sound_chain:
            session.execute(delete(models.Tags).where(models.Tags.sound_file_id == file.id))

            for tag in data["tags"]:
                session.execute(insert(models.Tags).values(tag_id = tag, sound_file_id = file.id))
        return "Taggar tillagda"

    else:
        return "'tags' saknas"


# file_name= /parent/ivest/osvosvosv/ljudfil.mp3
# Hämta all data som en ljudkedja har TODO lägg till att ljudintervallen med repsketive ljud  och trust value
@router3.get("/investigations/{id1}/soundchains/{id2}")
async def read_soundchaindata(id1: int, id2: int):
    # Data från ljudkedjan
    soundchain = makeList(session.execute(select(models.SoundChain)
                                          .where(models.SoundChain.id == id2)).fetchall())[0]

    # Ljudfilerna i ljudkedjan
    soundfiles = makeList(session.execute(select(models.SoundFile)
                                          .where(models.SoundFile.sound_chain_id == id2)).fetchall())
    # Lista med alla ljudklasser i ljudkedjan
    soundClassList = []

    # Lista med alla taggar i ljudkedjan (ex avlyssnad och analyserad)
    tagList = []

    # Lista med alla kommentarer till ljudfilerna
    commentList = []

    # Om vi ska skicka med ljudfilerna eller ej
    soundFileList = []

    # Gå igenom alla ljudfiler som ljudkedjan har
    for soundFile in soundfiles:
        # hämta ut alla ljud intervall som ljudfilen har
        soundIntervals = makeList(session.execute(select(models.SoundInterval)
                                                  .where(models.SoundInterval.sound_file_id == soundFile.id)))
        soundIntervalList = []


        # Gå igenom alla ljudintervall för att hitta vilka ljudklasser som de innehåller
        for soundInter in soundIntervals:
            soundIntervalObject = {"start_time" : soundInter.start_time, "end_time" : soundInter.end_time, "highest_volume" : soundInter.highest_volume}
            soundClass = makeList(session.execute(select(models.Sound)
                                         .where(models.Sound.sound_interval_id == soundInter.id)).fetchall())
            if soundClass:
                soundsList = []
                for sound in soundClass:
                    soundsList.append({"sound_class" : sound.sound_class, "trust_value" : sound.trust_value})
                    if sound.sound_class not in soundClassList: # Lägg till de ljudklasser som inte har lagts till än
                        soundClassList.append(sound.sound_class)
                soundIntervalObject["sounds"] = soundsList
            soundIntervalList.append(soundIntervalObject)

        # Hämta alla taggar som är kopplade med ljudfilen
        tags = makeList(session.execute(select(models.Tags)
                                        .where(models.Tags.sound_file_id == soundFile.id)).fetchall())

        # Sätt ihop en lista med alla taggar utan upprepning
        for tag in tags:
            if tag.tag_id not in tagList:
                tagList.append(tag.tag_id)


        # Hämtar alla kommentarer som hör till ljudfilen
        comments = makeList(session.execute(select(models.Comments).where(models.Comments.sound_file_id == soundFile.id)).fetchall())

        for comment in comments: # Tar ut tid och text från alla kommentarer
            commentList.append(comment)


        # Detta är hur vi tror att det ska vara (Backendteamet)
        soundFileList.append({"id": soundFile.id, "startTime": soundFile.start_time, "endTime": soundFile.end_time, "file_name": soundFile.file_name, "sound_intervals" : soundIntervalList})


    response = {"id": soundchain.id, "startTime": soundchain.start_time,
                 "endTime": soundchain.end_time, "tags": soundClassList,
                 "state": tagList, "soundFiles": soundFileList, "comments": commentList}



    return response