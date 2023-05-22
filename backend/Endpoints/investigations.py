from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response
from .helpers import delete_sound_chains, make_list, session
import models

router1 = APIRouter()

""" Hämtar all ivestigations """
@router1.get("/investigations")
async def read_investigations():
    response = session.execute(select(models.Investigations)).fetchall()
    response = make_list(response)
    return response


"""
Skapar en ny investigation.
Input {"name": "namn på nya investigationen"}
"""
@router1.post("/investigations")
async def create_investigations(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'name' behövs"

    if data.get("name") is None:
        return "'name' saknas"

    response = make_list(session.execute(insert(models.Investigations).values(name = data["name"]).returning(models.Investigations)).fetchall())
    return {"id": response[0].id}


"""
Updatera namn på en investigation med ett viss id.
Input {"id": "id:t på investigation",
       "name": "nya namnet på investigation"}
"""
@router1.put("/investigations")
async def change_investigations(request: Request, response: Response):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' och 'name' behövs"

    if data.get("id") is None:
        return "'id' saknas"

    if data.get("name") is None:
        return "'name' saknas"

    result = session.execute(update(models.Investigations).where(models.Investigations.id == data["id"]).values(name = data["name"]))

    if not result.rowcount:
        response.status_code = 410
        return "Error code: givet id finns inte"

    return result


"""
Ta bort en investigation med ett viss id.
Input {"id": "id:t på inestigationen som ska tas bort"}
"""
@router1.delete("/investigations")
async def remove_investigations(request: Request, response: Response):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' behövs"

    if data.get("id") is None:
        return "'id' saknas"

    check = make_list(session.execute(select(models.Investigations).where(models.Investigations.id == data["id"])).fetchall())

    if not check:
        response.status_code = 410
        return "Error code: givet id finns inte"

    # Hämta alla ljudkedjor till utredningen
    sound_chains = make_list(session.execute(select(models.SoundChain.id).where(models.SoundChain.investigations_id == data["id"])).fetchall())
    # Ta bort alla ljudkedjor som finns i utredningen
    delete_sound_chains(sound_chains)

    return session.execute(delete(models.Investigations).where(models.Investigations.id == data["id"]))
