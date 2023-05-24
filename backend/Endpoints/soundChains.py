from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, File, UploadFile
from pydub import AudioSegment
from config import Paths
from .helpers import make_list, session, delete_sound_files
from typing import List
import audio_metadata
import os
import datetime
import time
import pathlib
import models

router3 = APIRouter()



""" Hjälpfunktioner för endpoints i denna fil"""

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


# Hjälpfunktion för post som skapar ljudkedjor, hanterar filer som inte matchar på något sätt så att de ändå lägs in (〜￣▽￣)〜
async def weird_files(investigation_id, files):
    soundchain_id = make_list(session.execute(insert(models.SoundChain)
                                .values(start_time = 1337, investigations_id = investigation_id)
                                .returning(models.SoundChain.id)).fetchall())[0]

    # Skapa hela sökvägen (uploads/[Investigation.id]/[Soundchain.id]/files/)
    file_path = os.path.join(Paths.uploads, str(investigation_id), str(soundchain_id), "files")
    pathlib.Path(file_path).mkdir(parents=True, exist_ok=True)

    # Går igenom alla filer och skapar nya soundfiles i databasen samt lägger in dem i vårt interna filsystem
    for file in files:
        content = await file[0].read()
        file_id = make_list(session.execute(insert(models.SoundFile).values(file_name = file[0].filename, sound_chain_id = soundchain_id, file_state = "0").returning(models.SoundFile.id)))[0]
        file_format = file[0].filename.split(".")[1]
        path_name = file_path + "/" + str(file_id) + "." + file_format
        with open(path_name, "wb") as f:
            f.write(file[1])

        time_interval(file_id, path_name)


# Tar in ett soundclip id och skapar alla ljudinterval
def time_interval(soundFileId, path):
    SoundFile = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.id == soundFileId)).fetchall())[0]
    if not SoundFile:
        return "Something went wrong"

    path = path

    # Ladda in ljudfilen
    audio_file = AudioSegment.from_file(path)

    # Intervall-tiden är 10 sekunder (10000 milisekunder)
    interval_duration = 10000

    # Räkna ut antalet intervall i ljudfilen
    num_intervals = int(audio_file.duration_seconds * 1000 / interval_duration)

    # Sista intervallet, som kan vara kortare än 10 sekunder
    modulo = int(audio_file.duration_seconds * 1000 % interval_duration)

    # Iterera över alla intervall
    for i in range(num_intervals):
        # Räkna ut start och sluttiden för givna intervallet
        start_time = i * interval_duration
        end_time = (i + 1) * interval_duration

        # Få ljuddatan för det givna intervallet
        interval_audio = audio_file[start_time:end_time]
        # Räkna ut den högsta decibell nivån för intervallet
        max_volume = interval_audio.max_dBFS

        # Skapa nytt tidsintervall
        if SoundFile.start_time:
            start_time = SoundFile.start_time + (start_time / 1000)
            end_time = SoundFile.start_time + (end_time / 1000)
        else:
            start_time = start_time / 1000
            end_time = end_time / 1000
        session.execute(insert(models.SoundInterval).values(start_time = start_time, end_time = end_time, highest_volume = max_volume, sound_file_id = soundFileId))

    # Fixa det sista ljudinetervallet
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




"""
Hämta alla ljudkedjor (med ljudklasser och tags) som tillhör en viss investigation
id: investigation id:t
"""
@router3.get("/investigations/{id}/soundchains")
async def read_investigations(id: int):
    sound_chains = make_list(session.execute(select(models.SoundChain).where(models.SoundChain.investigations_id == id)).fetchall())
    sound_chain_list = []
    for sound_chain in sound_chains:
        sound_files = make_list(session.execute(select(models.SoundFile)
                                          .where(models.SoundFile.sound_chain_id == sound_chain.id)).fetchall())

        sound_class_list = []
        for sound_file in sound_files:
            # hämta ut alla ljud intervall som ljudfilen har
            sound_intervals = make_list(session.execute(select(models.SoundInterval)
                                                  .where(models.SoundInterval.sound_file_id == sound_file.id)))

            # Gå igenom alla ljudintervall för att hitta vilka ljudklasser som de innehåller
            for intervall in sound_intervals:
                sound_class = make_list(session.execute(select(models.Sound)
                                            .where(models.Sound.sound_interval_id == intervall.id)).fetchall())
                if sound_class:
                    for sound in sound_class:
                        if sound.sound_class not in sound_class_list: # Lägg till de ljudklasser som inte har lagts till än
                            sound_class_list.append(sound.sound_class)

        dict = {"id": sound_chain.id, "startTime": sound_chain.start_time, "endTime": sound_chain.end_time, "soundClasses": sound_class_list, "state": sound_chain.chain_state}
        sound_chain_list.append(dict)

    return sound_chain_list




"""
Skapar nya ljudkedjor med hjälp av massor av ljudfiler, skapar också ljudfiler
id: investigation id:t
files: de ljjdfiler som laddats upp till utredningen
"""
@router3.post("/investigations/{id}/soundchains")
async def create_sound_chains(id: int,
                                           files: List[UploadFile] = File(...)):
    if not files:
        return "Inga filer skickade"

    # Skapa uppladdningsmappen för utredningen om den inte redan finns
    if not os.path.isdir(Paths.uploads + f"/{id}"):
        os.mkdir(Paths.uploads + f"/{id}")

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
                             "inv_id": id,
                             "file_name": file.filename,
                             "content": content})

        # Om filnamnet inte är i rätt form på en av filerna eller så kan ljudlängden inte extraheras
        except:
            safe_word.append((file, content))
            call_error = True

    # Om några filer inte har rätt namnform eller att vi inte kan få ut längden av dem på något
    # sätt skapar vi en egen kedja för dem
    if call_error:
        await weird_files(id, safe_word) # (hjälpfunktion ovan)

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
            files_path = os.path.join(Paths.uploads, str(id), str(soundchain_id), "files")
            pathlib.Path(files_path).mkdir(parents=True, exist_ok=True)

        # Lägg till ljudfilerna i databasen
        sound_file_id = make_list(session.execute(insert(models.SoundFile).values(start_time = file["start_time"],
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

        # Lägg till tidsintervall för ljudfilerna (hjälpfunktion ovan)
        time_interval(sound_file_id[0], file_path)
        last_time = file["end_time"]

        # Updatera end_time varje gång så att det blir rätt senare
        session.execute(update(models.SoundChain).where(models.SoundChain.id == soundchain_id).values(end_time = last_time))
    return 1



"""
Ta bort en ljudkedja med ett visst id.
Input {"id": "id:t på ljudkedjan som ska tas bort"}
id1: investigation id
"""
@router3.delete("/investigations/{id1}/soundchains")
async def remove_sound_chains(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' behövs"

    if data.get("id") is None:
        return "'id' Saknas"

    # Ta bort ljudfilerna i ljudkedjan
    sound_files = make_list(session.execute(select(models.SoundFile.id).where(models.SoundFile.sound_chain_id == data["id"])).fetchall())
    delete_sound_files(sound_files)
    return session.execute(delete(models.SoundChain).where(models.SoundChain.id == data["id"]))



"""
Ändra state på en ljudkedja
Input {"id": "id:t på ljudkedjan",
       "state: "nya statet"}
id1: investigation id
"""
@router3.put("/investigations/{id1}/soundchains")
async def update_state_sound_chain(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' och eller 'tag' behövs"

    if data.get("id") is None:
        return "'id' Saknas"

    if data.get("state") is None:
        return "nytt state saknas"

    return session.execute(update(models.SoundChain).where(models.SoundChain.id == data["id"]).values(chain_state = data["state"]))



"""
Ändra state på en ljudfil
Input {"id": "id:t på ljudkedjan",
       "state: "nya statet"}
id1: investigation id
id2: soundchain id
id3: soundfile id
"""
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



"""
Hämta all data som en ljudkedja har
id1: investigation id
id2: soundchain id
"""
@router3.get("/investigations/{id1}/soundchains/{id2}")
async def read_sound_chain_data(id1: int, id2: int):
    sound_chain = make_list(session.execute(select(models.SoundChain)
                                          .where(models.SoundChain.id == id2)).fetchall())[0]

    sound_files = make_list(session.execute(select(models.SoundFile)
                                          .where(models.SoundFile.sound_chain_id == id2)).fetchall())
    sound_class_list = []
    comment_list = []
    sound_file_list = []

    # Gå igenom alla ljudfiler som ljudkedjan har
    for file in sound_files:
        # hämta ut alla ljud intervall som ljudfilen har
        sound_intervals = make_list(session.execute(select(models.SoundInterval)
                                                  .where(models.SoundInterval.sound_file_id == file.id)))
        sound_interval_list = []
        sound_classes_in_file = []

        # Gå igenom alla ljudintervall för att hitta vilka ljudklasser som de innehåller
        for interval in sound_intervals:
            sound_interval_object = {"start_time" : interval.start_time,
                                   "end_time" : interval.end_time,
                                   "highest_volume" : interval.highest_volume}
            sound_class = make_list(session.execute(select(models.Sound)
                                         .where(models.Sound.sound_interval_id == interval.id)).fetchall())
            sounds_list = []
            if sound_class:
                for sound in sound_class:
                    sounds_list.append({"sound_class" : sound.sound_class, "trust_value" : sound.trust_value})
                    if sound.sound_class not in sound_class_list:
                        sound_class_list.append(sound.sound_class)
                    if sound.sound_class not in sound_classes_in_file:
                        sound_classes_in_file.append(sound.sound_class)
            sound_interval_object["sounds"] = sounds_list

            sound_interval_list.append(sound_interval_object)

        # Hämtar alla kommentarer som hör till ljudfilen
        comments = make_list(session.execute(select(models.Comments)
                                            .where(models.Comments.sound_file_id == file.id)).fetchall())

        for comment in comments: # Tar ut tid och text från alla kommentarer
            comment_list.append(comment)

        sound_file_list.append({"id": file.id,
                              "startTime": file.start_time,
                              "endTime": file.end_time,
                              "fileName": file.file_name,
                              "state": file.file_state,
                              "soundClasses": sound_classes_in_file,
                              "soundIntervals" : sound_interval_list})

    response = {"id": sound_chain.id, "startTime": sound_chain.start_time,
                 "endTime": sound_chain.end_time, "soundClasses": sound_class_list,
                 "state": sound_chain.chain_state, "soundFiles": sound_file_list, "comments": comment_list}

    return response
