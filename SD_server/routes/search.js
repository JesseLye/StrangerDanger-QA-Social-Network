const express = require("express");
const router = express.Router({ mergeParams: true });
const { onGetSearch } = require("../handlers/search");

router.get("/:search/:num", onGetSearch);

module.exports = router;
