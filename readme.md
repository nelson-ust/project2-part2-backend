# CSE 341 Final Project 2 - Authentication

Welcome to the CSE 341 Final Project 2 - Authentication! This project is a web application that implements user authentication using Passport.js and integrates Google OAuth for login.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The CSE 341 Final Project 2 - Authentication is a web application developed for the CSE 341 course. It focuses on implementing user authentication, allowing users to register, log in, and log out securely. Additionally, Google OAuth integration is included to provide a seamless login experience.

## Features

- User registration with username and password
- User login with username and password
- Google OAuth login
- User logout
- API endpoints for user authentication status

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd project2-part2-backend


Install dependencies:
npm install

Usage
To run the application, use the following command:


npm start
Visit https://item-api-v2.onrender.com in your browser to access the application.

Authentication
The application supports both local authentication (username and password) and Google OAuth for a more convenient login experience.

Local Authentication
For local authentication, use the provided registration and login forms on the web interface.

Google OAuth
To use Google OAuth for login, click the "Login with Google" button on the login page.

API Endpoints
POST /auth/register: Register a new user.
POST /auth/login: Log in with username and password.
GET /auth/logout: Log out the currently authenticated user.
GET /auth/check-auth: Check the authentication status.

Testing
To run tests, use the following command:

npm test

Troubleshooting
If you encounter any issues, please refer to the troubleshooting section in the wiki.

Contributing
Contributions are welcome! Feel free to submit pull requests or report issues.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Replace `[repository-url]` with the actual URL of your repository. Adjust the sections as needed for your project's specifics.
