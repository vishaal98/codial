const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.posts = function (req, res) {
  res.send("<h1>POSTS</h1>");
};

module.exports.createPost = function (req, res) {
  try {
    Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    req.flash("success", "Post Published!");
  } catch (err) {
    console.log("Error creating the Post", err);
    req.flash("error", err);
  }
  return res.redirect("back");
};

module.exports.detroyPost = async function (req, res) {
  const postFound = await Post.findById(req.params.id).exec();
  if (postFound) {
    if (postFound.user.toString() == req.user.id) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ post: req.params.id });
        req.flash("success", "Post Deleted");
      } catch (err) {
        console.log("Error:  ", err);
        req.flash("error", err);
      }
      return res.redirect("back");
    }
  } else {
    return res.redirect("back");
  }
};
