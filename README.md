# ContainerHub

ContainerHub ist eine Full-Stack Webanwendung zur Verwaltung und Reservierung von Storage-Containern.  
Das Projekt wurde mit **React (Vite)** im Frontend und **Strapi v4** im Backend entwickelt und dient als **realistische Demo-Applikation** mit Login, Reservierungen und Benutzerprofilen.

---

## 🚀 Features

- Benutzerregistrierung & Login (JWT, Strapi Users & Permissions)
- Container-Übersicht und Detailseite
- Reservierung von Containern (nur für eingeloggte Benutzer)
- Pflichtfelder inkl. Zahlungsmethode (Demo, kein echtes Payment)
- Benutzerprofil (Anzeigen & Bearbeiten)
- Kontaktformular
- Modernes, responsives UI mit Tailwind CSS

---

## 🧱 Technologie-Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Fetch API (zentralisiert)

**Backend**
- Strapi v4
- REST API
- JWT-Authentifizierung

---

## 📦 Projektstruktur (vereinfacht)

ContainerHub/
├── backend/ # Strapi CMS
└── frontend/ # React + Vite App


---

## ⚙️ Setup (lokal)

### Backend (Strapi)

```bash
cd backend
npm install
npm run develop

http://localhost:1337/admin

Frontend
cd frontend
npm install
npm run dev

Frontend App:

http://localhost:5173




🔐 Authentifizierung

Benutzer melden sich mit E-Mail & Passwort an

JWT wird im localStorage gespeichert (containerhub_token)



**Reservierungen sind nur für eingeloggte Benutzer möglich**

Reservierungen (Demo-Flow)

Benutzer meldet sich an oder registriert sich

Container auswählen

Reservierungsformular ausfüllen:

Name

E-Mail

Telefon

Start- & Enddatum

Zahlungsmethode (Demo)

AGB akzeptieren

Reservierung wird im Backend gespeichert und dem Benutzer zugeordnet


Hinweise

Kein echtes Zahlungssystem integriert (Demo)

Benutzer wird im Backend automatisch über JWT (ctx.state.user) gesetzt

Frontend sendet keinen user im Payload
