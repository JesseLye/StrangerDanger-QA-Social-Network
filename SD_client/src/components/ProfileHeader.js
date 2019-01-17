import React from "react";

const ProfileHeader = props => {
  return (
    <div className="profile-header">
      <p className="profile-heading">{props.username}</p>
      {props.isApplicable ?
        props.isFollowing ? (<a className="btn btn--profile-follow" onClick={props.buttonAction}>Unfollow</a>) : (<a className="btn btn--profile-follow" onClick={props.buttonAction}>Follow</a>)
      : (<a>&nbsp;</a>)}
      <div className="u-margin-top-regular">
        <div className={props.LoggedIn ? "row__medium-4" : "row__medium-12"}>
          <p>Answers</p>
          <p>{props.questionsAnswered}</p>
        </div>
        {props.LoggedIn && (
          <div>
            <div className="row__medium-4" onClick={props.followersModule}>
              <p>Followers</p>
              <p className="u-cursor-pointer">{props.numFollowers}</p>
            </div>
            <div className="row__medium-4" onClick={props.followingModule}>
              <p>Following</p>
              <p className="u-cursor-pointer">{props.numFollowing}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
