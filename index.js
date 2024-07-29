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
    title: "",
    actors: [],
    genre: [],
  },
  {
    title: "",
    actors: [],
    genre: [],
  },
  {
    title: "",
    actors: [],
    genre: [],
  },
  {
    title: "",
    actors: [],
    genre: [],
  },
  {
    title: "",
    actors: [],
    genre: [],
  },
  {
    title: "",
    actors: [],
    genre: [],
  },
  {
    title: "",
    actors: [],
    genre: [],
  },
  {
    title: "",
    actors: [],
    genre: [],
  },
  {
    title: "",
    actors: [],
    genre: [],
  },
];

app.use(morgan("common"));

app.get("/movies", (req, res) => {
  res.json(Movies);
});

app.get("/", (req, res) => {
  res.send("There is nothing here!.");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
