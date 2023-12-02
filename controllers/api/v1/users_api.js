const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: "Invalid Username or Password",
      });
    }

    return res.status(200).json({
      message: "Sign in Successfull, here is your token, please save it",
      data: {
        token: jwt.sign(user.toJSON(), process.env.JWT_SECRETE, {
          expiresIn: "100000",
        }),
      },
    });
  } catch (err) {
    console.log("*******", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
