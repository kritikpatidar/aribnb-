require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MAJORPROJECT/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("@simonsmith/ejs-mate");
const { url } = require("inspector");
const ExpressError = require("./utility/expressError.js");
const routerListings = require("../MAJORPROJECT/router/listing.js");
const routerReviews = require("../MAJORPROJECT/router/review.js");
const routerUser = require("../MAJORPROJECT/router/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
  await mongoose.connect(dbURL);

}

main()
  .then(() => {
    console.log("connected TO DB");
  })
  .catch((err) => {
    console.log(err);
  });

  const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
       secret: process.env.SECRET,
    },
    touchAfter:24*3600,
  });

store.on("error", ()=>{
  console.log("error in MONGO SESSION STORE",err);
  
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("HI. I AM ROOT");
// });




app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.use("/demouser",async (req,res)=>{
//   let fakeUser = new User({
//     email: "kritik@gmail.com",
//     username: "guru_user"
//   });
//   let registerUser = await User.register(fakeUser,"helloworld"); // to store users username and password in database we use regiter function
//   res.send(registerUser);
// });

app.use("/listings", routerListings);
app.use("/listings/:id/reviews", routerReviews);
app.use("/", routerUser);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "page not found"));
// });
// app.use((err, res, next) => {
//   let { statuscode = 500, message = "something went wrong" } = err;
//   res
//     .status(statuscode)
//     .render(__dirname + "/views/listings/error.ejs", { message });
// });

app.listen(3000, () => {
  console.log("server is listening to port 8080");
});
