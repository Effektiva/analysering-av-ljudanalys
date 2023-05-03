from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response, File, UploadFile
import models
from typing import List
import audio_metadata
import os
import datetime
import time
from pydub import AudioSegment

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
        #tagList = []

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
            #tags = makeList(session.execute(select(models.Tags)
             #                               .where(models.Tags.sound_file_id == soundFile.id)).fetchall())

            # Sätt ihop en lista med alla taggar utan upprepning
            #for tag in tags:
             #   if tag.tag_id not in tagList:
              #      tagList.append(tag.tag_id)


        dic = {"id": soundchain.id, "startTime": soundchain.start_time, "endTime": soundchain.end_time, "soundClasses": soundClassList, "state": soundchain.chain_state}

        soundChainList.append(dic)


    return soundChainList



# Hjälpfunktion för post som ligger nedanför, hanterar filer som inte matchar på något sätt så att de ändå lägs in (〜￣▽￣)〜
async def wierdFiles(id, files):
    SCID = makeList(session.execute(insert(models.SoundChain)
                                .values(start_time = 1337, investigations_id = id)
                                .returning(models.SoundChain.id)).fetchall())[0]

    file_path = f"parent/{id}/{SCID}/"

    # Skapar map där filerna ska ligga i
    os.mkdir(file_path)

    # Går igenom alla filer och skapar nya soundfiles i databasen samt lägger in dem i vårt interna filsystem
    for file in files:
        content = await file.read()
        session.execute(insert(models.SoundFile).values(file_name = file.filename, sound_chain_id = SCID))
        path_name = file_path + file.filename
        with open(path_name, "wb") as f:
            f.write(content)


# Fixar tid för start och end.
def calc_time(start_date, start_time, audio_len):
    start_year = int(start_date[0])
    start_month = int(start_date[1])
    start_day = int(start_date[2])
    start_hour = int(start_time[0])
    start_min = int(start_time[1])
    start_sec = int(start_time[2])
    time_start = datetime.datetime(start_year, start_month, start_day, start_hour, start_min, start_sec)
    delta_sec = datetime.timedelta(seconds=audio_len.streaminfo.duration)
    time_end = time_start + delta_sec
    datum_start = time.mktime(time_start.timetuple())
    datum_end = time.mktime(time_end.timetuple())
    return (datum_start, datum_end)


# Tar in ett soundclip id och skapar alla ljudinterval
def time_interval(soundFileId, path):
    SoundFile = makeList(session.execute(select(models.SoundFile).where(models.SoundFile.id == soundFileId)).fetchall())[0]
    if not SoundFile:
        return "Something went wrong"

    path = path + f"{SoundFile.file_name}"

    # load the audio file
    audio_file = AudioSegment.from_file(path)

    # set the interval duration in milliseconds
    interval_duration = 10000

    # calculate the number of intervals
    num_intervals = int(audio_file.duration_seconds * 1000 / interval_duration)

    # iterate over the intervals
    for i in range(num_intervals):
        # calculate the start and end time of the interval
        start_time = i * interval_duration
        end_time = (i + 1) * interval_duration

        # get the audio data for the interval
        interval_audio = audio_file[start_time:end_time]

        # calculate the maximum volume of the interval
        max_volume = interval_audio.max_dBFS

        # Skapa nytt tidsintervall
        session.execute(insert(models.SoundInterval).values(start_time = start_time/1000, end_time = end_time/1000, highest_volume = max_volume, sound_file_id = soundFileId))


# Skapar nya ljudkedjor med hjälp av massor av ljudfiler, skapar också ljudfiler
# Indata får gärna se ut såhär tex
# Denna kan inte hantera flera ljudfiler med samma start_time eller överlapp
# INDATA = [{starttime: 120312, endtime: 12973, inv_id: 1, filename: path/filnamn}, {}, {}] # TODO
@router3.post("/investigations/{id}/soundchains")
async def create_investigationsSoundChains(id: int, files: List[UploadFile] = File(...)):

    # Ifall detta är första gången vi lägger in ljudkedjor i investigation
    folderPath = f"parent/{id}"
    print(os.path.isdir(folderPath))
    if not os.path.isdir(folderPath):
        os.mkdir(folderPath)

    call_error = False
    safe_word = []
    file_dic = []

    # Går igenom alla filer som vi har fått
    for file in files:
        content = await file.read()

        # Kollar på innehållet av filen och drar ut när den starta och slutar utifrån innehållet och namnet
        try:
            audio_len = audio_metadata.loads(content)
            start_date = file.filename.split("_")[0].split("-")
            start_time = file.filename.split("_")[1].split("-")
            start_end_time = calc_time(start_date, start_time, audio_len)
            file_dic.append({"start_time": start_end_time[0], "end_time": start_end_time[1], "inv_id": id, "file_name": file.filename, "content": content})

        except:
            #Filnamnet är inte i rätt form på en av filerna eller så kan ljudlängden inte extraherats
            safe_word.append(file)
            call_error = True


    # Om några filer inte har rätt namnform eller att vi inte kan få ut längden av dem på något sätt skapar vi en egen kedja för dem
    if call_error:
        await wierdFiles(id, safe_word)


    sorted_data = sorted(file_dic, key=lambda d: d['start_time'])  # Sorterar listan efter start_time
    last_time = None # Senaste end_time, behövs för att kolla ifall vi ska skapa en ny ljudkedja eller ej
    curr_SCID = None # Nuvarande ljudkedjan vi håller på att bygga nu
    for object in sorted_data:
        # Första ljudfilen skapar ny ljudkedja eller om starttiden inte överensstämmer med nuvarande ljudkedjans sluttid, skapa ny ljudkedja
        if last_time == None or last_time != object["start_time"]:
            curr_SCID = session.execute(insert(models.SoundChain)
                                        .values(start_time = object["start_time"], investigations_id = object["inv_id"])
                                        .returning(models.SoundChain.id)).fetchone()[0]

            file_path = f"parent/{id}/{curr_SCID}/"
            os.mkdir(file_path) # Skapar ny map för kedjan


        path_name = file_path + object["file_name"]
        # Skapar ny ljudfil med innehållet av de vi fick
        with open(path_name, "wb") as f:
            f.write(object["content"])

        # Lägg till ljudfilerna i databasen
        soundFileId = makeList(session.execute(insert(models.SoundFile)
                                               .values(start_time = object["start_time"], end_time = object["end_time"], file_name = object["file_name"], sound_chain_id = curr_SCID)
                                               .returning(models.SoundFile.id)).fetchall())

        # Lägg till tidsintervall för ljudfilerna
        time_interval(soundFileId[0], file_path)

        last_time = object["end_time"]

        # Updatera end_time varje gång så att det blir rätt senare
        session.execute(update(models.SoundChain)
                        .where(models.SoundChain.id == curr_SCID).values(end_time = last_time))
    return 1


# Ta bort en ljudkedja med ett visst id.
@router3.delete("/investigations/{id1}/soundchains")
async def remove_investigationsSoundChains(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' behövs"

    if data.get("id") is None:
        return "'id' Saknas"

    return session.execute(delete(models.SoundChain).where(models.SoundChain.id == data["id"]))




#### Ändra state på en ljudkedja
@router3.put("/investigations/{id}/soundchains")
async def update_state_soundchain(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' och eller 'tag' behövs"

    if data.get("id") is None:
        return "'id' Saknas"

    if data.get("state") is None:
        return "nytt state saknas"

    return session.execute(update(models.SoundChain).where(models.SoundChain.id == data["id"]).values(chain_state = data["state"]))

# Ändra state på en ljudfil

@router3.put("/investigations/{id1}/soundchains/{id2}/soundfiles/{id3}")
async def update_state_soundfile(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' och eller 'tag' behövs"

    if data.get("id") is None:
        return "'id' Saknas"

    if data.get("state") is None:
        return "nytt state saknaas"

    return session.execute(update(models.SoundFile).where(models.SoundFile.id == data["id"]).values(file_state = data["state"]))


# file_name= /parent/ivest/osvosvosv/ljudfil.mp3
# Hämta all data som en ljudkedja har
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
    #tagList = []

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
        #tags = makeList(session.execute(select(models.Tags)
         #                               .where(models.Tags.sound_file_id == soundFile.id)).fetchall())

        # Sätt ihop en lista med alla taggar utan upprepning
        #for tag in tags:
         #   if tag.tag_id not in tagList:
          #      tagList.append(tag.tag_id)


        # Hämtar alla kommentarer som hör till ljudfilen
        comments = makeList(session.execute(select(models.Comments).where(models.Comments.sound_file_id == soundFile.id)).fetchall())

        for comment in comments: # Tar ut tid och text från alla kommentarer
            commentList.append(comment)


        # Detta är hur vi tror att det ska vara (Backendteamet)
        soundFileList.append({"id": soundFile.id, "startTime": soundFile.start_time, "endTime": soundFile.end_time, "fileName": soundFile.file_name, "state": soundFile.file_state, "soundIntervals" : soundIntervalList})


    response = {"id": soundchain.id, "startTime": soundchain.start_time,
                 "endTime": soundchain.end_time, "soundClasses": soundClassList,
                 "state": soundchain.chain_state, "soundFiles": soundFileList, "comments": commentList}



    return response
