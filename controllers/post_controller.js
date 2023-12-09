const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const postMailer = require("../mailers/posts_mailer");

module.exports.posts = function (req, res) {
  res.send("<h1>POSTS</h1>");
};

module.exports.createPost = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    // let user = await User.findById(req.user._id);
    let populatedPost = await Post.populate(post, {
      path: "user",
      select: "name email",
    });

    postMailer.newPost(populatedPost);

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: populatedPost,
          // user: user.name,
          message: "Post Created",
        },
      });
    }
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
        let post = await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ post: req.params.id });

        if (req.xhr) {
          return res.status(200).json({
            data: {
              post_id: post._id,
            },
            message: "Post deleted",
          });
        }

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
