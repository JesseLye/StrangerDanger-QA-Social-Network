const mongoose = require("mongoose");
const User = require("./user");
const Question = require("./question");

const answerSchema = mongoose.Schema(
  {
    postedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    text: {
      type: String,
      required: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },
    likesReceivedPost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
      }
    ]
  },
  {
    timestamps: true
  }
);

answerSchema.pre("remove", async function(next){
  // upon removing a question, all likes within a user's likesgiven/likesreceived must be removed
  // if an answer is removed, perform the same function and remove all items from the likesreceived array
  try {
    let newArr = [];
    let foundUser = await User.findById(this.postedTo);
    let userReceived = foundUser.answersReceived.filter(d => d === this._id);
    var criteriaArr = [];

    if(userReceived){
      criteriaArr.push("answersGiven");
      newArr.push(foundUser);
    } else {
      return next();
    }

    if(this.postedBy){
      let foundUserAsker = await User.findById(this.postedBy);
      newArr.push(foundUserAsker);
      criteriaArr.push("answersReceived");
    }

    await Question.findOne({"_id": this.question}, async function(err, question){
      question.answer = undefined;
      await question.save();
    });

    for(var i = 0; i < newArr.length; i++){
      await newArr[i][criteriaArr[i]].remove(this._id);
      await newArr[i].save();
    }

    return next();
  } catch (err) {
    return next(err);
  }
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
