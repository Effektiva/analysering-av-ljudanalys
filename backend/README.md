# Backend

Här är projektets backend. När appen väl är startad kommer den att uppdatera sig när du gör ändringar i filerna. För att starta appen kör du:

> docker compose up backend

Sen når du API:ts end-points via [http://localhost:8000](http://localhost:8000).

### Lägga till python paket
1. Uppdatera [./requirements.txt](./requirements.txt).
2. Bygg om image för backend: `docker compose build backend`
3. Starta backenden som vanligt.

## Mer info

[SQLALchemy](https://docs.sqlalchemy.org/en/20/intro.html), [FastAPI](https://fastapi.tiangolo.com/tutorial/), [Uvicorn](https://www.uvicorn.org/).
