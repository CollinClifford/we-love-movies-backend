const knex = require("../db/connection");

//maps out Reviews/Critics for return.
function critics(reviews) {
  return reviews.map((review) => {
    return {
      review_id: review.review_id,
      content: review.content,
      score: review.score,
      critic_id: review.critic_id,
      movie_id: review.movie_id,
      created_at: review.created_at,
      updated_at: review.updated_at,
      critic: {
        preferred_name: review.preferred_name,
        surname: review.surname,
        organization_name: review.organization_name,
        created_at: review.created_at,
        updated_at: review.updated_at,
      },
    };
  });
}

//fetches the review from reviewId parameters for middleware.
function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

//fetches the review and maps out with critics.
function readCritics(reviewId) {
  return knex("reviews as r")
    .join("critics as c", { "r.critic_id": "c.critic_id" })
    .select("*")
    .where({ review_id: reviewId })
    .then(critics);
}

//updates the review based on the reviewId.
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

//Destroys the review based on the reviewId.
function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
  read,
  readCritics,
  update,
  destroy,
};
