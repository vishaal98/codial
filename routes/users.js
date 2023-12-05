const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const passport = require("passport");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userController.profile
);
router.post(
  "/update-profile/:id",
  passport.checkAuthentication,
  userController.updateUser
);
router.get("/register", userController.register);
router.get("/login", passport.checkUserSignedIn, userController.login);

router.post("/create-user", userController.create);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  userController.createSession
);

router.get("/logout", userController.destroySession);

//google sign in
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  userController.createSession
);

module.exports = router;
