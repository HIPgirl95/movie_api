const express = require("express"),
  morgan = require("morgan");
const app = express();

let Movies = [
  {
    title: "Pirates of the Caribbean",
    actors: ["Johnny Depp", "Kiera Knightly", "Orlando Bloom"],
    genre: ["Fantasy", "Comedy", "Adventure"],
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    actors: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
    genre: ["Fantasy", "Adventure", "Family"],
  },
  {
    title: "Lord of the Rings",
    actors: ["Elijah Wood", "Viggo Mortensen", "Sir Ian McKellen"],
    genre: ["Fantasy", "Epic", "Adventure"],
  },
  {
    title: "Accepted",
    actors: ["Justin Long", "Blake Lively", "Jonah Hill"],
    genre: ["Comedy", "College"],
  },
  {
    title: "The Princess Bride",
    actors: ["Cary Elwes", "Robin Wright", "Mandy Patinkin"],
    genre: ["Fantasy", "Romance", "Comedy"],
  },
  {
    title: "The Princess Diaries",
    actors: ["Anne Hathaway", "Julie Andrews", "Hector Elizondo"],
    genre: ["Romance", "Family", "Comedy"],
  },
  {
    title: "X-Men",
    actors: ["Hugh Jackman", "Sir Patrick Stewart", "Sir Ian McKellen"],
    genre: ["Action", "Superhero", "Fantasy"],
  },
  {
    title: "Tangled",
    actors: ["Mandy Moore", "Zachary Levi", "Donna Murphy"],
    genre: ["Family", "Adventure", "Animation"],
  },
  {
    title: "The Hunger Games",
    actors: ["Jennifer Lawrence", "Josh Hutcherson", "Donald Sutherland"],
    genre: ["Adventure", "Action", "Drama"],
  },
  {
    title: "Spider-Man: Homecoming",
    actors: ["Tom Holland", "Zendaya", "Michael Keaton"],
    genre: ["Action", "Superhero", "Comedy"],
  },
];

app.use(morgan("common"));

app.get("/movies", (req, res) => {
  res.json(Movies);
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
