from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request
from fastapi.responses import FileResponse
from .helpers import make_list, session, delete_folders_dossier
import models
import csv


router2 = APIRouter()


"""Hämtar alla dossierer, även underdossierer, med tillhörande ljudfiler """
@router2.get("/dossier")
def get_dossier():
    # Hämtar alla dossierer som inte har underdossierer
    over_dossier = make_list(session.execute(select(models.Dossier)
                                    .where(models.Dossier.parent_folder_id == None)).fetchall())

    # Lista med alla dossierer som ska skickas tillbaka
    response = []

    # Loopa igenom alla dossierer som inte har underdossierer
    for dossier in over_dossier:
        # Hämta alla ljudfiler som dossiern har
        soundfiles = make_list(session.execute(select(models.Folder)
                                             .where(models.Folder.dossier_id == dossier.id)).fetchall())

        # Sätt in alla ljudfilers id och namn i en lista
        sounds = []
        for files in soundfiles:
            top_sound = make_list(session.execute(select(models.SoundFile)
                                         .where(models.SoundFile.id == files.sound_file_id)).fetchall())

            sound_dict = {"id": top_sound[0].id, "fileName": top_sound[0].file_name}
            sounds.append(sound_dict)

        # Hämta alla underdossierer till denna dossier
        under_dossier = make_list(session.execute(select(models.Dossier)
                                         .where(models.Dossier.parent_folder_id == dossier.id)).fetchall())
        # Lägg in dem i en lista med dicts
        under_dossier = []
        for under_doss in under_dossier:
            under_soundfile = make_list(session.execute(select(models.Folder)
                                                       .where(models.Folder.dossier_id == under_doss.id)).fetchall())

            # Hämta all ljudfiler till underdossiern
            under_sounds = []
            for under_file in under_soundfile:
                under_sound = make_list(session.execute(select(models.SoundFile)
                                         .where(models.SoundFile.id == under_file.sound_file_id)).fetchall())

                sound_dict = {"id": under_sound[0].id, "fileName": under_sound[0].file_name}
                under_sounds.append(sound_dict)

            new_under_dic = {"id": under_doss.id, "name": under_doss.name, "soundFiles": under_sounds}
            under_dossier.append(new_under_dic)


        new_dic = {"id": dossier.id, "name": dossier.name, "soundFiles": sounds, "subDossier": under_dossier}
        response.append(new_dic)

    return response


"""
Skapa en ny dossier
Input {"name": "namn på ny dossier"}
"""
@router2.post("/dossier")
async def create_dossier(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'name' behövs"

    if data.get("name") is None:
        return "'name' saknas"

    responseId = make_list(session.execute(insert(models.Dossier).values(name = data["name"]).returning(models.Dossier.id)).fetchall())[0]
    return {"id": responseId}


"""
Updatera namnet på en dossier
Input {"id" : "id:t på dossiern som ska ändras",
       "name": "nya namnet på dossiern"}
"""
@router2.put("/dossier")
async def change_dossier(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' och 'name' behövs"

    if data.get("id") is None:
        return "'id' saknas"

    if data.get("name") is None:
        return "'name' saknas"

    return session.execute(update(models.Dossier).where(models.Dossier.id == data["id"]).values(name = data["name"]))

"""
Ta bort en dossier med ett viss id
Input {"id": "id:t på dossier som ska tas bort"}
"""
@router2.delete("/dossier")
async def delete_dossier(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' behövs"

    if data.get("id") is None:
        return "'id' saknas"

    # Ta bort underdossier
    under_dossier = make_list(session.execute(delete(models.Dossier).where(models.Dossier.parent_folder_id == data["id"]).returning(models.Dossier.id)).fetchall())
    under_dossier.append(data["id"])

    for dossier in under_dossier:
        session.execute(delete(models.Folder).where(models.Folder.dossier_id == dossier))

    # Ta bort folder (ljudfil kopplat till dossier)
    delete_folders_dossier(under_dossier)
    return session.execute(delete(models.Dossier).where(models.Dossier.id == data["id"]))


"""
Skapa en underdossier till en dossier med ett viss id.
Input {"name": "namn på ny dossier"}
parent_id: id:t på överdossiern
"""
@router2.post("/dossier/{parent_id}")
async def create_underdossier(request: Request, parent_id : int):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'name' behövs"

    if data.get("name") is None:
        return "'name' saknas"

    check_parent = make_list(session.execute(select(models.Dossier).where(models.Dossier.id == parent_id)).fetchall())
    if not check_parent:
        return "'parent_id' finns inte i databasen"

    elif check_parent[0].parent_folder_id is not None:
        return "Du får inte skapa en underdossier till en underdossier (┬┬﹏┬┬)"

    response = make_list(session.execute(insert(models.Dossier).values(name = data["name"], parent_folder_id = parent_id).returning(models.Dossier)).fetchall())
    return {"id": response[0].id}


"""
Lägg till ett ljudklipp i en dossier.
Input {"id": "id:t på dossier"}
id: id:t på ljudfilen
"""
@router2.post("/dossier/add/{id}")
async def create_sound_in_dossier(request: Request, id: int):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' för dossiern behövs"

    if data.get("id") is None:
        return "'id' för dossiern saknas"

    already_in = make_list(session.execute(select(models.Folder).where(models.Folder.dossier_id == data["id"], models.Folder.sound_file_id == id)).fetchall())
    if already_in:
        return "Filen finns redan i dossiern"

    response = make_list(session.execute(insert(models.Folder).values(dossier_id = data["id"], sound_file_id = id).returning(models.Folder)).fetchall())
    return {"id": response[0].id}



"""
Ta bort ett ljudklipp från en dossier
Input {"id": "id:t på dossier"}
id: id:t på ljudfilen
"""
@router2.delete("/dossier/delete/{id}")
async def delete_soundInDossier(request: Request, id: int):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' för dossiern behövs"

    if data.get("id") is None:
        return "'id' för dossiern saknaas"

    return session.execute(delete(models.Folder).where(models.Folder.dossier_id == data["id"], models.Folder.sound_file_id == id))


"""
Exporterar en dossier med ett viss id i CSV format
id: id:t på dossiern
"""
@router2.get("/dossier/export/{id}")
async def export_dossier(id: int):
    dossier_name = make_list(session.execute(select(models.Dossier.name).where(models.Dossier.id == id)).fetchall())[0]
    under_dossier = make_list(session.execute(select(models.Dossier).where(models.Dossier.parent_folder_id == id)).fetchall())
    under_files = make_list(session.execute(select(models.Folder.sound_file_id).where(models.Folder.dossier_id == id)).fetchall())

    files = []
    # Hämtar alla ljudifler som har ett id som finns i dossiern
    for file in under_files:
        new_files = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.id == file)).fetchall())
        for file in new_files:
            files.append(file)

    # Hämtar alla filer ifrån alla underdossierer
    for doss in under_dossier:
        under_files = make_list(session.execute(select(models.Folder.sound_file_id).where(models.Folder.dossier_id == doss.id)).fetchall())
        for under_file in under_files:
            new_files = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.id == under_file)).fetchall())
            for file in new_files:
                files.append(file)

    # CSV file grejer, python doc https://docs.python.org/3/library/csv.html
    dossier_csv = dossier_name + ".csv"
    with open(dossier_csv, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile, quoting=csv.QUOTE_NONE)
        csvwriter.writerow(["Kommentar "] + ["Tid in i klipp"] + ["Ljudklipp "])
        for file in files:

            comments = make_list(session.execute(select(models.Comments).where(models.Comments.sound_file_id == file.id)).fetchall())

            # Om ljdfilen inte har något kommentar kopplat till sig
            if not comments:
                csvwriter.writerow(['----'] + ['----'] + [file.file_name])

            else:
                for comment in comments:
                    csvwriter.writerow([comment.text] + [comment.time_file] + [file.file_name])

    return FileResponse(dossier_csv)
