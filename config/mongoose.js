const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to the DB"));
db.once("open", function () {
  console.log("Server connected to the DB successfully");
});

module.exports = db;
