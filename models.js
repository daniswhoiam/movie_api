const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  ReleaseYear: String,
  Rating: String,
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Date,
    Death: Date
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: usernameValidator,
      message: 'The username you chose already exists. Please choose another one.'
    }
  },
  Password: { type: String, required: true },
  Email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: emailValidator,
      message: 'The email you chose is already used by another user. Please choose another one.'
    }
  },
  Birth: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// Make sure the username is unique.
function usernameValidator(username) {
  return User.findOne({ Username: username })
    .then(user => {
      return user ? false : true;
    })
    .catch(err => {
      console.error(err);
    });
}

// Make sure the email is unique.
function emailValidator(email) {
  return User.findOne({ Email: email })
    .then(user => {
      return user ? false : true;
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports.Movie = Movie;
module.exports.User = User;
