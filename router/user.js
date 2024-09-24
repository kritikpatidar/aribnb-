const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapasync = require("../utility/wrapasync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");
const { route } = require("./listing");

router
  .route("/signup")
  .get(userController.renderSignUp)
  .post(userController.signUp);

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logOut);

module.exports = router;
