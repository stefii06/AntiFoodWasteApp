# AntiFoodWasteApp
Web app to prevent food waste - Web Technologies Project


# 1. Specificatii Anti Food Waste App


1.1. Descrierea aplicației
Ce este aplicația și ce problemă rezolvă
 (sharing alimente, reducerea risipei alimentare)

1.2. Lista funcționalităților
1. Gestionarea alimentelor (Food Management)
Ca utilizator:
pot adăuga alimente în lista mea, fiecare având:


nume produs


categorie (fructe, lactate, carne, conserve etc.)


cantitate


dată expirare


poză (opțional)


pot edita sau șterge produse din listă


pot vizualiza produsele organizate pe categorii pentru o navigare mai ușoară








2. Notificări de expirare (Expiry Alerts)
Ca utilizator:
primesc notificări atunci când un produs se apropie de expirare (ex.: cu 2 zile înainte)


pot marca un produs ca „disponibil pentru partajare / donare”


pot vedea într-o listă separată toate produsele disponibile




3. Prieteni & Grupuri (Friends & Groups)
Ca utilizator:
pot crea grupuri de prieteni (ex.: Colectiv, Familie, Colegi de apartament)


pot eticheta prietenii în funcție de preferințe alimentare:


vegetarian


vegan


carnivor


iubitor de zacuscă (sau alte preferințe personalizate)


pot invita prieteni să vizualizeze lista mea de produse disponibile
















4. Claim produse (Product Claiming)
Ca utilizator:
pot vedea produsele disponibile ale altor utilizatori


pot face claim pe un produs (trimit o cerere către proprietar)


proprietarul produsului poate:


aproba cererea


respinge cererea


produsul poate fi apoi marcat ca „rezervat” sau „donat”



5. Distribuire pe rețele sociale (Social Media Sharing)
Ca utilizator:
pot posta pe Instagram sau Facebook produsele disponibile pentru donare


pot distribui:


un produs individual


o listă de produse


distribuirea se face prin:


share link


poză + descriere generată automat



# 2. Planul de proiect
2.1. Etape și calendar

Etapa 1 – până la 16.11.2025


Finalizare „Specificații detaliate”


Definire model de date (tabele, relații)


Definire structură API (liste endpoint-uri)


Creare repository Git + structură minimă /frontend și /backend


Alegerea serviciului de deploy (ex. Render / Azure / Railway)



Etapa 2 – 16.11–06.12.2025


Implementare backend (Node.js + Express)


Conectare la baza de date prin ORM


Implementare endpoint-uri pentru:


autentificare


CRUD produse


grupuri de prieteni


claim-uri


Adăugare instrucțiuni de rulare în README


Testare basic cu Postman / browser





Etapa 3 – ultimul seminar


Implementare frontend (React )


Integrare frontend cu backend (apeluri API)


Implementare:


dashboard utilizator


gestionare prieteni & grupuri


produse disponibile & claim


notificări expirare (variantă aleasă)


share pe social media


Deploy aplicație pe server


Pregătire demo final



2.2. Împărțirea responsabilităților 
Aici pui cine ce face, ca să pară clar organizat:
Student A


Model de date și schema bazei de date


Implementare backend (API REST, autentificare, notificări)


Integrare cu baza de date și ORM


Documentarea API-ului în README


Student B


Definirea interfeței și structurii paginilor (wireframe-uri)


Implementare frontend (React: pagini, componente, routing)


Integrarea apelurilor către API


Elemente UX/UI + share social media


Responsabilități comune


Scriere și actualizare „Specificații detaliate”


Planul de proiect


Testare și debug


Pregătirea și susținerea demo-ului



2.3. Workflow de lucru (opțional, dar dă bine)
2–3 bullet-uri sunt suficiente:
Folosim GitHub pentru versionare:


branch principal: main


branch-uri pentru feature-uri: feature/backend-auth, feature/frontend-dashboard etc.


Comunicăm și urmărim task-urile într-un Google Doc / Trello / Notion.


La fiecare etapă intermediară:


facem code review între noi


actualizăm documentația (specificații + README)





