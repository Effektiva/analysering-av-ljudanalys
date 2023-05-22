from database import SessionLocal

import models
from sqlalchemy import select, delete
import itertools


from enum import Enum


session = SessionLocal()

# Takes a response object and make sure that it can be sent back. Object should be with a fetchall()
def makeList(object):
    listObject = []
    for row in object:
        listObject.append(row[0])

    return listObject




# " ------- Hjälpfunktioner för att ta bort -------"

# Ta bort ljudkedjor
def delete_sound_chains(sound_chains):
    files = []
    # Hämta alla ljudfiler
    for chain in sound_chains:
        file = makeList(session.execute(select(models.SoundFile.id).where(models.SoundFile.sound_chain_id == chain)).fetchall())
        session.execute(delete(models.SoundChain).where(models.SoundChain.id == chain))

        files.append(file)

    sound_files = list(itertools.chain.from_iterable(files)) # Flat out list of lists

    delete_sound_files(sound_files)



# Ta bort ljudfiler
def delete_sound_files(sound_files):
    for sound_file in sound_files:
        session.execute(delete(models.SoundFile).where(models.SoundFile.id == sound_file))
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
        interval = makeList(session.execute(select(models.SoundInterval.id).where(models.SoundInterval.sound_file_id == sound_file)).fetchall())
        intervals.append(interval)
    interval_list = list(itertools.chain.from_iterable(intervals)) # Flat out list of lists
    for interval in interval_list:
        session.execute(delete(models.SoundInterval).where(models.SoundInterval.id == interval))
    delete_sounds(interval_list)



# Ta bort sounds
def delete_sounds(interval_list):
    for interval in interval_list:
        session.execute(delete(models.Sound).where(models.Sound.sound_interval_id == interval))

# Ta bort tags
def delete_tags(sound_files):
    for sound_file in sound_files:
        session.execute(delete(models.Tags).where(models.Tags.sound_file_id == sound_file))

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

