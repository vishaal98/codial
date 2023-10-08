const Post = require("../models/post");

module.exports.posts = function (req, res) {
  res.send("<h1>POSTS</h1>");
};

module.exports.createPost = function (req, res) {
  try {
    Post.create({
      content: req.body.content,
      user: req.user._id,
    });
  } catch (err) {
    console.log("Error creating the Post", err);
  }
  return res.redirect("back");
};
