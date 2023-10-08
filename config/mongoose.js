const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/codial_db");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to the DB"));
db.once("open", function () {
  console.log("Server connected to the DB successfully");
});

module.exports = db;
