from database import SessionLocal
from sqlalchemy import select, delete, insert
from enum import Enum
import models
import itertools
import numpy as np
from pathlib import Path

session = SessionLocal()

"""
Tar ett response objekt och ser till att det kan bli skickat.
Objekten borde skickas in med fetchall()
"""
def make_list(object):
    listObject = []
    for row in object:
        listObject.append(row[0])

    return listObject


""" De enumen vi bryr oss om från numpyfilerna """
class Soundclass(Enum):
    SPEECH = 0
    WHISPERING = 15
    SHOUT = 8
    YELL = 11
    SCREAMING = 14
    LAUGHTER = 16
    CRYING = 22
    COUGH = 47
    CRACK = 440
    SLAP = 467
    BREAKING = 470
    CRUSHING = 478
    MUSIC = 137
    TELEVISION = 524
    ALARM = 388
    TELEPHONE = 389
    RINGTONE = 391
    ALARM_CLOCK = 395
    RADIO = 525
    VEHICLE = 300
    CARALARM = 310
    TRAFFIC = 327
    EXPLOSION = 426
    GUNSHOT = 427
    BOOM = 436
    DOOR = 354




""" ------- Hjälpfunktioner för att ta bort ------- """

# Ta bort ljudkedjor
def delete_sound_chains(sound_chains):
    files = []
    # Hämta alla ljudfiler
    for chain in sound_chains:
        file = make_list(session.execute(select(models.SoundFile.id).where(models.SoundFile.sound_chain_id == chain)).fetchall())
        session.execute(delete(models.SoundChain).where(models.SoundChain.id == chain))

        files.append(file)

    sound_files = list(itertools.chain.from_iterable(files)) # Flat out list of lists

    # Ta bort alla ljudfiler i en ljudkedja som tas bort
    delete_sound_files(sound_files)



# Ta bort ljudfiler
def delete_sound_files(sound_files):
    for sound_file in sound_files:
        session.execute(delete(models.SoundFile).where(models.SoundFile.id == sound_file))

    # Ta bort folders (ljudfil i dossier), kommentarer, ljudintervall och taggar
    delete_folders_files(sound_files)
    delete_comments(sound_files)
    delete_sound_intervall(sound_files)
    delete_tags(sound_files)


# Ta bort folders via ljudfil
def delete_folders_files(sound_files):
    for sound_file in sound_files:
        session.execute(delete(models.Folder).where(models.Folder.sound_file_id == sound_file))


# Ta bort folders via dossier
def delete_folders_dossier(dossier_list):
    for dossier in dossier_list:
        session.execute(delete(models.Folder).where(models.Folder.dossier_id == dossier))


# Ta bort kommentarer
def delete_comments(sound_files):
    for sound_file in sound_files:
        session.execute(delete(models.Comments).where(models.Comments.sound_file_id == sound_file))


# Ta bort ljudinterval
def delete_sound_intervall(sound_files):
    intervals = []
    for sound_file in sound_files:
        interval = make_list(session.execute(select(models.SoundInterval.id).where(models.SoundInterval.sound_file_id == sound_file)).fetchall())
        intervals.append(interval)
    interval_list = list(itertools.chain.from_iterable(intervals)) # Flat out list of lists
    for interval in interval_list:
        session.execute(delete(models.SoundInterval).where(models.SoundInterval.id == interval))

    # Ta bort sounds
    delete_sounds(interval_list)



# Ta bort sounds
def delete_sounds(interval_list):
    for interval in interval_list:
        session.execute(delete(models.Sound).where(models.Sound.sound_interval_id == interval))

# Ta bort tags
def delete_tags(sound_files):
    for sound_file in sound_files:
        session.execute(delete(models.Tags).where(models.Tags.sound_file_id == sound_file))


# Send numpy data to database
def npy_to_database(sound_file_id: int, data):
    # Hämtar alla ljudintervall som hör till en ljudfil
    result = session.execute(select(
        models.SoundInterval.id, models.SoundInterval.start_time
    )).where(models.SoundInterval.sound_file_id == sound_file_id)
    interval_list = []
    for row in result:
        interval_list.append(row)

    # Sorterar dem så att de är i rätt ordning efter start_time
    sorted_data = sorted(interval_list, key=lambda d: d[1])

    time = 0
    for row in data:
        interval_id = sorted_data[time][0]
        for type in list(Soundclass):
            session.execute(insert(models.Sound).values(
                trust_value = float(row[type.value]),
                sound_class = type.name,
                sound_interval_id = interval_id
            ))
        time += 1

# Dummy ML-model
def dummy_model(sound_file_id: int):
    npy_file_path = "../DummyData/testNPYfiles" + str(sound_file_id)
    data = np.load(Path(npy_file_path), allow_pickle=True)
    return data
