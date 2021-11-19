const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//Returns all the movies.
function listAllMovies() {
  return knex("movies").select("*");
}

//Returns only the movies that are showing.
function listShowingMovies() {
  return knex("movies as m")
    .join("movies_theaters as mt", { "m.movie_id": "mt.movie_id" })
    .join("theaters as t", { "mt.theater_id": "t.theater_id" })
    .select("m.*")
    .where({ is_showing: true })
    .distinct();
}

//Returns the specific movie that matches the :movieId.
function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

//Returns the theaters for the specific movie.
function theaters(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", { "mt.theater_id": "t.theater_id" })
    .select("*")
    .where({ movie_id: movieId })
    .distinct();
}

//maps the critics the data for reviews.
const critics = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

//Returns reviews for the movie with mapped critic data.
function reviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", { "r.critic_id": "c.critic_id" })
    .select("r.*", "c.*")
    .where({ movie_id: movieId })
    .then((data) => data.map(critics));
}

module.exports = {
  listAllMovies,
  listShowingMovies,
  read,
  theaters,
  reviews,
};
