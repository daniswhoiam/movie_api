const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

const movies = [
  {
    title: 'Inception',
    year: '2010'
  },
  {
    title: 'Forrest Gump',
    year: '1994'
  },
  {
    title: 'Fight Club',
    year: '1999'
  },
  {
    title: 'The Good, The Bad And The Ugly',
    year: '1966'
  },
  {
    title: 'Pulp Fiction',
    year: '1994'
  },
  {
    title: 'Schindler\'s List',
    year: '1993'
  },
  {
    title: 'The Dark Knight',
    year: '2008'
  },
  {
    title: 'The Godfather',
    year: '1972'
  },
  {
    title: 'The Shawshank Redemption',
    year: '1994'
  },
  {
    title: 'Titanic',
    year: '1997'
  }
];

app.use(bodyParser.json());

// Return a list of all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// Return data about a single movie by title
app.get('/movies/:title', (req, res) => {
  const movie = movies.find(movie => {
    return movie.title === req.params.title;
  });
  movie
    ? res.status(200).json(movie)
    : res.status(404).send('No movie with this title was found');
});

// Return data about a genre by title
app.get('/genres/:title', (req, res) => {
  res
    .status(200)
    .send(`Successfully retrieved data about genre: ${req.params.title}`);
});

// Return data about a director by name
app.get('/directors/:name', (req, res) => {
  res
    .status(200)
    .send(`Successfully retrieved data about director: ${req.params.name}`);
});

// Allow new users to register
app.post('/users', (req, res) => {
  res.status(201).send('Successfully created user.');
});

// Allow users to update their username
app.put('/users/:userID/:username', (req, res) => {
  res
    .status(202)
    .send(
      `The username of user #${req.params.userID} was successfully updated.`
    );
});

// Allow users to add a move to their list of favorites
app.patch('/users/:userID/favorites', (req, res) => {
  res
    .status(202)
    .send(
      `The movie has been successfully added to user #${req.params.userID}'s favorites list.`
    );
});

// Allow users to remove a movie from their list of favorites
app.patch('/users/:userID/favorites/:movieID', (req, res) => {
  res
    .status(202)
    .send(
      `The movie #${req.params.movieID} was removed from user #${req.params.userID}'s favorites list.`
    );
});

// Allow existing users to deregister
app.delete('/users/:userID', (req, res) => {
  res
    .status(202)
    .send(`User #${req.params.userID} was removed from the system.`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong.');
});

// Listen for requests
app.listen(8080);
