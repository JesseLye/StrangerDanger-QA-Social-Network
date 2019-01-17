const express = require("express");
const router = express.Router({ mergeParams: true });
const { onGetDashboard } = require("../handlers/dashboard");

router.get("/:num", onGetDashboard);

module.exports = router;
