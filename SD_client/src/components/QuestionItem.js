import React from "react";
import Moment from "react-moment";
import Waypoint from "react-waypoint";
import { Link } from "react-router-dom";

const QuestionItem = ({ date,
                        dashID,
                        text,
                        postedBy,
                        answer,
                        removeQuestion,
                        removeAnswer,
                        isCorrectUser,
                        id,
                        state,
                        headerClass,
                        submitForm,
                        isEligible,
                        getQuestions,
                        isLiked,
                        handleLike,
                        LoggedIn,
                        likeAmount,
                        buildLikes,
                        boxClass }) => (
  <div className={headerClass ? headerClass : boxClass} id={dashID}>
    {/* <p className="question-item__postedBy" id={id}>{postedBy}</p> */}
    {id ? (
      <Link to={`/user/${id}`} className="question-item__postedBy" style={{display: "inline-block"}}>
        {postedBy}
      </Link>
    ) : (
      <p className="question-item__postedBy" style={{display: "block"}}>{postedBy}</p>
    )}
    <Moment format="Do MMM YYYY" style={{display: "block"}} id={dashID}>
      {date}
    </Moment>
    <p className="question-item__question" id={dashID}>{text}</p>
    {answer && (
      <p className="question-item__answer" id={id}>{answer}</p>
    )}
    {isCorrectUser && (
      <a className="btn btn--delete" onClick={removeQuestion}>
        Delete question
      </a>
    )}
    {isCorrectUser && answer && (
      <a className="btn btn--delete" onClick={removeAnswer}>
        Delete answer
      </a>
    )}
    <div className="u-margin-top-small">
      {headerClass && (
        submitForm
      )}
    </div>
    {isEligible && (
      <Waypoint
        onEnter={() => getQuestions()}
      />
    )}
    {LoggedIn ?
        isLiked ? (
            <p className="icon-basic-heart isLiked isLiked--true u-display-inline-block u-cursor-pointer" onClick={handleLike}>&nbsp;</p>
        ) : (
            <p className="icon-basic-heart isLiked isLiked--false u-display-inline-block u-cursor-pointer" onClick={handleLike}>&nbsp;</p>
        )
    : null}
      <p className="like-amount u-display-inline-block u-cursor-pointer" onClick={buildLikes}>{likeAmount}</p>
  </div>
);

export default QuestionItem;
