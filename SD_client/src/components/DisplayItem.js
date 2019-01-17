import React from "react";
import Moment from "react-moment";
import Waypoint from "react-waypoint";
import { Link } from "react-router-dom";

const DisplayItem = props => {
  return (
    <div className="question-item">
      {props.postedByID ? (
        <Link to={`/user/${props.postedByID}`} className="question-item__postedBy" style={{display: "block"}}>
          {props.postedBy}
        </Link>
      ) : (
        <p className="question-item__postedBy" style={{display: "block"}}>{props.postedBy}</p>
      )}
      <Moment format="Do MMM YYYY">
        {props.date}
      </Moment>
      <p className="question-item__question">{props.text}</p>

      <Link to={`/user/${props.postedToID}`} className="question-item__postedBy" style={{display: "block", marginTop: "0.8rem"}}>
        {props.postedTo}
      </Link>
      <p className="question-item__answer--not-profile">{props.answer}</p>
      {props.isEligible && (
        <Waypoint
          onEnter={() => props.getQuestions()}
        />
      )}
      {props.isLiked ? (
          <p className="icon-basic-heart isLiked isLiked--true u-display-inline-block u-cursor-pointer" onClick={props.handleLike} style={{marginTop: "0.6rem"}}>&nbsp;</p>
      ) : (
          <p className="icon-basic-heart isLiked isLiked--false u-display-inline-block u-cursor-pointer" onClick={props.handleLike} style={{marginTop: "0.6rem"}}>&nbsp;</p>
      )}
      <p className="like-amount u-display-inline-block u-cursor-pointer" onClick={props.buildLikes}>{props.likeAmount}</p>
    </div>
  );
};

export default DisplayItem;
