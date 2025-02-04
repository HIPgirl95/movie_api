const passport = require("passport");

const express = require("express"),
  morgan = require("morgan"),
  uuid = require("uuid"),
  bodyParser = require("body-parser"),
  Models = require("./models.js"),
  Movies = Models.Movie,
  Users = Models.User,
  cors = require("cors");
// Genres = Models.Genre,
// Directors = Models.Director;

const { check, validationResult } = require("express-validator");

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("common"));
app.use(cors());

// let allowedOrigins = ["http://localhost:8080", "http://testsite.com"];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         let message =
//           "The CORS policy for this application doesn't allow access from origin " +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

let auth = require("./auth")(app);

require("./passport.js");

/**
 *@function GET movies
 *@description Retrieves all movies
 *@access protected (JWT authentication required)
 *@returns {object} 201 - the movies if found
 *@returns {string} 500 - error message if movies not found
 */
// GET a list of movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 *@function GET movies/:Title
 *@description Retrieves details of a specific movie by title
 *@access protected (JWT authentication required)
 *@param {string} req.params.Title -name of movie Title
 *@returns {object} 201 - the movie details if found
 *@returns {string} 500 - error message if details not found
 */
//GET movie by title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ Title: req.params.Title })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function GET genres/:genre
 * @description Retrieves details of a specific movie genre
 * @access protected (JWT authentication required)
 * @param {string} req.params.genre - the name of the genre to retrieve
 * @returns {object} 200 - the genre details if found
 * @returns {string} 404 - error message if no genre is found
 */
// GET info about a specified genre
app.get(
  "/genres/:genre",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const movie = await Movies.findOne({ "Genre.Name": req.params.genre });
    if (movie) {
      res.status(200).json(movie.Genre);
    } else {
      res.status(404).send("No genre found.");
    }
  }
);

/**
 *@function GET directors/:Name
 *@description Retrieves details of a specific director by name
 *@access protected (JWT authentication required)
 *@param {string} req.params.Name - name of the director
 *@returns {object} 200 - the director details if found
 *@returns {string} 404 - error message if details not found
 */
// GET info about directors
app.get(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const movie = await Movies.findOne({ "Director.Name": req.params.Name });
    if (movie) {
      res.status(200).json(movie.Director);
    } else {
      res.status(404).send("No Director found.");
    }
  }
);

/**
 *@function POST users
 *@description creates a new user
 *@access public
 *@param {string} req.body.Username (username must be at least 5 characters, alphanumerical)
 *@param {string} req.body.Password (password is required)
 *@param {Date} [req.body.Birthday] (optional)
 *@param {Email} req.body.Email (email must be a valid email format)
 *@returns {Object} 201 - The created user object.
 *@returns {Object} 400 - Error message if the username already exists.
 *@returns {Object} 422 - Validation errors if input does not meet criteria.
 *@returns {Object} 500 - Server error message.
 */
// POST new user
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid.").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }).then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists.");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
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
  }
);

/**
 *@route GET directors/:Name
 *@description Retrieves details of a specific director by name
 *@access protected (JWT authentication required)
 *@param {string} req.params.Name - name of the director
 *@returns {object} 200 - the director details if found
 *@returns {string} 404 - error message if details not found
 */
// GET all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//PUT to update a user's info, by username
app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
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
  }
);

//POST a movie to a user's favorites list
app.post(
  "/users/:Username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
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
  }
);

//DELETE a movie from a user's favorites list
app.delete(
  "/users/:Username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
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
  }
);

//DELETE a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
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
  }
);

app.get("/", (req, res) => {
  res.send("There is nothing here!");
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
