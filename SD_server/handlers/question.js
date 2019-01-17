const db = require("../models");
var jwt = require("jsonwebtoken");

exports.onGetProfile = async function(req, res, next){
  try {
    let foundUser = await db.User.find({"_id": req.params.id}, "_id username questionsReceived")
                                  .populate([{
                                    path: "questionsReceived",
                                    match: { "answer": {"$exists": true } },
                                    options: {
                                      limit: 6,
                                      skip: Number(req.params.num),
                                      sort: { createdAt: "desc" }
                                    },
                                    populate: {
                                        path: "answer postedBy postedTo likesReceived",
                                        select: ["text", "createdAt", "_id", "username"],
                                        populate: {
                                          path: "likesReceivedPost",
                                          populate: {
                                            path: "likedBy",
                                            select: "username"
                                          }
                                        }
                                      }
                                    },
                                    { path: "profileFollowers", select: ["_id", "username"] },
                                    { path: "profileFollowing", select: ["_id", "username"] },
                                  ])
                                  .sort({ createdAt: "desc" })
                                  .exec();

    const appendResults = [...foundUser, {status: foundUser[0].questionsReceived.length === 6 ? true : false}];

    return res.status(200).json(appendResults);
  } catch (err) {
    return next(err);
  }
};

exports.onSubmitQuestion = async function(req, res, next){
  try {
    let foundUser = await db.User.findById(req.params.id);
    var question = await db.Question.create({
      postedTo: req.params.id,
      text: req.body.text
    });

    foundUser["questionsReceived"].push(question.id);
    await foundUser.save();

    if(req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      var decoded = jwt.verify(token, process.env.SECRET_KEY);
      if(decoded) {
        let foundUserAsker = await db.User.findById(decoded.id);
        foundUserAsker.questionsGiven.push(question._id);
        await foundUserAsker.save();
        await db.Question.updateOne({ _id: question._id }, { postedBy: foundUserAsker._id });
      }
    }

    let foundQuestion = await db.Question.findById(question._id).populate("postedTo", {
      username: true
    });

    return res.status(200).json(foundQuestion);
  } catch (err) {
    return next(err);
  }
};

exports.onSubmitAnswer = async function(req, res, next){
  try {
    // let foundQuestion = await db.Question.findById(req.params.question_id);
    let foundUser = await db.User.findById(req.params.id);
    let findQuestion = foundUser.questionsReceived.filter(q => q == req.params.question_id);

    if(!findQuestion){
      return next({
        status: 401,
        message: "Unauthorized"
      });
    }

    let foundQuestion = await db.Question.findById(findQuestion[0]);
    // Get the question 'n' shit
    if(foundQuestion.answer){
      return next({
        status: 401,
        message: "One answer per question"
      });
    }

    // throw in postedBy (if applicable)
    let answerObj = {
      postedTo: req.params.id,
      text: req.body.text,
      question: req.params.question_id
    };

    if(foundQuestion.postedBy) {
      answerObj["postedBy"] = foundQuestion.postedBy;
    }

    let answer = await db.Answer.create(answerObj);

    if("postedBy" in answerObj){
      let foundUserAsker = await db.User.findById(foundQuestion.postedBy);
      foundUserAsker.answersReceived.push(answer._id);
      await foundUserAsker.save();
    }

    await db.Question.updateOne({ _id: foundQuestion._id }, { answer: answer._id });
    foundUser.answersGiven.push(answer._id);
    await foundUser.save();

    let foundAnswer = await db.Answer.findById(answer._id).populate("username", {
      username: true
    });
    return res.status(200).json(foundAnswer);
  } catch (err) {
    return next(err);
  }
}

exports.onDeleteQuestion = async function(req, res, next){
  try {
    let deleteQuestion = await db.Question.findById(req.params.question_id);

    if(deleteQuestion.answer){
      let deleteAnswer = await db.Answer.findById(deleteQuestion.answer);
      await deleteAnswer.remove();
    }

    await deleteQuestion.remove();
    return res.status(200).json(deleteQuestion);
  } catch (err) {
    return next(err);
  }
}

exports.onDeleteAnswer = async function(req, res, next){
  try {
    let deleteAnswer = await db.Answer.findById(req.params.answer_id);
    await deleteAnswer.remove();
    return res.status(200).json(deleteAnswer);
  } catch (err) {
    return next(err);
  }
}
