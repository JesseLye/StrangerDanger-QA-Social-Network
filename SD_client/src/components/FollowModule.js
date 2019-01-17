import React from "react";
import { Link } from "react-router-dom";

const FollowModule = (props) => {
  return (
    <div className="follow-pannel__item">
      <Link to={`/user/${props.id}`} className="follow-pannel__username">
        {props.username}
      </Link>
      {props.isApplicable ?
        props.isFollowing ? (<a className="btn btn--follow-pannel" onClick={props.removeItemFromStates}>Unfollow</a>) : (<a className="btn btn--follow-pannel" onClick={props.addItemToStates}>Follow</a>)
      : (<a>&nbsp;</a>)}
    </div>
  );
};

export default FollowModule;
