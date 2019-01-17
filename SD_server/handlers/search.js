const db = require("../models");
var jwt = require("jsonwebtoken");

exports.onGetSearch = async function(req, res, next){
  try {
    let foundUser = await db.User.find({"username": {$regex: req.params.search, $options: "gi"}}, "username id answersGiven", { limit: 12, skip: Number(req.params.num) });

    const appendResults = [[...foundUser], {status: foundUser.length === 12 ? true : false}];

    return res.status(200).json(appendResults);
  } catch (err) {
    return next(err);
  }
};
