const express = require("express");
const router = express.Router({ mergeParams: true });
const { onForgot, onGetToken, onPostToken } = require("../handlers/reset");

router.post("/forgotRequest", onForgot);
router.get("/:token", onGetToken);
router.post("/:token", onPostToken);

module.exports = router;
