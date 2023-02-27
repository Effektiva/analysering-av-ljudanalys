# Docker
Dockerfiler för de images som används i frontend/backend containrarna ligger här. Förhoppningen är att man aldrig kommer behöver röra dessa, utan att det räcker med att redigera det som ligger under [../frontend/](../frontend) och [../backend/](../backend). Dessa två mappar kommer att "synkas" med containrarna, vilket gör att du kan ändra på koden utanför containern men att det ändå uppdateras i containern också. En översikt av vad containrarna innehåller i skrivande stund syns i [../.ramverk.png](../.ramverk.png). Containrarna behöver inte kunna prata med varandra, dom pratar via hosten.

En viktig sak att komma ihåg är att **ändringar som görs i en aktiverad container kommer inte sparas**. Varje gång containern startar utgår den ifrån den *image* som specas i dockerfilen, som nämndes ovan. Vill man därför installera nya paket, som ska finnas kvar efter en omstart av containern, måste man göra detta via dockerfilen och bygga om imagen.

## Dockerfiler vs docker-compose
[./docker/Dockerfile-backend](./Dockerfile-backend) och [./docker/Dockerfile-frontend](./Dockerfile-frontend) är de *images* som backend/frontend containern kommer att starta upp med. Mer eller mindre så bestämmer den vad containern ska innehålla och vad den ska köra när den startas (se längst ner i dockerfilen).  

[./docker-compose.yml](../docker-compose.yml) är en fil som förenklar start/stop av containrar. Egentligen säger den bara vilka flaggor man ska starta containern med. Här går det att sätta *environmental* variabler, vilket brukar kunna vara av intresse. Det är även möjligt att peta fram portar från containern till hosten.

## Cheatsheet
Lite smått och gott.

### Hitta container namn/id
> docker ps

Vanligtvis är namnet *ljud-backend* eller *ljud-frontend*.

### Gå in i containern
> docker exec -it <container_name> sh

Det är minimala distributioner som körs i containrarna, så det finns inte mycket förinstallerade program. Utifall att man kommer på någonting vettigt som bör finnas så kan vi uppdatera imagena för att inkludera det.

### Starta backenden/frontenden
För att starta båda kan du bara köra:
> docker compose up

Vill du starta en särskild väljer du att skriva antingen *backend* eller *frontend*:
> docker compose up <backend/frontend>

Starta den daemoniserad (så den inte tar upp terminalen)
> docker compose up <backend/frontend> -d

### Stoppa backenden/frontenden
> docker compose down

### Kolla loggen för en container
> docker logs <container_name>

Följ loggen med flaggan *-f*:
> docker logs <container_name> -f
