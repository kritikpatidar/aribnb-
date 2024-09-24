const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utility/expressError.js");
const wrapAsync = require("../utility/wrapasync.js");
const {
  validateReview,
  isOwner,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// review route
// post review
router.post(
  "/",
  // validateReview,
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

// delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
