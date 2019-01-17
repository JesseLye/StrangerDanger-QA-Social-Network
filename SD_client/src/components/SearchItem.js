import React from "react";
import { Link } from "react-router-dom";
import Waypoint from "react-waypoint";

const SearchItem = ({id,
                    username,
                    numAnswers,
                    isApplicable,
                    isFollowing,
                    isEligible,
                    getResults,
                    handleItemStateAdd,
                    handleItemStateRemove }) => (
  <div className="search-items">
    <div className="search-items__top-row">
      {isApplicable ?
        isFollowing ? (<a className="btn btn--search-items" onClick={handleItemStateRemove}>Unfollow</a>) : (<a className="btn btn--search-items" onClick={handleItemStateAdd}>Follow</a>)
      : (<a>&nbsp;</a>)}
      <Link to={id}>
        <p className="search-items__username">{username}</p>
      </Link>
    </div>
    <p className="search-items__answers">Answers: {numAnswers}</p>
    {isEligible && (
      <Waypoint
        onEnter={() => getResults()}
      />
    )}
  </div>
);

export default SearchItem;
