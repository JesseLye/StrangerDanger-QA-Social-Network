const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signup = async function(req, res, next) {
  try {
    let user = await db.User.create(req.body);
    let { id, username, profileFollowing } = user;
    let token  = jwt.sign({
      id,
      username
    },
    process.env.SECRET_KEY
  );
    return res.status(200).json({
      id,
      username,
      profileFollowing,
      token
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry, that username and/or email is taken."
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.signin = async function(req, res, next) {
  try {
    let user = await db.User.findOne({
      email: req.body.email
    });
    let { id, username, profileFollowing } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if(isMatch) {
      let token = jwt.sign(
        {
          id,
          username
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        id,
        username,
        profileFollowing,
        token
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email/Password."
      });
    }
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry, that username and/or email is taken."
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.getFollow = async function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.SECRET_KEY);

    let foundUser = await db.User.find({"_id": decoded.id}, "profileFollowing");

    return res.status(200).json(foundUser);
  } catch (err) {
    return next(err);
  }
}
