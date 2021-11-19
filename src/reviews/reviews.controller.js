const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Middleware that checks to see if Review exists.
async function reviewExists(req, res, next) {
  const review = await reviewsService.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

// returns specific review with critics.
async function read(req, res, next) {
  const { review } = res.locals;
  const data = await reviewsService.readCritics(review.review_id);
  res.json({ data });
}

//Updates the function.
async function update(req, res, next) {
  const { review } = res.locals;
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  let data = await reviewsService.update(updatedReview);
  data = await reviewsService.readCritics(review.review_id);
  res.json({ data: data[0] });
}

//Destroys the review.
async function destroy(req, res) {
  const { review } = res.locals;
  await reviewsService.destroy(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
