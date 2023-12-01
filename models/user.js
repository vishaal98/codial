const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/users/avatars");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, JPG, or PNG files are allowed."),
      false
    );
  }
};

//static methods
UserSchema.statics.uploadedAvatar = multer({
  storage: storage,
  limits: {
    fileSize: 124 * 124 * 2, // Limit file size to 2MB (in bytes)
  },
  fileFilter: fileFilter,
}).single("avatar");
UserSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model("User", UserSchema);

module.exports = User;
