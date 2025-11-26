CloudShare  
  
A modern, full-stack cloud storage and file-sharing platform built with Django REST Framework and React (Vite).
CloudShare allows users to securely upload files, manage them efficiently, analyze usage, and share content publicly.<br><br><br><br>
  
  
Features  
  
User Authentication (JWT) — secure login, registration, token refresh  
File Upload & Management — upload, list, download, delete files  
Public Share Links — easily share files through generated URLs  
Analytics Dashboard — view upload statistics & user activity  
Cloud Storage Support — works with Cloudflare R2 / AWS S3 via Django Storages  
Modern Frontend — React + Vite + Tailwind CSS  
Clean API Architecture — structured Django apps (api, files, analytics)  <br><br><br><br>
  
  
Tech Stack  
  
Backend  
Django  
Django REST Framework  
SimpleJWT  
Cloudflare R2 / AWS S3 (via django-storages)  
  
Frontend  
React (Vite)  
Axios  
TailwindCSS  <br><br><br><br>
  
  
Running the Project Locally  
  
Backend Setup  
cd backend  
pip install -r requirements.txt  
python manage.py migrate  
python manage.py runserver  
  
Backend will run at:  
http://127.0.0.1:8000  
  
Frontend Setup  
cd frontend  
npm install  
npm run dev  
  
Frontend will run at:  
http://127.0.0.1:5173  <br><br><br><br>
  
  
Deployment  
  
CloudShare is designed to be deployment-ready:  
Works with Docker (if added)  
Supports R2/S3 storage  
Environment-based configuration  
Stateless JWT authentication  
