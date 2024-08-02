const express = require("express"),
  morgan = require("morgan");
const app = express();

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

app.use(morgan("common"));

app.get("/movies", (req, res) => {
  res.json(Movies);
});

app.get("/movies/:title", (req, res) => {
  res.json(
    Movies.find((film) => {
      return film.title === req.params.title;
    })
  );
});

app.get("/movies/genres/:genre", (req, res) => {
  res.send("Information about " + req.params.genre + "!");
});

app.get("/directors/:name", (req, res) => {
  res.json(
    directors.find((person) => {
      return person.name === req.params.name;
    })
  );
});

app.get("/", (req, res) => {
  res.send("There is nothing here!");
});

app.use(express.static("public"));

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});
