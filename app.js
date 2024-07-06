const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const listing = require("../MAJORPROJECT/models/listing.js");
const Listing = require("../MAJORPROJECT/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("@simonsmith/ejs-mate");
const { url } = require("inspector");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utility/expressError.js");
const wrapAsync = require("./utility/wrapasync.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connected TO DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("HI. I AM ROOT");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render(__dirname + "/views/listings/index.ejs", { allListings });
});

// new route
app.get("/listings/new", (req, res) => {
  res.render(__dirname + "/views/listings/new.ejs");
});
//create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { title, description, image, price, country, location } = req.body;
    //  let listing = req.body.listing;
    //  console.log(listing);
    //  res.send("listing added")
    // console.log(req.body.listing);
    // res.send("anything")

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render(__dirname + "/views/listings/show.ejs", { listing });
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render(__dirname + "/views/listings/edit.ejs", { listing });
});

//update route

app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});
app.use((err, req, res, next) => {
  let { statuscode = 500, message = "something went wrong" } = err;
  res
    .status(statuscode)
    .render(__dirname + "/views/listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

// app.get("/testListing",async (req,res)=>{
//      let sampleListing = new listing ({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "calangute Goa",
//         country:"India",
//      });

//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("successful testing");

// });
