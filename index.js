const express = require("express"),
  morgan = require("morgan"),
  uuid = require("uuid"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  Movies = Models.Movie,
  Users = Models.User;
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

// GET a list of movies with a specified genre
app.get("/movies/genres/:genre", async (req, res) => {
  await Movies.find({ "Genre.Name": req.params.genre })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// GET info about directors
app.get("/movies/directors/:Name", async (req, res) => {
  await Movies.find({ "Director.Name": req.params.Name })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// POST new user
/* Expected JSON in this format: 
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
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
/* Expected json in this format:
{
Username: String, (required)
Password: String, (required)
Email: String, (required)
Birthday: Date
} */

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
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//POST a movie to a user's favorites list
app.post("/users/:Username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavMovies: req.params.MovieID },
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

// PUT to update username
// app.put("/users/:username/:newUsername", (req, res) => {
//   let username = users.find((person) => {
//     return person.username === req.params.username;
//   });
//   if (username) {
//     let newUsername = req.params.newUsername;
//     username = newUsername;
//     res.status(201).send("New Username is " + username);
//   } else {
//     res.status(404).send("User " + req.params.username + " was not found");
//   }
// });

// // PUT movie on favorites list
// app.put("/users/:username/favorites/:title/add", (req, res) => {
//   let user = users.find((person) => {
//     return person.username === req.params.username;
//   });
//   let title = req.params.title;

//   if (!user || !title) {
//     res.status(404).send("User or movie not specified");
//   } else {
//     res
//       .status(200)
//       .send(title + " has been added to " + user.username + "'s favorites!");
//   }
// });

// app.delete("/users/:username/favorites/:title/remove", (req, res) => {
//   let user = users.find((person) => {
//     return person.username === req.params.username;
//   });
//   let title = req.params.title;
//   if (!user) {
//     res.status(404).send("User " + user.username + " does not exist.");
//   } else if (!title) {
//     res.status(404).send(title + " cannot be found.");
//   } else {
//     res
//       .status(200)
//       .send(title + " has been removed from " + user.username + "'s favorites");
//   }
// });

// app.delete("/users/unregister/:username", (req, res) => {
//   let user = users.find((person) => {
//     return person.username === req.params.username;
//   });
//   if (!user) {
//     res.status(404).send(req.params.username + " does not have an account.");
//   } else {
//     users = users.filter((obj) => {
//       return obj.username !== req.params.username;
//     });
//     res.status(201).send("User " + req.params.username + " was deleted.");
//   }
// });

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
