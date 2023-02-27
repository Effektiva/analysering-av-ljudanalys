# Analysering av Ljudanalys TDDD96

Kandidatprojekt av grupp PUM08.

![Ramverk](./.ramverk.png "Ramverk")

Diagrammet finns [här](https://drive.google.com/file/d/1TUQ0p8aGgBi0_mzQ6fKzZpqUxUxs17Jm/view?usp=sharing).

## Quickstart

Detta är en snabbguide för att komma igång. Se [denna readme](./docker) för mer ingående detaljer om Docker.

1. Bygg docker images för frontend/backend `docker compose build`.
2. Starta frontend/backend containers `docker compose up`.
3. Surfa till frontenden på [http://localhost:3000/](http://localhost:3000/)

Du behöver bara bygga om när nya paket ska installeras. Både frontenden och backenden bör auto-uppdatera vid ändringar i källkoden, så förmodligen måste du inte starta om containrarna särskilt ofta. 
