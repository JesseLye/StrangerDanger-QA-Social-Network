const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/CuriousCatClone", {
  keepAlive: true
});

module.exports.User = require("./user");
module.exports.Question = require("./question");
module.exports.Answer = require ("./answer");
module.exports.Like = require ("./like");
