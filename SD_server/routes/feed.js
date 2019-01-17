const express = require("express");
const router = express.Router({ mergeParams: true });
const { onGetFeed } = require("../handlers/feed");

router.get("/:num", onGetFeed);

module.exports = router;
