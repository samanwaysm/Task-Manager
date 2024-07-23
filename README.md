# Task Management Application
## Introduction
This is a task management application built with Node.js, Express, MongoDB, and EJS. The application includes Google Sign-In authentication using passport and passport-google-oauth20.


## Setup Instructions:

### Clone the repository:

```bash
git clone https://github.com/samanwaysm/Task-Manager.git
```

### Navigate to the project directory:

```bash
cd Task-Manager
```

### Install dependencies:

```bash
npm install
```

### Configure environment variables:
#### Create a .env file in the root directory with the following variables:
```bash
MONGO_URI = your_mongodb_uri
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
SESSION_SECRET = your_session_secret
PORT = 4000
```

### Set up Passport for Google Authentication:

Ensure that your Google OAuth 2.0 credentials (Client ID and Client Secret) are correctly added to the .env file. Also, make sure the callback URL matches the one set in your Google Developer Console.

### Running the Application

#### Start the server:

```bash
npm start
```

### Access the application:

Open your browser and go to http://localhost:3000.

## Features
Task creation, update, and deletion
User authentication with Google Sign-In
Responsive design with EJS templating
Setup and Installation
Prerequisites
Node.js and npm installed on your system
MongoDB installed and running
Google Developer account with OAuth 2.0 credentials
Installation
