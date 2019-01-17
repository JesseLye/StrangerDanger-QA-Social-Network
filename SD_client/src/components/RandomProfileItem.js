import React from "react";
import { Link } from "react-router-dom";

const RandomProfileItem = props => {
  return (
    <div className="profile-item">
      {props.isFirstItem && (
        <div className="profile-item__title">
          <p>Who to follow</p>
        </div>
      )}
      <div className="profile-item__top-row">
        <Link to={`/user/${props.id}`} className="profile-item__username">
          {props.username}
        </Link>
        {props.isApplicable ?
          props.isFollowing ? (<a className="btn btn--search-items" onClick={props.handleItemStateRemove}>Unfollow</a>) : (<a className="btn btn--search-items" onClick={props.handleItemStateAdd}>Follow</a>)
        : (<a>&nbsp;</a>)}
      </div>
      <p className="profile-item__answers">answers: {props.answersGiven}</p>
    </div>
  );
};

export default RandomProfileItem;
