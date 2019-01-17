const express = require("express");
const router = express.Router({ mergeParams: true });
const { onGetAnswers } = require("../handlers/answer");

router.get("/:num", onGetAnswers);

module.exports = router;
