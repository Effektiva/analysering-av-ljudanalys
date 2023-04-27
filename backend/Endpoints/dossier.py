import csv
from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response
from fastapi.responses import FileResponse
import models
import os


from .helpers import makeList, session

router2 = APIRouter()

# Hämtar alla dossierer, även underdossierer
@router2.get("/dossier")
def read_dossier():
    # Hämtar alla dossierer som inte har barn :D
    over = makeList(session.execute(select(models.Dossier)
                                    .where(models.Dossier.parent_folder_id == None)).fetchall())

    # Lista med alla dossierer som ska skickas tillbaka
    response = []

    # Loopa igenom alla dossierer som inte har barn
    for doss in over:
        # Hämta alla ljudfiler som dossiern har
        soundfile = makeList(session.execute(select(models.Folder)
                                             .where(models.Folder.dossier_id == doss.id)).fetchall())

        # Sätt in alla ljudfilers id och namn i en lista
        sounds = []
        for sound in soundfile:
            topsounds = makeList(session.execute(select(models.SoundFile)
                                         .where(models.SoundFile.id == sound.sound_file_id)).fetchall())

            soundDic = {"id": topsounds[0].id, "fileName": topsounds[0].file_name}
            sounds.append(soundDic)

        # Hämta alla underdossierer till denna dossier
        under = makeList(session.execute(select(models.Dossier)
                                         .where(models.Dossier.parent_folder_id == doss.id)).fetchall())
        # Lägg in dem i en lista med dicts
        underdossier = []
        for underdoss in under:
            under_soundfile = makeList(session.execute(select(models.Folder)
                                                       .where(models.Folder.dossier_id == underdoss.id)).fetchall())

            # Hämta all ljudfiler till underdossiern
            undersounds = []
            for sound in under_soundfile:
                USounds = makeList(session.execute(select(models.SoundFile)
                                         .where(models.SoundFile.id == sound.sound_file_id)).fetchall())

                soundDic = {"id": USounds[0].id, "fileName": USounds[0].file_name}
                undersounds.append(soundDic)

            new_under_dic = {"id": underdoss.id, "name": underdoss.name, "soundFiles": undersounds}
            underdossier.append(new_under_dic)


        new_dic = {"id": doss.id, "name": doss.name, "soundFiles": sounds, "subDossier": underdossier}
        response.append(new_dic)

    return response


# Skapa en ny dossier, med namn "name" (name : str)
@router2.post("/dossier")
async def create_dossier(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'name' behövs"

    if data.get("name") is None:
        return "'name' saknas"

    responseId = makeList(session.execute(insert(models.Dossier).values(name = data["name"]).returning(models.Dossier.id)).fetchall())[0]

    return {"id": responseId}

# Updatera namnet på en dossier med ett viss id (id: int, new_name: str)
@router2.put("/dossier")
async def insert_dossier(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' och 'name' behövs"

    if data.get("id") is None:
        return "'id' saknas"

    if data.get("name") is None:
        return "'name' saknas"

    return session.execute(update(models.Dossier).where(models.Dossier.id == data["id"]).values(name = data["name"]))

# Ta bort en dossier med ett viss id, tar också bort underdossierer till den dossiern (id: int)
@router2.delete("/dossier")
async def delete_dossier(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' behövs"

    if data.get("id") is None:
        return "'id' saknas"

    session.execute(delete(models.Dossier).where(models.Dossier.parent_folder_id == data["id"]))
    return session.execute(delete(models.Dossier).where(models.Dossier.id == data["id"]))

# Skapa en underdossier till en dossier med ett viss id. Ge underdossiern namnet "name" (name: str ,parent_id : int)
@router2.post("/dossier/{parent_id}")
async def create_underdossier(request: Request ,parent_id : int):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'name' behövs"

    if data.get("name") is None:
        return "'name' saknas"

    checkParent = makeList(session.execute(select(models.Dossier).where(models.Dossier.id == parent_id)).fetchall())
    if not checkParent:
        return "'parent_id' finns inte i databasen"

    elif checkParent[0].parent_folder_id is not None:
        return "Du får inte skapa en underdossier till en underdossier (┬┬﹏┬┬)"

    response = makeList(session.execute(insert(models.Dossier).values(name = data["name"], parent_folder_id = parent_id).returning(models.Dossier)).fetchall())

    return {"id": response[0].id}

# Lägg till ett ljudklipp i en dossier (d_id: int, s_id: int)
@router2.post("/dossier/add/{id}")
async def create_soundInDossier(request: Request, id: int):
    # id är ljudklipps id
    # data["id"] är id på dossiern
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' för dossiern behövs"

    if data.get("id") is None:
        return "'id' för dossiern saknas"

    already_in = makeList(session.execute(select(models.Folder).where(models.Folder.dossier_id == data["id"], models.Folder.sound_file_id == id)).fetchall())
    print(already_in)
    if already_in:
        return "File already in dossier"

    session.execute(insert(models.Folder).values(dossier_id = data["id"], sound_file_id = id))
    return 200


# Ta bort ett ljudklipp från en dossier (d_id: int, s_id: int)
@router2.delete("/dossier/delete/{id}")
async def delete_soundInDossier(request: Request, id: int):
    # id är ljudklipps id
    # data["id"] är id på dossiern
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' för dossiern behövs"

    if data.get("id") is None:
        return "'id' för dossiern saknaas"

    return session.execute(delete(models.Folder).where(models.Folder.dossier_id == data["id"], models.Folder.sound_file_id == id))


# Exporterar en dossier med ett viss id. Ska vara i CVS fil format HUR SKA RETURNEN VARA? VAR SKA FILEN SPARAS?
@router2.get("/dossier/export/{id}")
async def read_exportDossier(id: int):
    dossier_name = makeList(session.execute(select(models.Dossier.name).where(models.Dossier.id == id)).fetchall())[0]

    underdossier = makeList(session.execute(select(models.Dossier).where(models.Dossier.parent_folder_id == id)).fetchall())

    soundfilesids = makeList(session.execute(select(models.Folder.sound_file_id).where(models.Folder.dossier_id == id)).fetchall())


    files = []

    # Hämtar alla ljudifler som har ett id som finns i dossiern
    for fileid in soundfilesids:
        new_files = makeList(session.execute(select(models.SoundFile).where(models.SoundFile.id == fileid)).fetchall())
        for file in new_files:
            files.append(file)

    # Hämtar alla filer ifrån alla underdossierer
    for doss in underdossier:
        fileIDS = makeList(session.execute(select(models.Folder.sound_file_id).where(models.Folder.dossier_id == doss.id)).fetchall())
        for fileID in fileIDS:
            new_files = makeList(session.execute(select(models.SoundFile).where(models.SoundFile.id == fileID)).fetchall())
            for file in new_files:
                files.append(file)


    # CSV file grejer, kolla python doc ifall ni osäker hur det fungerar https://docs.python.org/3/library/csv.html
    dossier_csv = dossier_name + ".csv"
    with open(dossier_csv, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile, quoting=csv.QUOTE_NONE)
        csvwriter.writerow(["Kommentar "] + ["Tid "] + ["Ljudklipp "])
        for file in files:
            comments = makeList(session.execute(select(models.Comments).where(models.Comments.sound_file_id == file.id)).fetchall())
            # Om ljdfilen inte har något kommentar kopplat till sig
            if not comments:
                csvwriter.writerow([''] + [''] + [file.file_name])

            else:
                for comment in comments:
                    csvwriter.writerow([comment.text] + [comment.time - file.start_time] + [file.file_name])





    print(csvfile)
    return FileResponse(dossier_csv)


    # Make CVS file format and send back alot of stuff (╯°□°）╯︵ ┻━┻
    return 200
