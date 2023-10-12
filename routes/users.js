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
  userController.create_session
);

router.get("/logout", userController.destroySession);

module.exports = router;
