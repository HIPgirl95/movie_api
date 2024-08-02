const express = require("express"),
  morgan = require("morgan"),
  uuid = require("uuid"),
  bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let Movies = [
  {
    title: "Pirates of the Caribbean",
    actors: ["Johnny Depp", "Kiera Knightly", "Orlando Bloom"],
    genre: ["Fantasy", "Comedy", "Adventure"],
    director: "Gore Verbinski",
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    actors: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
    genre: ["Fantasy", "Adventure", "Family"],
    director: "Chris Columbus",
  },
  {
    title: "Lord of the Rings",
    actors: ["Elijah Wood", "Viggo Mortensen", "Sir Ian McKellen"],
    genre: ["Fantasy", "Epic", "Adventure"],
    director: "Peter Jackson",
  },
  {
    title: "Accepted",
    actors: ["Justin Long", "Blake Lively", "Jonah Hill"],
    genre: ["Comedy", "College"],
    director: "Steve Pink",
  },
  {
    title: "The Princess Bride",
    actors: ["Cary Elwes", "Robin Wright", "Mandy Patinkin"],
    genre: ["Fantasy", "Romance", "Comedy"],
    director: "Rob Reiner",
  },
  {
    title: "The Princess Diaries",
    actors: ["Anne Hathaway", "Julie Andrews", "Hector Elizondo"],
    genre: ["Romance", "Family", "Comedy"],
    director: "Garry Marshall",
  },
  {
    title: "X-Men",
    actors: ["Hugh Jackman", "Sir Patrick Stewart", "Sir Ian McKellen"],
    genre: ["Action", "Superhero", "Fantasy"],
    director: "Bryan Singer",
  },
  {
    title: "Tangled",
    actors: ["Mandy Moore", "Zachary Levi", "Donna Murphy"],
    genre: ["Family", "Adventure", "Animation"],
    director: ["Nathan Greno", "Byron Howard"],
  },
  {
    title: "The Hunger Games",
    actors: ["Jennifer Lawrence", "Josh Hutcherson", "Donald Sutherland"],
    genre: ["Adventure", "Action", "Drama"],
    director: "Gary Ross",
  },
  {
    title: "Spider-Man: Homecoming",
    actors: ["Tom Holland", "Zendaya", "Michael Keaton"],
    genre: ["Action", "Superhero", "Comedy"],
    director: "Jon watts",
  },
];

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

let users = [
  {
    username: "HannahHogan",
    password: "Pa55w0rd",
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
app.post("/users/register/:username", (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// PUT to update username
app.put("/users/:username/:newUsername", (req, res) => {
  let username = users.find((person) => {
    return person.username === req.params.username;
  });
  if (username) {
    let newUsername = req.params.newUsername;
    username = newUsername;
    res.status(201).send("New Username is " + username);
  } else {
    res.status(404).send("User " + req.params.username + " was not found");
  }
});

// PUT movie on favorites list
app.put("/users/:username/favorites/:title/add", (req, res) => {
  let user = users.find((person) => {
    return person.username === req.params.username;
  });
  let title = req.params.title;

  if (!user || !title) {
    res.status(404).send("User or movie not specified");
  } else {
    res
      .status(200)
      .send(title + " has been added to " + user.username + "'s favorites!");
  }
});

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
