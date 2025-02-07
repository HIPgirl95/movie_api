# myFlix API

## Overview
myFlix API is a RESTful API that allows users to access a movie database, create user accounts, manage their favorite movies, and retrieve information about movies, directors, and genres. The API is built using Node.js, Express, MongoDB, and Mongoose.

## Features
- **User Management**: Users can register, update their profiles, and delete their accounts.
- **Movie Database**: Users can browse movies and retrieve details about specific movies, directors, and genres.
- **Favorites List**: Users can add or remove movies from their favorites list.
- **Authentication & Authorization**: Secure authentication using JWT.

## Technologies Used

- Node.js
- Express.js
- MongoDB (via Mongoose)
- Passport.js (JWT Authentication)
- CORS
- Body-parser
- morgan

## Installation
To set up and run the project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd myFlix-api
2. Install dependencies:
   ```bash
   npm install
3. Create a `.env` file in the root of the project and set the following environment variables:
4. Run the server:
   ```bash
   npm start

## Endpoints

### Movies

- `GET /movies`: Retrieves a list of all movies (JWT authentication required).
- `GET /movies/:Title`: Retrieves details of a specific movie by title (JWT authentication required).

### Genres

- `GET /genres/:genre`: Retrieves details of a specific movie genre (JWT authentication required).

### Directors

- `GET /directors/:Name`: Retrieves details of a specific director by name (JWT authentication required).

### Users

- `POST /users`: Create a new user. (Username must be at least 5 characters, password required, email must be valid).
- `GET /users`: Retrieve a list of all users (JWT authentication required).
- `GET /users/:Username`: Retrieve details of a specific user by username (JWT authentication required).
- `PUT /users/:Username`: Update a user's information (JWT authentication required).
- `DELETE /users/:Username`: Delete a user's account (JWT authentication required).

### Favorites

- `POST /users/:Username/movies/:movieID`: Add a movie to the user's favorites list (JWT authentication required).
- `DELETE /users/:Username/movies/:movieID`: Remove a movie from the user's favorites list (JWT authentication required).

## Authentication

This API uses JWT (JSON Web Token) for authentication. To access protected routes, you need to include a valid JWT token in the `Authorization` header of your request.

Example:

Authorization: Bearer < your-token >

To generate a JWT, you must first register or log in via the user endpoints and retrieve your token.

### Documentation
This documentation was enhanced by AI
