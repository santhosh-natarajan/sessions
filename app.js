const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//Create the express application
var app = express();

//Database
const dbString = "mongodb://localhost:27017/sessions";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.createConnection(dbString);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Session Store Implmentation
//Package documentation - https://www.npmjs.com/package/connect-mongo

const sessionStore = new MongoStore({
  mongoUrl: dbString,
  mongoOptions: dbOptions,
  collectionName: "sessions",
});

app.use(
  session({
    secret: "keyboard mouse",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res, next) => {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.send(
    `<h1>You have visited this pagae ${req.session.viewCount} times.</h1>`
  );
});

app.listen(3000);
