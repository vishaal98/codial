const likeController = require("../models/like");
const postController = require("../models/post");
const commentController = require("../models/comment");
const Post = require("../models/post");
const Like = require("../models/like");

module.exports.toggleLike = async function (req, res) {
  try {
    //likes/toggle/?id=ababab&type=Post
    let likedOn;
    let deleted = false;

    if (req.query.type == "Post") {
      likedOn = await Post.findById(req.query.id).populate("likes");
    } else {
      likedOn = await Comment.findById(req.query.id).populate("likes");
    }

    //chck if a like already exist
    let existingLike = await Like.findOne({
      likedOn: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });

    if (existingLike) {
      //delete the like
      likedOn.likes.pull(existingLike._id);
      await existingLike.findByIdAndDelete(existingLike._id);
      deleted = true;
    } else {
      //create the like
      let newLike = await Like.create({
        user: req.user._id,
        likedOn: req.query.id,
        onModel: req.query.type,
      });
      likedOn.likes.push(newLike);
    }
    //save the changes in the DB
    likedOn.save();

    return res.status(200).json({
      message: "Like successfull",
      data: deleted,
    });
  } catch (err) {
    console.log("Error creating Like", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
