const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const app = express(),
  Movies = Models.Movie,
  Users = Models.User;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Logging
app.use(morgan('common'));

// Deliver static resources
app.use(express.static('public'));

app.use(bodyParser.json());

// Return a list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(200).json(movies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a single movie by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then(movie => {
      movie
        ? res.status(200).json(movie)
        : res.status(404).send('No movie with this title was found.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a genre by title
app.get('/genres/:title', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.title })
    .then(movie => {
      movie
        ? res.status(200).json(movie['Genre'])
        : res.status(404).send('No genre with this title was found.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a director by name
app.get('/directors/:name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.name })
    .then(movie => {
      movie
        ? res.status(200).json(movie['Director'])
        : res.status(404).send('No director with this name was found.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow new users to register
/*
Expecting JSON in this format:
{
  Username: String,
  Password: String,
  Email: String,
  Birth: Date
}
*/
app.post('/users', (req, res) => {
  Users.create({
    Username: req.body.username,
    Password: req.body.password,
    Email: req.body.email,
    Birth: req.body.birth
  })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow users to update their info
/*
We'll expect JSON in this format
{
  Username: String,
  Password: String,
  Email: String,
  Birth: Date
}
Only fields included in the request body will be updated. Not defined fields will be ignored.
*/
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $set: req.body
    },
    { new: true }
  )
    .then(user => {
      user
        ? res.status(202).json(user)
        : res.status(404).send('There is no user with this username.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow users to add a movie to their list of favorites
app.patch('/users/:username/movies/:movieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $addToSet: {
        FavoriteMovies: req.params.movieID
      }
    },
    { new: true }
  )
    .then(user => {
      res.status(202).json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:username/movies/:movieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $pull: {
        FavoriteMovies: req.params.movieID
      }
    },
    { new: true }
  )
    .then(user => {
      res.status(202).json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow existing users to deregister
app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username })
    .then(user => {
      user
        ? res.status(202).send(req.params.username + ' was deleted.')
        : res.status(404).send(req.params.username + ' was not found.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Error handling
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong.');
});

// Listen for requests
app.listen(8080);
