from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, Request, Response
import models

from .helpers import makeList, session

router1 = APIRouter()

# Hämtar all ivestigations
@router1.get("/investigations")
async def read_investigations():
    response = session.execute(select(models.Investigations)).fetchall()
    response = makeList(response)
    return response


# Skapar en ny investigation med namn "name"
@router1.post("/investigations")
async def create_investigations(request: Request):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'name' behövs"

    if data.get("name") is None:
        return "'name' saknas"

    # Fråga om vi ska returna hela objectet eller bara id, otydligt med bara id enligt mig
    response = makeList(session.execute(insert(models.Investigations).values(name = data["name"]).returning(models.Investigations)).fetchall())


    return {"id": response[0].id}

# Updatera namn på en investigation med ett viss id (id: int, name: str)
@router1.put("/investigations")
async def insert_investigations(request: Request, response: Response):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' och 'name' behövs"

    if data.get("id") is None:
        return "'id' saknas"

    if data.get("name") is None:
        return "'name' saknas"

    result = session.execute(update(models.Investigations).where(models.Investigations.id == data["id"]).values(name = data["name"]))

    if not result.rowcount: # inte false här
        response.status_code = 406
        return "Error code: givet id finns inte"

    return result

# Ta bort en investigation med ett viss id (id: int)
@router1.delete("/investigations")
async def remove_investigations(request: Request, response: Response):
    try:
        data = await request.json()
    except:
        return "Ingen data skickas, 'id' behövs"

    if data.get("id") is None:
        return "'id' saknas"

    check = makeList(session.execute(select(models.Investigations).where(models.Investigations.id == data["id"])).fetchall())

    if not check:
        response.status_code = 410
        return "The item does not exist"

    # Den ger inget fel ifall man ger den ett id som inte finns, är det ok?
    return session.execute(delete(models.Investigations).where(models.Investigations.id == data["id"]))
