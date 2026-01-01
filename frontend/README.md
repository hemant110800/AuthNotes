# AuthNotes Frontend – React

AuthNotes is a secure note-management web application that allows users to register, log in, and manage personal notes.
This repository contains the frontend of the AuthNotes application, built with React and deployed on Netlify.   

The frontend communicates with a Django REST Framework backend using JWT-based authentication.

## Tech Stack
**Framework:** React   
**Language:** JavaScript (ES6+)   
**Styling:** CSS / Bootstrap   
**State Management:** React Context API   
**Routing:** React Router   
**API Communication:** REST APIs (Django backend)   
**Authentication:** JWT (Access & Refresh Tokens)   
**Deployment:** Netlify   

## Local Setup Instructions

### 1. Clone the Repository
git clone your-authnotes-frontend-repo-url   
cd authnotes-frontend

### 2. Install Dependencies
npm install

### 3. Environment Variables
Create a .env file in the project root:   
REACT_APP_API_URL=http://127.0.0.1:8000   

**Important Notes**   

- All React environment variables must start with REACT_APP_   
- REACT_APP_API_URL should point to your running backend server   
- Restart the dev server after changing .env

### 4. Run the Development Server
npm start   
The application will be available at:   
http://localhost:3000

## Authentication Flow

- User registers or logs in from the frontend   
- Backend returns JWT access and refresh tokens   
- Tokens are stored in localStorage and React Context   
- Access token is attached to protected API requests   
- Tokens are refreshed automatically using the refresh token
