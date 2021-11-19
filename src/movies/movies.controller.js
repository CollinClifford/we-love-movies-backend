const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Middleware that determines if the :movieId exists.
async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found` });
}

//Lists all the movies if isShowing is not in the query otherrwise it lists just the ones that are showing.
async function list(req, res, next) {
  const isShowing = req.query.is_showing;
  if (!isShowing) {
    const data = await moviesService.listAllMovies();
    res.json({ data });
  } else {
    const data = await moviesService.listShowingMovies();
    res.json({ data });
  }
}

//Returns specific title based on :movieId.
function read(req, res, next) {
  const { movie: data } = res.locals;
  res.json({ data });
}

//Returns specific theater for :movieId.
async function readTheaters(req, res, next) {
  const { movieId } = req.params;
  let theaters = await moviesService.theaters(movieId);
  res.json({ data: theaters });
}

//Returns specifc reviews for :movieId.
async function readReviews(req, res, next) {
  const { movieId } = req.params;
  let reviews = await moviesService.reviews(movieId);
  res.json({ data: reviews });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  readTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheaters),
  ],
  readReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readReviews),
  ],
};
