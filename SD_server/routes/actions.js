const express = require("express");
const router = express.Router();
const { onFollowUser, onUnfollowUser, onRandomProfile, onLike } = require("../handlers/actions");

router.get("/randomProfile", onRandomProfile)
router.post("/followUser", onFollowUser);
router.post("/unfollowUser", onUnfollowUser);
router.post("/likePost", onLike);

module.exports = router;
