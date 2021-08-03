# Movie API

The Movie API serves as a backend for an application that allows users to sign in and view movies that are saved in the database. This RESTful API is built with Node.js, Express.js and a MongoDB database.
![Screenshot of an API call in Postman](https://daniswhoiam.github.io/portfolio-website/img/movieapi.png)
#### Table of Contents

- [Objective](#Objective)
- [User Goals](#User-Goals)
- [Key Features](#Key-Features)
- [Stack](#Stack)
- [How to Use](#How-to-Use)

## Objective
This project is intended as a first time implementation of a RESTful API and a complete backend for an application. The goal was to learn about server-side development, Node.js, databases, routing, authentication and RESTful APIs.

## User Stories

 - As a user, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I've watched or am interested in.
 - As a user, I want to be able to create a profile so I can save data about my favorite movies.


## Key Features

 - Return a list of ALL movies to the user
 - Return data (description, genre, director, image URL, whether it's featured or not) about a single movie by title to the user
 - Return data about a genre (description) by name (e.g., "Thriller")
 - Return data about a director (bio, birth year, death year) by name
 - Allow new users to register
 - Allow users to update their user info (username, password, email, date of birth)
 - Allow users to add a movie to their list of favorites
 - Allow users to remove a movie from their list of favorites
 - Allow existing users to deregister
 - Allow users to view more information about different movies, such as the release date and the movie rating

## Stack

 - Node.js
 - Express.js
 - MongoDB
 - Heroku

The API is built with a REST architecture. The business logic is modeled with Mongoose.
It meets basic data security regulations and uses JWT-based authentication.

## How to Use
### Live Version
The base URL of the API is:
https://daniswhoiam-myflix.herokuapp.com/

You can find the documentation here:
https://daniswhoiam-myflix.herokuapp.com/documentation.html
### For Development
Clone the code to your local machine following GitHub's instructions and start working on the project. Make sure to have the current versions of "Node.js" and "Express.js" installed globally on your local machine.
Run `npm install` to install all necessary dependencies.
It is recommended that you setup your own hosted or local database and use the information from the "models.js" file to configure it properly.
