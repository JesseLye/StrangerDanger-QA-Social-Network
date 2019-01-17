import React from "react";
import LandingPage from "../containers/LandingPage";
import Navbar from "../containers/Navbar";

const withAuth = ({ currentUser, RenderComponent }) => {
  if(!currentUser.isAuthenticated){
    return (
      <LandingPage />
    );
  }
  return (
    <div>
      <Navbar />
      <RenderComponent />
    </div>
  );
};

export default withAuth;
