const mongoose = require("mongoose");
let bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birthyear: Date,
    Deathyear: Date,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: { type: Date, required: true },
  FavMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statistics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// let genreSchema = mongoose.Schema({
//   Name: { type: String, required: true },
//   Description: { type: String, required: true },
// });

// let directorSchema = mongoose.Schema({
//   Name: { type: String, required: true },
//   Bio: { type: String, required: true },
// });

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
// let Genre = mongoose.model("Genre", genreSchema);
// let Director = mongoose.model("Director", directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
// module.exports.Genre = Genre;
// module.exports.Director = Director;
