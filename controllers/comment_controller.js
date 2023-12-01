const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.createComment = async function (req, res) {
  try {
    let foundPost = await Post.findById(req.body.post);

    if (foundPost) {
      let newComment = await Comment.create({
        content: req.body.content,
        post: foundPost._id,
        user: req.user._id,
      });
      foundPost.comments.push(newComment);
      // console.log(foundPost);
      foundPost.save();

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: newComment,
            message: "Comment Created",
          },
        });
      }

      req.flash("success", "Comment Published!");
      return res.redirect("/");
    }
  } catch (err) {
    console.log("Error in finding the post", err);
    req.flash("error", err);
  }
};

module.exports.destroyComment = async function (req, res) {
  try {
    const commentFound = await Comment.findById(req.params.id);
    if (commentFound && commentFound.user == req.user.id) {
      const postID = commentFound.post;
      await Comment.deleteOne({ _id: commentFound._id });
      await Post.findByIdAndUpdate(postID, {
        $pull: { comments: req.params.id },
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: commentFound._id,
          },
          message: "Commented Deleted",
        });
      }

      req.flash("success", "Deleted comment!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error finding the comments: ", err);
    req.flash("error", err);
  }
  return res.redirect("back");
};
