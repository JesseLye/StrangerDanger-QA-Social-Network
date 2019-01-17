const db = require("../models");
var jwt = require("jsonwebtoken");

exports.onGetDashboard = async function(req, res, next){
  try {
    if(req.headers.authorization){
      const token = req.headers.authorization.split(" ")[1];
      var decoded = jwt.verify(token, process.env.SECRET_KEY);
      if(decoded) {
        let foundUser = await db.User.find({ "_id": decoded.id }, "username questionsReceived")
                                     .populate({
                                       path: "questionsReceived",
                                       match: { "answer": {"$exists": false} },
                                       options: {
                                         limit: 6,
                                         skip: Number(req.params.num),
                                         sort: { createdAt: "desc" }
                                       },
                                       populate: {
                                         path: "postedBy postedTo",
                                         select: "username"
                                       }
                                     })
                                     .exec();

        const appendResults = [...foundUser, {status: foundUser[0].questionsReceived.length === 6 ? true : false}];

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
