const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment_controller");
const passport = require("passport");

//router.get("/", commentController.comments);
router.post(
  "/create-comment",
  passport.checkAuthentication,
  commentController.createComment
);

module.exports = router;
