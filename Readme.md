🌥️ CloudShare

A modern, full-stack cloud storage and file-sharing platform built with Django REST Framework and React (Vite).
CloudShare allows users to securely upload files, manage them efficiently, analyze usage, and share content publicly.

🚀 Features

User Authentication (JWT) — secure login, registration, token refresh

File Upload & Management — upload, list, download, delete files

Public Share Links — easily share files through generated URLs

Analytics Dashboard — view upload statistics & user activity

Cloud Storage Support — works with Cloudflare R2 / AWS S3 via Django Storages

Modern Frontend — React + Vite + Tailwind CSS

Clean API Architecture — structured Django apps (api, files, analytics)

🏗️ Tech Stack
Backend

Django

Django REST Framework

SimpleJWT

Cloudflare R2 / AWS S3 (via django-storages)

Frontend

React (Vite)

Axios

TailwindCSS

📦 Folder Structure
Cloudshare/
├── backend/
│   ├── api/
│   ├── analytics/
│   ├── files/
│   ├── cloudshare/
│   ├── static/
│   └── manage.py
└── frontend/
    ├── src/
    ├── public/
    └── package.json

⚙️ Environment Variables
Backend – .env

(Example file provided as .env.example)

SECRET_KEY=
DEBUG=
DATABASE_URL=

ALLOWED_HOSTS=
CORS_ALLOW_ALL_ORIGINS=

R2_BUCKET_NAME=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_ENDPOINT_URL=

Frontend – .env

(Example file provided as .env.example)

VITE_API_BASE=https://your-backend-url

🛠️ Running the Project Locally
1️⃣ Backend Setup
cd backend

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Start server
python manage.py runserver


Backend will run at:
👉 http://127.0.0.1:8000

2️⃣ Frontend Setup
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev


Frontend will run at:
👉 http://127.0.0.1:5173

📤 Deployment

CloudShare is designed to be deployment-ready:

Works with Docker (if added)

Supports R2/S3 storage

Environment-based configuration

Stateless JWT authentication
