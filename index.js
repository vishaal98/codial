const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = 3000;
const app = express();
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//used for session cookies
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");

//setup up the SASS middleware
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

//for req header decoding
app.use(express.urlencoded());

//for cookies
app.use(cookieParser());

app.use(express.static("./assets"));

//let the server know to use the uploads folder when url hits a path starting with /uploads
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(expressLayouts);
//extract styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//set up cookie session
//MongoStore is used to store the session cookie in the DB
const sessionStorage = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/",
  dbName: "codial_db",
  collectionName: "session",
  autoRemove: "disabled",
});
app.use(
  session({
    name: "Codial",
    //TODO: change the secrete before deploying to production
    secret: "thisismytemporarysecrete",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: sessionStorage,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

//use express router
app.use("/", require("./routes/index"));

//Start the server
app.listen(PORT, function (err) {
  if (err) {
    console.log("Error starting the server:", err);
    return;
  }
  console.log("Server Started successfully on PORT:", PORT);
});
