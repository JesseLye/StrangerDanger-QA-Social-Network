const db = require("../models");
var jwt = require("jsonwebtoken");

exports.onFollowUser = async function(req, res, next){
  await followLogic(req, res, next, true);
}
exports.onUnfollowUser = async function(req, res, next){
  await followLogic(req, res, next, false);
}

exports.onRandomProfile = async function(req, res, next){
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.SECRET_KEY);

    const findUser = await db.User.find({_id: decoded.id}, "profileFollowing");

    const selectUser = await db.User.find({ _id: { $nin: [...findUser[0].profileFollowing, findUser[0]._id]}}, "profileFollowers username answersGiven");

    let mutableSelection = [...selectUser];
    let newArr = [];

    for(var i = 0; 3 > i; i++) {
      var random = Math.floor(Math.random() * mutableSelection.length);
      if(mutableSelection[random] !== undefined){
        newArr.push(mutableSelection[random]);
      }
      mutableSelection.splice(random, 1);
    }

    return res.status(200).json(newArr);
  } catch (err) {
    return next(err);
  }
}

exports.onLike = async function(req, res, next){
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.SECRET_KEY);

    var foundAnswer = await db.Answer.findById(req.body.id)
                                     .populate("likesReceivedPost")
                                     .exec();

    var hasUser = foundAnswer.likesReceivedPost.filter(lr => lr.likedBy == decoded.id);

    var foundUser_likesGiven = await db.User.findById(decoded.id);
    var foundUser_likesReceived = await db.User.findById(foundAnswer.postedTo);

    if(hasUser.length > 0) {

      await foundUser_likesGiven.likesGiven.remove(hasUser[0]._id);
      await foundUser_likesReceived.likesReceived.remove(hasUser[0]._id);

      // remove likesReceived
      await foundAnswer.likesReceivedPost.remove(hasUser[0]._id);

      await foundAnswer.save();
      await foundUser_likesGiven.save();
      await foundUser_likesReceived.save();

      await db.Like.findByIdAndRemove(hasUser[0]._id);

      return res.status(200).json(hasUser);
    }

    var newLike = await db.Like.create({
      likeTo: foundAnswer._id,
      likedBy: foundUser_likesGiven._id
    });

    foundAnswer.likesReceivedPost.push(newLike._id);
    foundUser_likesGiven.likesGiven.push(newLike._id);
    foundUser_likesReceived.likesReceived.push(newLike._id);

    await foundAnswer.save();
    await foundUser_likesGiven.save();
    await foundUser_likesReceived.save();

    return res.status(200).json(newLike);
  } catch (err) {
    return next(err);
  }
}

async function followLogic(req, res, next, boolean) {
  try {
    // decode JWT
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.SECRET_KEY);

    if(decoded.id == req.body.user){
      return next({
        status: 401,
        message: "Don't follow yourself, you loser."
      });
    }

    // User to follow
    let followingUser = await db.User.findById(req.body.user);
    // User which is following the above
    let currentUser = await db.User.findById(decoded.id);

    // Check to see if the user is already following
    let hasFollower = followingUser.profileFollowers.filter(d => d == decoded.id);
    let followCondition = boolean ? !hasFollower.length : !!hasFollower.length;

    if(followCondition){
      var action = boolean ? "push" : "remove";
      let arrVal = [followingUser, "profileFollowers", currentUser._id,
                    currentUser, "profileFollowing", followingUser._id];

      for(var i = 0; arrVal.length > i; i++) {
        // lol
        arrVal[0][arrVal[1]][action]([arrVal[2]]);
        await arrVal[0].save();
        arrVal.splice(0, 3);
      }

      return res.status(200).json({message: "success!"});
    } else {
      return next({
        status: 401,
        message: boolean ? "Duplication Found" : "Follower not found"
      });
    }

  } catch (err) {
    return next(err);
  }
}
