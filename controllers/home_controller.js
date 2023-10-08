const Post = require("../models/post");

module.exports.home = async function (req, res) {
  try {
    const posts = await Post.find({}).populate("user").exec();
    return res.render("home", {
      title: "CODIAL | HOME",
      posts: posts,
    });
  } catch (err) {
    console.log("Cannot find the posts", err);
  }
};

//module.exports.actionName = function(req,res){};
