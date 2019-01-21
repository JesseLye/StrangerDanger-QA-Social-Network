import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ProfileTemplate from "../containers/ProfileTemplate";
import SearchTemplate from "../containers/SearchTemplate";
import FeedItems from "../containers/FeedItems";
import AnswerItems from "../containers/AnswerItems";
import DashboardQuestions from "../containers/DashboardQuestions";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import RouteNotFound from "../components/RouteNotFound";
import { authUser } from "../store/actions/auth";
import { removeError } from "../store/actions/errors";
import WithAuth from "../hocs/withAuth";


const Main = props => {
  const { authUser, errors, removeError, currentUser } = props;
  return (
    <div>
      <Switch>
        <Route exact path="/" render={props => <WithAuth currentUser={currentUser} RenderComponent={DashboardQuestions} /> } />
        <Route exact path="/reset/forgotPassword" render={props => <ForgotPasswordForm {...props} /> } />
        <Route exact path="/reset/:token" render={props => <ResetPasswordForm {...props} /> } />
        <Route exact path="/feed" render={props => <WithAuth currentUser={currentUser} RenderComponent={FeedItems} /> } />
        <Route exact path="/answers" render={props => <WithAuth currentUser={currentUser} RenderComponent={AnswerItems} /> } />
        <Route exact path="/user/:id" render={props => <ProfileTemplate {...props} />} />
        <Route exact path="/search" render={props => <SearchTemplate {...props} />} />
        <Route render={() => <RouteNotFound />} />
      </Switch>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    errors: state.errors
  };
}

// withRouter passes down match, location and history as props to Main component
export default withRouter(connect(mapStateToProps, { authUser, removeError })(Main));
