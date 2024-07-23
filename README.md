# Task Management Application
## Introduction
This is a task management application built with Node.js, Express, MongoDB, and EJS. The application includes Google Sign-In authentication using passport and passport-google-oauth20.


## Setup Instructions:

#### Clone the repository:

git clone https://github.com/yourusername/task-management-app.git

#### Navigate to the project directory:

cd task-management-app
Install dependencies:

npm install
Configure environment variables:
Create a .env file in the root directory with the following variables:
DB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
Run the application:

npm start
Access the application:
Open your browser and navigate to http://localhost:3000.

Set up Passport for Google Authentication:

Ensure that your Google OAuth 2.0 credentials (Client ID and Client Secret) are correctly added to the .env file. Also, make sure the callback URL matches the one set in your Google Developer Console.

Running the Application
Start the server:

npm start
Access the application:

Open your browser and go to http://localhost:3000.

Features
Task creation, update, and deletion
User authentication with Google Sign-In
Responsive design with EJS templating
Setup and Installation
Prerequisites
Node.js and npm installed on your system
MongoDB installed and running
Google Developer account with OAuth 2.0 credentials
Installation
