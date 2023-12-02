const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
module.exports.index = async function (req, res) {
  const posts = await Post.find({})
    .sort("-createdAt")
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "-password",
      },
    });

  return res.status(200).json({
    message: "List of posts",
    posts: posts,
  });
};

module.exports.detroyPost = async function (req, res) {
  try {
    let post = await Post.findByIdAndDelete(req.params.id);
    if (post) {
      if (post.user == req.user.id) {
        await Comment.deleteMany({ post: req.params.id });
        return res.status(200).json({
          message: "Post and associated comments deleted Successfully",
        });
      } else {
        return res.status(401).json({
          message: "You are not authorized to delete this post",
        });
      }
    } else {
      res.status(404).json({
        message: "Post Not Found with the ID" + req.params.id,
      });
    }
  } catch (err) {
    console.log("Error:  ", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
