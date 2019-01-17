const express = require("express");
const router = express.Router();
const { signup, signin, getFollow } = require("../handlers/auth");
const { loginRequired } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/followData", loginRequired, getFollow);

module.exports = router;
