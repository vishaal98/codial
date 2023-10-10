const express = require("express");
const router = express.Router();
const postController = require("../controllers/post_controller");
const passport = require("passport");

//router.get("/", postController.posts);
router.post(
  "/create-post",
  passport.checkAuthentication,
  postController.createPost
);

router.get(
  "/delete-post/:id",
  passport.checkAuthentication,
  postController.detroyPost
);

module.exports = router;
