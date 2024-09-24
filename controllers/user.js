const User = require("../models/user");

module.exports.renderSignUp = (req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser,(err)=>{
        if(err){
          next(err);
        }
        req.flash("success", "welcome to wanderlust");
        res.redirect("/listings");
      })
   
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.login =  async (req, res) => {
    
    req.flash("success", "Welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    if(redirectUrl.includes("reviews")){
      res.redirect(`/listings`);
    }
    else{
      res.redirect(redirectUrl);
    }
  }

  module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you logged out ");
      res.redirect("/listings");
    });
  }


  