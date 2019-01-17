const db = require("../models");
var jwt = require("jsonwebtoken");

exports.onGetAnswers = async function(req, res, next){
  try {
    if(req.headers.authorization){
      const token = req.headers.authorization.split(" ")[1];
      var decoded = jwt.verify(token, process.env.SECRET_KEY);
      if(decoded) {
        let foundUser = await db.User.find({ "_id": decoded.id }, "username answersReceived")
                                     .populate({
                                       path: "answersReceived",
                                       match: { "postedTo": {"$ne": decoded.id} },
                                       populate: {
                                         path: "postedBy postedTo question",
                                         select: ["text", "createdAt", "_id", "username", "answer"],
                                         populate: {
                                           path: "answer",
                                           select: ["text"],
                                           populate: {
                                             path: "likesReceivedPost",
                                             populate: {
                                               path: "likedBy",
                                               select: "username"
                                             }
                                           }
                                         }
                                       },
                                       options: {
                                         limit: 6,
                                         skip: Number(req.params.num),
                                         sort: { createdAt: "desc" }
                                       }
                                     })
                                     .exec();

        const appendResults = [...foundUser, {status: foundUser[0].answersReceived.length === 6 ? true : false}];

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
