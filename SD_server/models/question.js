const mongoose = require("mongoose");
const User = require("./user");
// const Answer = require("./answer");


const questionSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer"
    },
    postedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

questionSchema.pre("remove", async function(next){
  // upon removing a question, all likes within a user's likesgiven/likesreceived must be removed
  // if an answer is removed, perform the same function and remove all items from the likesreceived array
  try {
    let newObj = {userArr: []};
    let foundUser = await User.findById(this.postedTo);
    newObj.userArr.push(foundUser);

    if(this.postedBy){
      let foundUserAsker = await User.findById(this.postedBy);
      newObj.userArr.push(foundUserAsker);
    }

    // if(this.answer){
    //   newObj["answerObj"] = {id: this.answer, answerBoolean: [true, false]};
    //   if(newObj.userArr.length === 2){
    //     newObj.answerObj.answerBoolean[1] = true;
    //   }
    // }

    var criteriaArr = ["questionsReceived", "questionsGiven"];
    // var ifAnswer = "answerObj" in newObj;
    for(var i = 0; i < newObj.userArr.length; i++){
      // Remove Question
      newObj.userArr[i][criteriaArr[0]].remove(this.id);
      // if(ifAnswer && newObj.answerObj.answerBoolean[i]){
      //   // Remove Answer (if applicable)
      //   newObj.userArr[i][criteriaArr[1]].remove(newObj.answerObj.id);
      // }
      await newObj.userArr[i].save();
      criteriaArr.splice(0, 1);
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
