const express = require("express"),
  morgan = require("morgan");

const app = express();

const topMovies = [
  {
    title: "Inception",
    year: "2010"
  },
  {
    title: "Forrest Gump",
    year: "1994"
  },
  {
    title: "Fight Club",
    year: "1999"
  },
  {
    title: "The Good, The Bad And The Ugly",
    year: "1966"
  },
  {
    title: "Pulp Fiction",
    year: "1994"
  },
  {
    title: "Schindler's List",
    year: "1993"
  },
  {
    title: "The Dark Knight",
    year: "2008"
  },
  {
    title: "The Godfather",
    year: "1972"
  },
  {
    title: "The Shawshank Redemption",
    year: "1994"
  },
  {
    title: "Titanic",
    year: "1997"
  }
];

// Logging
app.use(morgan("common"));

// Deliver static resources
app.use(express.static("public"));

// Default return
app.get("/", (req, res) => {
  res.send("There will be a sophisticated response soon.");
});

// Return movies as JSON
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong.");
});

// Listen for requests
app.listen(8080);
