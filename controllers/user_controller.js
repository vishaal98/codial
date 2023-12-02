const User = require("../models/user");
const fs = require("fs");
const path = require("path");
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
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("********MULTER ERROR: ", err);
          req.flash("error", err.code + ": 2MB");
        }
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            let filePath = path.join(__dirname, "..", user.avatar);
            fs.access(filePath, fs.constants.F_OK, (err) => {
              if (err) {
                console.error(`The file '${filePath}' does not exist.`);
              } else {
                console.log(`The file '${filePath}' exists.`);
                fs.unlinkSync(filePath);
              }
            });
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      console.log("Error finding an updating the user: ", err);
      return res.status(404).send("internal Server Error");
    }
  } else {
    req.flash("error", "Unauthorized");
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
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

//logout login
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out");
    return res.redirect("/");
  });
};
