const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  // console.log(req.body);
  let { id } = req.body;
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  console.log(newReview);
  newReview.author = req.user._id;
  // console.log(newReview.author);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review update successfully");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};
