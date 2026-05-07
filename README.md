# 📦 ContainerHub

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Strapi](https://img.shields.io/badge/Strapi-v4-4945FF?style=flat-square&logo=strapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel&logoColor=white)


<img width="1274" height="1281" alt="Captura de Tela 2026-05-08 às 00 25 51" src="https://github.com/user-attachments/assets/80bc2bea-0a49-4d4f-977b-ba38f5c06ba1" />


**🚀 Live demo:** [kontainer-flame.vercel.app](https://kontainer-flame.vercel.app/)

Full-stack monorepo for storage container rental management. React + Vite frontend consuming a Strapi v4 CMS REST API backed by PostgreSQL — with JWT authentication, user profiles and a complete booking flow.

---

## ✨ Features

- 🔐 User registration and login (JWT via Strapi Users & Permissions)
- 📋 Container listing with detail pages
- 📅 Booking flow — authenticated users only
- 👤 User profile — view and edit
- 📬 Contact form
- 📱 Responsive UI with Tailwind CSS

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend / CMS | Strapi v4 |
| Database | PostgreSQL |
| Auth | JWT (Strapi Users & Permissions) |
| Deployment | Vercel (frontend) |

---

## 📁 Project Structure

ContainerHub/
├── frontend/ # React + Vite app
└── backend/ # Strapi v4 CMS

---
## ⚙️ Run Locally
**Backend (Strapi):**
```bash
cd backend
npm install
npm run develop
Admin panel: http://localhost:1337/admin

Frontend:

cd frontend
npm install
npm run dev
App: http://localhost:5173 🎉

© 2026 Willian Fonseca · GitHub · LinkedIn

