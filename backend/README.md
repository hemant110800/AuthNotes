# AuthNotes Backend – Local Development Setup
This document explains how to set up and run the AuthNotes backend server locally for development and testing.   
AuthNotes is a secure notes management application that provides REST APIs for user authentication and user-specific note operations.   

## Tech Stack

**Backend:** Django, Django REST Framework   
**Database:** SQLite (local development)   
**Authentication:** JWT (Access & Refresh Tokens)   
**Deployment (Production):** Render   

## Steps to Set Up Server Locally

### 1. Clone the Repository   
git clone your-authnotes-backend-repo-url   
cd authnotes-backend

### 2. Create and Activate Virtual Environment

Create a virtual environment:   python -m venv venv   
Activate the virtual environment:  venv\Scripts\activate   

### 3. Create a .env File

Create a .env file in the project root and add the following:   

**DJANGO_SECRET_KEY** = your-secret-key   
**DJANGO_ENV** = development      
**DJANGO_DEBUG_FLAG** = True   
**ALLOWED_HOSTS** = 127.0.0.1,localhost    

**Notes**   
- Set DJANGO_DEBUG_FLAG=False in production
- Never commit .env files to GitHub
  
### 4. Install Dependencies
pip install -r requirements.txt

### 5. Apply Database Migrations
python manage.py makemigrations   
python manage.py migrate   

**(Optional) Create a superuser:**
python manage.py createsuperuser

### 6. Run the Development Server
python manage.py runserver   

Backend will be available at:  http://127.0.0.1:8000/   
Admin panel:  http://127.0.0.1:8000/admin/   


Never commit .env files to GitHub
