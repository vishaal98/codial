const User = require("../models/user");

//module.exports.actionName = function(req,res){};

module.exports.profile = async function (req, res) {
  try {
    const user = await User.findById(req.params.id).exec();
    if (user) {
      res.render("user_profile", {
        title: "User Profile",
        profile_user: user,
      });
    }
  } catch (err) {
    console.log("error finding the user to display profile: ", err);
  }
};

module.exports.updateUser = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      await User.findByIdAndUpdate(req.params.id, req.body);
      return res.redirect("/");
    } catch (err) {
      console.log("Error finding an updating the user: ", err);
      return res.status(404).send("internal Server Error");
    }
  } else {
    return res.status(401).send("Unauthorised");
  }
};

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
