var createError = require("http-errors");
var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRoute = require("./routes/auth");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false })); /* รับข้อมูลแบบ form */
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

/** database */
const config = {
  autoIndex: true,
  useNewUrlParser: true,
  dbName: "mongodbDatabase",
};

// const connectionString = 'mongodb://localhost:27018/?readPreference=primary&ssl=false&directConnection=true'
const connectionString = "mongodb://localhost:27018";
mongoose
  .connect(connectionString, config)
  .then(() => {
    console.log("Connected to Mongo DB...");
  })
  .catch((err) => {
    console.log("Error", err);
  });

// app.use('/', indexRouter);
// app.use('/login', auth);
app.use('/users', usersRouter);
app.use("/auth", authRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
