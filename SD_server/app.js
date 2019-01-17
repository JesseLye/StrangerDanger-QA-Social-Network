require("dotenv").config();
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      morgan = require("morgan"),
      authRoutes = require("./routes/auth"),
      profileRoutes = require("./routes/profile"),
      actionRoutes = require("./routes/actions"),
      resetRoutes = require("./routes/reset"),
      errorHandler = require("./handlers/error"),
      dashboardRoutes = require("./routes/dashboard"),
      answerRoutes = require("./routes/answer"),
      feedRoutes = require("./routes/feed"),
      searchRoutes = require("./routes/search"),
      { loginRequired } = require("./middleware/auth"),
      jwt = require("jsonwebtoken"),
      mongoose = require("mongoose"),
      db = require("./models"),
      PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use("/api/auth", authRoutes);
app.use("/api/user/:id", profileRoutes);
app.use("/api/actions", loginRequired, actionRoutes);
app.use("/api/reset", resetRoutes);
app.use("/api/dashboard", loginRequired, dashboardRoutes);
app.use("/api/answersReceived", loginRequired, answerRoutes);
app.use("/api/feed", loginRequired, feedRoutes);
app.use("/api/search", searchRoutes);

app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, function(){
  console.log("Running!");
});
