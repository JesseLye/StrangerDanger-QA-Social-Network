import React from "react";
import {Link} from "react-router-dom";

const routeNotFound = () => {
  return (
    <div>
      <p>You've picked the wrong route, fool!</p>
      <Link to="/">Hey hey hey hey! It's me, Carl! Chill! Chill!</Link>
    </div>
  );
};

export default routeNotFound;
