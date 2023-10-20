const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.createComment = async function (req, res) {
  try {
    await Post.findById(req.body.post)
      .exec()
      .then((foundPost) => {
        const newComment = new Comment({
          content: req.body.content,
          post: foundPost._id,
          user: req.user._id,
        });
        newComment.save().then(async (savedComment) => {
          foundPost.comments.push(savedComment._id);
          console.log(foundPost);
          try {
            await Post.findByIdAndUpdate(req.body.post, {
              comments: foundPost.comments,
            });
            req.flash("success", "Comment Published!");
            return res.redirect("/");
          } catch (err) {
            console.log("error in finding updating the post");
            req.flash("error", err);
            return res.redirect("back");
          }
        });
      });
  } catch (err) {
    console.log("Error in finding the post", err);
    req.flash("error", err);
  }
};

module.exports.destroyComment = async function (req, res) {
  try {
    const commentFound = await Comment.findById(req.params.id).exec();
    if (commentFound && commentFound.user == req.user.id) {
      const postID = commentFound.post;
      try {
        await Comment.deleteOne({ _id: commentFound._id });
        await Post.findByIdAndUpdate(postID, {
          $pull: { comments: req.params.id },
        });
        req.flash("success", "Deleted comment!");
        return res.redirect("back");
      } catch (err) {
        console.log(
          "Error finding the post for which the comment is to be deleted: ",
          err
        );
        req.flash("error", err);
      }
    }
  } catch (err) {
    console.log("Error finding the comments: ", err);
    req.flash("error", err);
  }
  return res.redirect("back");
};
