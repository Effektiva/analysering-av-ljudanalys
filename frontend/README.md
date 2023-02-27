# Frontend

Här är projektets frontend. När appen väl är startad kommer sidorna auto-uppdatera när du redigerar en fil. För att starta appen kör du:

> docker compose up frontend

Sen öppnar du [http://localhost:3000](http://localhost:3000).

### Lägga till node.js paket
1. Uppdatera [./package.json](../frontend/package.json).
2. Bygg om image för frontend: `docker compose build frontend`
3. Starta backenden som vanligt.

## Mer info

[Next.js](https://nextjs.org/docs), [React](https://reactjs.org/docs/getting-started.html), [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/), [Axios](https://axios-http.com/docs/intro).
