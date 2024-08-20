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

// let Movies = [
//   {
//     title: "Pirates of the Caribbean",
//     actors: ["Johnny Depp", "Kiera Knightly", "Orlando Bloom"],
//     genre: ["Fantasy", "Comedy", "Adventure"],
//     director: "Gore Verbinski",
//   },
//   {
//     title: "Harry Potter and the Chamber of Secrets",
//     actors: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
//     genre: ["Fantasy", "Adventure", "Family"],
//     director: "Chris Columbus",
//   },
//   {
//     title: "Lord of the Rings",
//     actors: ["Elijah Wood", "Viggo Mortensen", "Sir Ian McKellen"],
//     genre: ["Fantasy", "Epic", "Adventure"],
//     director: "Peter Jackson",
//   },
//   {
//     title: "Accepted",
//     actors: ["Justin Long", "Blake Lively", "Jonah Hill"],
//     genre: ["Comedy", "College"],
//     director: "Steve Pink",
//   },
//   {
//     title: "The Princess Bride",
//     actors: ["Cary Elwes", "Robin Wright", "Mandy Patinkin"],
//     genre: ["Fantasy", "Romance", "Comedy"],
//     director: "Rob Reiner",
//   },
//   {
//     title: "The Princess Diaries",
//     actors: ["Anne Hathaway", "Julie Andrews", "Hector Elizondo"],
//     genre: ["Romance", "Family", "Comedy"],
//     director: "Garry Marshall",
//   },
//   {
//     title: "X-Men",
//     actors: ["Hugh Jackman", "Sir Patrick Stewart", "Sir Ian McKellen"],
//     genre: ["Action", "Superhero", "Fantasy"],
//     director: "Bryan Singer",
//   },
//   {
//     title: "Tangled",
//     actors: ["Mandy Moore", "Zachary Levi", "Donna Murphy"],
//     genre: ["Family", "Adventure", "Animation"],
//     director: ["Nathan Greno", "Byron Howard"],
//   },
//   {
//     title: "The Hunger Games",
//     actors: ["Jennifer Lawrence", "Josh Hutcherson", "Donald Sutherland"],
//     genre: ["Adventure", "Action", "Drama"],
//     director: "Gary Ross",
//   },
//   {
//     title: "Spider-Man: Homecoming",
//     actors: ["Tom Holland", "Zendaya", "Michael Keaton"],
//     genre: ["Action", "Superhero", "Comedy"],
//     director: "Jon watts",
//   },
// ];

let directors = [
  {
    name: "Gore Verbinski",
  },
  {
    name: "Chris Columbus",
  },
  {
    name: "Peter Jackson",
    films: "Lord of the Rings",
  },
  {
    name: "Steve Pink",
  },
  {
    name: "Rob Reiner",
  },
  {
    name: "Garry Marshall",
  },
  {
    name: "Bryan Singer",
  },
  {
    name: "Nathan Greno",
  },
  {
    name: "Byron Howard",
  },
  {
    name: "Gary Ross",
  },
  {
    name: "Jon Watts",
  },
];

app.use(morgan("common"));

// GET a list of movies
app.get("/movies", (req, res) => {
  res.json(Movies);
});

// GET details about a movie
app.get("/movies/:title", (req, res) => {
  res.json(
    Movies.find((film) => {
      return film.title === req.params.title;
    })
  );
});

// GET info about genres
app.get("/movies/genres/:genre", (req, res) => {
  res.send("Information about " + req.params.genre + "!");
});

// GET info about directors
app.get("/directors/:name", (req, res) => {
  res.json(
    directors.find((person) => {
      return person.name === req.params.name;
    })
  );
});

// POST new user
/* Expected JSON in this format {
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

app.delete("/users/:username/favorites/:title/remove", (req, res) => {
  let user = users.find((person) => {
    return person.username === req.params.username;
  });
  let title = req.params.title;
  if (!user) {
    res.status(404).send("User " + user.username + " does not exist.");
  } else if (!title) {
    res.status(404).send(title + " cannot be found.");
  } else {
    res
      .status(200)
      .send(title + " has been removed from " + user.username + "'s favorites");
  }
});

app.delete("/users/unregister/:username", (req, res) => {
  let user = users.find((person) => {
    return person.username === req.params.username;
  });
  if (!user) {
    res.status(404).send(req.params.username + " does not have an account.");
  } else {
    users = users.filter((obj) => {
      return obj.username !== req.params.username;
    });
    res.status(201).send("User " + req.params.username + " was deleted.");
  }
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
