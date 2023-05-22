from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response, File, UploadFile
import models
from typing import List
import audio_metadata
import os
import datetime
import time
import pathlib
from pydub import AudioSegment
from config import Paths

from .helpers import makeList, session, delete_sound_files

router3 = APIRouter()

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

    path = path

    # load the audio file
    audio_file = AudioSegment.from_file(path)

    # set the interval duration in milliseconds
    interval_duration = 10000


    # calculate the number of intervals
    num_intervals = int(audio_file.duration_seconds * 1000 / interval_duration)

    # last interval that might be shorter then 10 seconds
    modulo = int(audio_file.duration_seconds * 1000 % interval_duration)

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
        if SoundFile.start_time:
            start_time = SoundFile.start_time + (start_time / 1000)
            end_time = SoundFile.start_time + (end_time / 1000)
        else:
            start_time = start_time / 1000
            end_time = end_time / 1000
        session.execute(insert(models.SoundInterval).values(start_time = start_time, end_time = end_time, highest_volume = max_volume, sound_file_id = soundFileId))

    # Fix the last interval
    if modulo != 0:
        start_time = num_intervals * interval_duration
        end_time = start_time + modulo
        interval_audio = audio_file[start_time:end_time]
        max_volume = interval_audio.max_dBFS
        # Skapa nytt tidsintervall
        if SoundFile.start_time:
            start_time = SoundFile.start_time + (start_time / 1000)
            end_time = SoundFile.start_time + (end_time / 1000)
        else:
            start_time = start_time / 1000
            end_time = end_time / 1000
        session.execute(insert(models.SoundInterval).values(start_time = start_time, end_time = end_time, highest_volume = max_volume, sound_file_id = soundFileId))



# Skapar nya ljudkedjor med hjälp av massor av ljudfiler, skapar också ljudfiler
# Indata får gärna se ut såhär tex
# Denna kan inte hantera flera ljudfiler med samma start_time eller överlapp
# INDATA = [{starttime: 120312, endtime: 12973, inv_id: 1, filename: path/filnamn}, {}, {}]
@router3.post("/investigations/{investigation_id}/soundchains")
async def create_investigationsSoundChains(investigation_id: int,
                                           files: List[UploadFile] = File(...)):
    if not files:
        return "Inga filer skickade"

    # Skapa uppladdningsmappen för utredningen om den inte redan finns
    if not os.path.isdir(Paths.uploads + f"/{investigation_id}"):
        os.mkdir(Paths.uploads + f"/{investigation_id}")

    call_error = False
    safe_word = []
    file_dic = []
    for file in files:
        content = await file.read()

        # Kollar på innehållet av filen och drar ut när den starta och slutar utifrån
        # innehållet och namnet
        try:
            audio_len = audio_metadata.loads(content)
            start_date = file.filename.split("_")[0].split("-")
            start_time = file.filename.split("_")[1].split("-")
            start_end_time = calc_time(start_date, start_time, audio_len)
            file_dic.append({"start_time": start_end_time[0],
                             "end_time": start_end_time[1],
                             "inv_id": investigation_id,
                             "file_name": file.filename,
                             "content": content})

        # Om filnamnet inte är i rätt form på en av filerna eller så kan ljudlängden inte extraheras
        except:
            safe_word.append((file, content))
            call_error = True

    # Om några filer inte har rätt namnform eller att vi inte kan få ut längden av dem på något
    # sätt skapar vi en egen kedja för dem
    if call_error:
        await weird_files(investigation_id, safe_word)

    files_path = None
    sorted_data = sorted(file_dic, key=lambda d: d['start_time'])  # Sorterar listan efter start_time
    last_time = None # Senaste end_time, behövs för att kolla ifall vi ska skapa en ny
                     # ljudkedja eller ej
    soundchain_id = None # Nuvarande ljudkedjan vi håller på att bygga nu
    for file in sorted_data:
        # Första ljudfilen skapar ny ljudkedja eller om starttiden inte överensstämmer med nuvarande
        # ljudkedjans sluttid, skapa ny ljudkedja
        if last_time == None or last_time != file["start_time"]:
            soundchain_id = session.execute(insert(models.SoundChain).values(start_time = file["start_time"],
                                                                             investigations_id = file["inv_id"],
                                                                             chain_state = "0")
                                                                     .returning(models.SoundChain.id)).fetchone()[0]

            # Skapa hela sökvägen (uploads/[Investigation.id]/[Soundchain.id]/files/)
            files_path = os.path.join(Paths.uploads, str(investigation_id), str(soundchain_id), "files")
            pathlib.Path(files_path).mkdir(parents=True, exist_ok=True)

        # Lägg till ljudfilerna i databasen
        sound_file_id = makeList(session.execute(insert(models.SoundFile).values(start_time = file["start_time"],
                                                                                 end_time = file["end_time"],
                                                                                 file_name = file["file_name"],
                                                                                 file_state = "0",
                                                                                 sound_chain_id = soundchain_id)
                                                                         .returning(models.SoundFile.id)).fetchall())

        # Spara ljudfilen lokalt i backenden
        file_format = file["file_name"].split(".")[1]
        file_path = os.path.join(files_path, str(sound_file_id[0]) + "." + file_format)
        with open(file_path, "wb") as f:
            f.write(file["content"])

        # Lägg till tidsintervall för ljudfilerna
        time_interval(sound_file_id[0], file_path)

        last_time = file["end_time"]

        # Updatera end_time varje gång så att det blir rätt senare
        session.execute(update(models.SoundChain).where(models.SoundChain.id == soundchain_id).values(end_time = last_time))
    return 1

# Hjälpfunktion för post som ligger nedanför, hanterar filer som inte matchar på något sätt så att de ändå lägs in (〜￣▽￣)〜
async def weird_files(investigation_id, files):
    soundchain_id = makeList(session.execute(insert(models.SoundChain)
                                .values(start_time = 1337, investigations_id = investigation_id)
                                .returning(models.SoundChain.id)).fetchall())[0]

    # Skapa hela sökvägen (uploads/[Investigation.id]/[Soundchain.id]/files/)
    file_path = os.path.join(Paths.uploads, str(investigation_id), str(soundchain_id), "files")
    pathlib.Path(file_path).mkdir(parents=True, exist_ok=True)

    # Går igenom alla filer och skapar nya soundfiles i databasen samt lägger in dem i vårt interna filsystem
    for file in files:
        content = await file[0].read()
        file_id = makeList(session.execute(insert(models.SoundFile).values(file_name = file[0].filename, sound_chain_id = soundchain_id, file_state = "0").returning(models.SoundFile.id)))[0]
        file_format = file[0].filename.split(".")[1]
        path_name = file_path + "/" + str(file_id) + "." + file_format
        with open(path_name, "wb") as f:
            f.write(file[1])

        time_interval(file_id, path_name)


# Ta bort en ljudkedja med ett visst id.
@router3.delete("/investigations/{id1}/soundchains")
async def remove_investigationsSoundChains(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' behövs"

    if data.get("id") is None:
        return "'id' Saknas"

    # Ta bort ljudfilerna i ljudkedjan och folders (dossier kopplat till ljudfil)
    sound_files = makeList(session.execute(select(models.SoundFile.id).where(models.SoundFile.sound_chain_id == data["id"])).fetchall())
    delete_sound_files(sound_files)
    return session.execute(delete(models.SoundChain).where(models.SoundChain.id == data["id"]))

# Ändra state på en ljudkedja
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

# Hämta all data som en ljudkedja har
@router3.get("/investigations/{id1}/soundchains/{id2}")
async def read_soundchaindata(id1: int, id2: int):
    soundchain = makeList(session.execute(select(models.SoundChain)
                                          .where(models.SoundChain.id == id2)).fetchall())[0]

    soundfiles = makeList(session.execute(select(models.SoundFile)
                                          .where(models.SoundFile.sound_chain_id == id2)).fetchall())
    soundClassList = []
    commentList = []
    soundFileList = []

    # Gå igenom alla ljudfiler som ljudkedjan har
    for file in soundfiles:
        # hämta ut alla ljud intervall som ljudfilen har
        soundIntervals = makeList(session.execute(select(models.SoundInterval)
                                                  .where(models.SoundInterval.sound_file_id == file.id)))
        soundIntervalList = []
        soundClassesInFile = []

        # Gå igenom alla ljudintervall för att hitta vilka ljudklasser som de innehåller
        for interval in soundIntervals:
            soundIntervalObject = {"start_time" : interval.start_time,
                                   "end_time" : interval.end_time,
                                   "highest_volume" : interval.highest_volume}
            soundClass = makeList(session.execute(select(models.Sound)
                                         .where(models.Sound.sound_interval_id == interval.id)).fetchall())
            soundsList = []
            if soundClass:
                for sound in soundClass:
                    soundsList.append({"sound_class" : sound.sound_class, "trust_value" : sound.trust_value})
                    if sound.sound_class not in soundClassList:
                        soundClassList.append(sound.sound_class)
                    if sound.sound_class not in soundClassesInFile:
                        soundClassesInFile.append(sound.sound_class)
            soundIntervalObject["sounds"] = soundsList

            soundIntervalList.append(soundIntervalObject)

        # Hämtar alla kommentarer som hör till ljudfilen
        comments = makeList(session.execute(select(models.Comments)
                                            .where(models.Comments.sound_file_id == file.id)).fetchall())

        for comment in comments: # Tar ut tid och text från alla kommentarer
            commentList.append(comment)

        soundFileList.append({"id": file.id,
                              "startTime": file.start_time,
                              "endTime": file.end_time,
                              "fileName": file.file_name,
                              "state": file.file_state,
                              "soundClasses": soundClassesInFile,
                              "soundIntervals" : soundIntervalList})

    response = {"id": soundchain.id, "startTime": soundchain.start_time,
                 "endTime": soundchain.end_time, "soundClasses": soundClassList,
                 "state": soundchain.chain_state, "soundFiles": soundFileList, "comments": commentList}

    return response
