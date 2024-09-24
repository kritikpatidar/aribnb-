const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

const wrapAsync = require("../utility/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.createListing)
  ); //create route
 

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //show route

  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  ) //update route

  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //delete route

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
