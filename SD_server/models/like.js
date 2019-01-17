const mongoose = require("mongoose");
const User = require("./user");
const Question = require("./question");

const likeSchema = new mongoose.Schema(
  {
    likedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

// Prior to saving, the following actions must be performed
// - Adding "LikesReceived" from user1
// - Adding "LikesGiven" from user2
// - Adding "LikesReceived" from Questions
//
// You can perform that particular action either here or within
// the route which calls the function to add a like to the database.

// Prior to removal, the following actions must be performed
// - Removing "LikesReceived" from user1
// - Removing "LikesGiven" from user2
// - Removing "LikesReceived" from Questions

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
