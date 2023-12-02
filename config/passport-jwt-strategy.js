const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const User = require("../models/user");

let options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRETE,
};

passport.use(
  new JWTStrategy(options, async function (jwt_payload, done) {
    try {
      let user = await User.findById(jwt_payload._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      console.log("User not found: ", err);
      return done(err, false);
    }
  })
);

module.exports = passport;
