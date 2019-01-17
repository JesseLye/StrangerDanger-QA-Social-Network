import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { authUser } from "../store/actions/auth";
import { removeError } from "../store/actions/errors";
import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

class LandingPage extends Component {
  constructor(props){
    super(props);
    this.state = {signInForm: false, signUpForm: false};

    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState({signInForm: false, signUpForm: false});
  }

  render() {
    const { authUser, errors, removeError } = this.props;

    return (
      <header className="header">
        {this.state.signInForm && (
          <AuthForm removeError={removeError} errors={errors} onAuth={authUser} buttonText="Log In" heading="Welcome Back" {...this.props} resetFunc={this.resetState} />
        )}
        {this.state.signUpForm && (
          <AuthForm removeError={removeError} errors={errors} onAuth={authUser} signUp buttonText="Sign up" heading="Join StrangerDanger" {...this.props} resetFunc={this.resetState} />
        )}
        <div className="header__text-box">
          <div className="u-center-text">
            <h1 className="heading-primary">
              <span className="heading-primary--main">Stranger Danger</span>
              <span className="heading-primary--sub">Why don't you have a seat right over there please?</span>
            </h1>
              <a className="btn btn--border btn--margin-right" onClick={() => this.setState({signInForm: true, signUpForm: false})}>Sign In</a>
              <a className="btn btn--border" onClick={() => this.setState({signInForm: false, signUpForm: true})}>Sign up!</a>
          </div>
        <Link to={"/search"} className="happy-little-link u-margin-top-small">
            I don't want to sign up for this junk! (Take a note LinkedIn)
        </Link>
        </div>
      </header>
    );
  };
};

function mapStateToProps(state) {
  return {
    errors: state.errors
  };
}

export default withRouter(connect(mapStateToProps, { authUser, removeError })(LandingPage));
