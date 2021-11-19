const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//Reduces the data.
const reduceTheatersAndMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  is_showing: ["movies_theaters", null, "is_showing"],
  theater_id: ["theater", null, "theater_id"],
});

//Selects the data and then runs it through the reducer.
function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", { "mt.theater_id": "t.theater_id" })
    .join("movies as m", { "m.movie_id": "mt.movie_id" })
    .select("*")
    .then((data) => reduceTheatersAndMovies(data));
}

module.exports = {
  list,
};
