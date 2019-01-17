const db = require("../models");
var jwt = require("jsonwebtoken");

exports.onGetFeed = async function(req, res, next){
  try {
    if(req.headers.authorization){
      const token = req.headers.authorization.split(" ")[1];
      var decoded = jwt.verify(token, process.env.SECRET_KEY);
      if(decoded) {
        let foundUser = await db.User.find({ "_id": decoded.id }, "profileFollowing");

        let foundQuestions = await db.Question.find({
          postedTo: {$in: [
            ...foundUser[0].profileFollowing
          ]},
          answer: { $exists: true }
        },
        null,
        {
            limit: 6,
            skip: Number(req.params.num)
        }
      )
        .populate({
          path: "postedBy postedTo answer",
          select: "username text",
          populate: {
            path: "likesReceivedPost",
            populate: {
              path: "likedBy",
              select: "username"
            }
          }
        })
        .sort({ createdAt: "desc" })
        .exec();

        const appendResults = [[...foundQuestions], {status: foundQuestions.length === 6 ? true : false}];

        return res.status(200).json(appendResults);
      }
    } else {
      return next({
        status: 401,
        message: "Unauthorized"
      });
    }
  } catch (err) {
    return next(err);
  }
};
