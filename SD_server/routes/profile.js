const express = require("express");
const router = express.Router({ mergeParams: true });
const { onGetProfile,
        onSubmitQuestion,
        onSubmitAnswer,
        onDeleteQuestion,
        onDeleteAnswer } = require("../handlers/question");
const { ensureCorrectUser } = require("../middleware/auth");

router.get("/:num", onGetProfile);
router.post("/submitQuestion", onSubmitQuestion);

router.delete("/deleteQuestion/:question_id", ensureCorrectUser, onDeleteQuestion);
router.post("/submitAnswer/:question_id", ensureCorrectUser, onSubmitAnswer);
router.delete("/deleteAnswer/:answer_id", ensureCorrectUser, onDeleteAnswer);

module.exports = router;
