const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

//define options for google login
const options = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};
//tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(options, async function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    try {
      //find user in our database
      let user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        //if user is found sign in the user and set the user in req.user
        console.log(profile);
        return done(null, user);
      } else {
        //if not found then create a new user in our database
        User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString("hex"),
        });
        return done(null, user);
      }
    } catch (err) {
      console.log("Error in google Strategy Passport: ".err);
      return;
    }
  })
);
