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
  } catch (err) {
    console.log("Error creating the Post", err);
  }
  return res.redirect("back");
};

module.exports.detroyPost = async function (req, res) {
  const postFound = await Post.findById(req.params.id).exec();
  if (postFound) {
    if (postFound.user.toString() == req.user.id) {
      try {
        await Post.findByIdAndDelete(req.params.id);
      } catch (err) {
        console.log("Error deleting the post", err);
      }
      try {
        await Comment.deleteMany({ post: req.params.id });
      } catch (err) {
        console.log("Error deleting the comment", err);
      }
      return res.redirect("back");
    }
  } else {
    return res.redirect("back");
  }
};
