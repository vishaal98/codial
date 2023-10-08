const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email }).exec();
        if (!user || user.password != password) {
          console.log("Invalid Username/Password");
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        console.log("Error in finding User --> Passport");
        return done(err);
      }
    }
  )
);

//Serializinf the user to decide which key to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id).exec();
  if (!user) {
    console.log("Error in finding the User --> Passport");
    return done(err);
  }
  return done(null, user);
});

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  //if user is not signed in
  return res.redirect("/users/login");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }
  next();
};

//check if the user is already signed in
passport.checkUserSignedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("back");
  }
  return next();
};

module.exports = passport;
