const db = require("../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.onForgot = async function(req, res, next){
  try {
    let foundUser = await db.User.findOne({ email: req.body.email });

    const token = crypto.randomBytes(20).toString('hex');

    foundUser.resetPasswordToken = token;
    foundUser.resetPasswordExpires = Date.now() + 3600000; // Will expire in one hour

    foundUser.save();

    var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPW
      }
    });

    var mailOptions = {
      to: foundUser.email,
      from: process.env.GMAILUSER,
      subject: 'Node.js Password Reset',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + process.env.CLIENT + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    await smtpTransport.sendMail(mailOptions);

    return res.status(200).json("Mail Sent.");
  } catch (err) {
    return next(err);
  };
};

exports.onGetToken = async function(req, res, next){
  try {
    let foundUser = await db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
      if(foundUser === null){
        return next({
          status: 401,
          message: "Unauthorized"
        });
      };
    return res.status(200).json(foundUser);
  } catch (err) {
    return next(err);
  };
};

exports.onPostToken = async function(req, res, next){
  try {
    let foundUser = await db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });

    if(req.body.password === req.body.confirm){
      foundUser.password = req.body.password;
      foundUser.resetPasswordToken = undefined;
      foundUser.resetPasswordExpires = undefined;

      foundUser.save();

    } else {
      return next({
        status: 400,
        message: "Password Does Not Match."
      });
    };

    var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPW
      }
    });

    var mailOptions = {
      to: foundUser.email,
      from: process.env.GMAILUSER,
      subject: 'Your password has been reset',
      text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + foundUser.email + ' has just been changed.\n'
    };

    await smtpTransport.sendMail(mailOptions);

    return res.status(200).json("Password Reset!");
  } catch (err) {
    return next(err);
  };
};
