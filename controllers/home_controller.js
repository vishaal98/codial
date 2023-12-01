const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    const posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    const users = await User.find({});

    return res.render("home", {
      title: "CODIAL | HOME",
      posts: posts,
      all_users: users ? users : [],
    });
  } catch (err) {
    console.log("Cannot find the posts", err);
  }
};

//module.exports.actionName = function(req,res){};
