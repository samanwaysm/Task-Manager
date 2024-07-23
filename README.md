#Task Management Application
#Introduction
This is a task management application built with Node.js, Express, MongoDB, and EJS. The application includes Google Sign-In authentication using passport and passport-google-oauth20.


#Clone the repository:
git clone https://github.com/your-username/task-management-app.git
cd task-management-app

#Install dependencies:
npm install
Set up environment variables:

#Create a .env file in the root directory and add your configuration details:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

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
