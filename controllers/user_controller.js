const User = require("../models/user");

module.exports.profile = function (req, res) {
  res.render("user_profile", {
    title: "User Profile",
  });
};

//module.exports.actionName = function(req,res){};

module.exports.register = function (req, res) {
  res.render("register", {
    title: "Register",
  });
};

module.exports.login = function (req, res) {
  res.render("login", {
    title: "Login",
  });
};

//register a user
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      User.create(req.body);
      return res.redirect("/users/login");
    } else {
      res.redirect("back");
    }
  } catch (err) {
    console.log("Error in finding or creating the user", err);
    return;
  }
};

//sign in and create a session
module.exports.create_session = function (req, res) {
  return res.redirect("/");
};

//logout login
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
};
