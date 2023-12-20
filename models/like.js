const mongoose = require("mongoose");

const likeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
    },
    //defines the objectID of liked object
    likedOn: {
      type: mongoose.Schema.ObjectId,
      require: true,
      refPath: "onModel",
    },
    //used to define the type of liked object since this is a dynamic reference
    onModel: {
      type: String,
      require: true,
      enum: ["Post", "Comment"],
    },
  },
  {
    timeStamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
