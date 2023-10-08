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
            return res.redirect("/");
          } catch (err) {
            console.log("error in finding updating the post");
          }
        });
      });
  } catch (err) {
    console.log("Error in finding the post", err);
  }
};
