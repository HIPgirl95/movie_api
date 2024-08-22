const express = require("express"),
  morgan = require("morgan"),
  uuid = require("uuid"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  Movies = Models.Movie,
  Users = Models.User,
  Genres = Models.Genre,
  Directors = Models.Director;
const app = express();
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("common"));

// GET a list of movies
app.get("/movies", async (req, res) => {
  await Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// GET details about a movie by title
app.get("/movies/:Title", async (req, res) => {
  await Movies.find({ Title: req.params.Title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// GET info about a specified genre
app.get("/genres/:genre", async (req, res) => {
  await Genres.find({ Name: req.params.genre })
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// GET info about directors
app.get("/directors/:Name", async (req, res) => {
  await Directors.find({ Name: req.params.Name })
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// POST new user
app.post("/users", async (req, res) => {
  await Users.findOne({ Username: req.body.Username }).then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + " already exists.");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
    }
  });
});

// GET all users
app.get("/users", async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET a user by username
app.get("/users/:Username", async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//PUT to update a user's info, by username
app.put("/users/:Username", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(400)
          .send("User " + req.params.Username + " does not exist.");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//POST a movie to a user's favorites list
app.post("/users/:Username/movies/:movieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavMovies: req.params.movieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//DELETE a movie from a user's favorites list
app.delete("/users/:Username/movies/:movieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavMovies: req.params.movieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//DELETE a user by username
app.delete("/users/:Username", async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found.");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/", (req, res) => {
  res.send("There is nothing here!");
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
