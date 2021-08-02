const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const app = express(),
  Movies = Models.Movie,
  Users = Models.User;

const allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'http://localhost:4200', 'http://testsite.com', 'https://daniswhoiam-myflix.netlify.app', 'https://daniswhoiam.github.io'];

// Allow only certain domains to access the API
const cors = require('cors');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          'The CORS policy for this application doesn\'t allow access from origin ' +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    }
  })
);

const { check, validationResult } = require('express-validator');

// Connect to MongoDB database
/*
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
*/
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Logging
app.use(morgan('common'));

// Deliver static resources
app.use(express.static('public'));

app.use(bodyParser.json());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

/**
 * Returns all stored movies.
 * @func getAllMovies
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with all movies or an error message.
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then(movies => {
        res.status(200).json(movies);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Returns information about one specific movie, if it exists in the database.
 * @func getMovie
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with movie details or error message.
 */
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);

/**
 * Returns information about one specific genre, if it exists in the database.
 * @func getGenre
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with genre details or error message.
 */
app.get(
  '/genres/:title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);

/**
 * Returns information about one specific director, if it exists in the database.
 * @func getDirector
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with director details or error message.
 */
app.get(
  '/directors/:name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);

/**
 * Returns information about one specific user, if it exists in the database.
 * @func getUser
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with user details or error message.
 */
app.get(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    }

    Users.findOne({ username: req.params.username})
      .then(user => {
        user
          ? res.status(202).json(user)
          : res.status(404).send('There is no user with this username.');
      }).catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Returns a user's favorite movies, if the user exists in the database.
 * @func getUserFavoriteMovies
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and an array with the user's favorite movies or error message.
 */
app.get(
  '/users/:username/favoritemovies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    }

    Users.findOne({ username: req.params.username})
      .then(user => {
        user
          ? res.status(202).send(user.FavoriteMovies)
          : res.status(404).send('There is no user with this username.');
      }).catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
)

/**
 * Creates a user in the database.
 * @func postUser
 * @param {string} endpoint API endpoint
 * @param {array} inputValidation Validates client-side input
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with the new user's information or error message.
 */
app.post(
  '/users',
  /*
    Expecting JSON in this format:
    {
      Username: String,
      Password: String,
      Email: String,
      Birth: Date
    }
  */
  [
    check('Username', 'Username is required')
      .not()
      .isEmpty(),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required.')
      .not()
      .isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
  ],
  (req, res) => {
    // Check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.create({
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birth: req.body.Birth
    })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Updates a user's information if the user exists in the database.
 * @func putUser
 * @param {string} endpoint API endpoint
 * @param {array} inputValidation Validates client-side input and authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with the user's updated information or error message.
 */
app.put(
  '/users/:username',
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
  [
    check('Username', 'Username is required')
      .not()
      .isEmpty(),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required.')
      .not()
      .isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail(),
    passport.authenticate('jwt', { session: false })
  ],
  (req, res) => {
    // Check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.body.Password) {
      let hashedPassword = Users.hashPassword(req.body.Password);
      req.body.Password = hashedPassword;
    }
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
  }
);

/**
 * Adds a movie to the user's favorite movies.
 * @func patchUsersFavoriteMovies
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with the user's updated information or error message.
 */
app.patch(
  '/users/:username/movies/:movieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);

/**
 * Removes a movie from the user's favorite movies
 * @func deleteUsersFavoriteMovies
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and JSON object with the user's updated information or error message.
 */
app.delete(
  '/users/:username/movies/:movieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
        res.status(200).json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Removes a specific user from the database.
 * @func deleteUser
 * @param {string} endpoint API endpoint
 * @param {function} passportAuthentication Authentication
 * @param {function} requestCallback Callback function to resolve request
 * @returns {Response} Includes status and a message about the success of the request.
 */
app.delete(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.username })
      .then(user => {
        user
          ? res.status(200).send(req.params.username + ' was deleted.')
          : res.status(404).send(req.params.username + ' was not found.');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Handle any error that happend along the line and was not caught.
 * @func handleErrors
 * @param {function} requestCallback Callback function to handle error
 * @returns {Response} Includes status and generic error message.
 */
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong.');
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
