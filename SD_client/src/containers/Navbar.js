import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout, authUser } from "../store/actions/auth";
import { loadAnswers } from "../store/actions/answersReceived";
import { loadSearch } from "../store/actions/searchResults";
import { removeErrorAuth } from "../store/actions/authErrors";
import AuthForm from "../components/AuthForm";
import SubmitForm from "../components/SubmitForm";

class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      signInForm: false,
      signUpForm: false,
      newValue: false
    };

    this.logout = this.logout.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetState = this.resetState.bind(this);
    this.iconClick = this.iconClick.bind(this);
  };

  resetState() {
    this.setState({...this.state, signInForm: false, signUpForm: false});
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
  };

  iconClick() {
    this.setState((prevState, props) => {
      return {...this.state, displayValue: !prevState.displayValue}
    });
  };

  onSubmit(val) {
    this.props.loadSearch(val, 0);
    this.props.history.push("/search");
  };

  render() {
    const { authUser, authErrors, removeErrorAuth } = this.props;

    return (
      <div>
        {this.state.signInForm && (
          <AuthForm removeError={removeErrorAuth}
                    errors={authErrors}
                    onAuth={authUser}
                    buttonText="Log In"
                    heading="Welcome Back"
                    resetFunc={this.resetState}
                    {...this.props}
          />
        )}

        {this.state.signUpForm && (
          <AuthForm removeError={removeErrorAuth}
                    errors={authErrors} onAuth={authUser}
                    signUp
                    buttonText="Sign me up!"
                    heading="Join StrangerDanger"
                    resetFunc={this.resetState}
                    {...this.props}
          />
        )}
        <nav className="navbar">
          <div className={this.state.displayValue ? "navbar__menu-icon navbar__menu-icon--close-x" : "navbar__menu-icon"} onClick={this.iconClick}>
            <div className={this.state.displayValue ? "navbar__menu-icon--middle-hide" : "navbar__menu-icon--middle"}></div>
          </div>
          <div className="container">
            <Link to="/">
              <p className="navbar--float-left navbar-header">StrangerDanger</p>
            </Link>
            <div className="form__container">
              <SubmitForm handleSubmit={this.onSubmit} style="SEARCH" />
              {this.props.currentUser.isAuthenticated ? (
                <div className={this.state.displayValue ? "navbar__display--visible"
                                : "navbar__display"}>
                  <Link to="/" className={this.props.location.pathname === "/" ? "navbar__link navbar__link--margin-left navbar__link--is-selected" : "navbar__link navbar__link--margin-left navbar__link"}>
                    Home
                  </Link>
                  <Link to={`/user/${this.props.currentUser.user.id}`} className={`/user/${this.props.currentUser.user.id}` === this.props.location.pathname ? "navbar__link navbar__link--margin-left navbar__link--is-selected" : "navbar__link navbar__link--margin-left navbar__link"}>
                    Profile
                  </Link>
                  <Link to={"/answers"} className={this.props.location.pathname === "/answers" ? "navbar__link navbar__link--margin-left navbar__link--is-selected" : "navbar__link navbar__link--margin-left navbar__link"}>
                    Answers
                  </Link>
                  <Link to={"/feed"} className={this.props.location.pathname === "/feed" ? "navbar__link navbar__link--margin-left navbar__link--is-selected" : "navbar__link navbar__link--margin-left navbar__link"}>
                    Social
                  </Link>
                  <a className="navbar__link navbar__link--margin-left" onClick={this.logout}>Logout</a>
                </div>
              ) : (
                <div className={this.state.displayValue ? "navbar__display--visible"
                                : "navbar__display"}>
                  <a className="navbar__link navbar__link--margin-left" onClick={() => this.setState({signInForm: true, signUpForm: false})}>Log in</a>
                  <a className="navbar__link navbar__link--margin-left" onClick={() => this.setState({signInForm: false, signUpForm: true})}>Sign up</a>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    searchResults: state.searchResults,
    question: state.question,
    answersReceived: state.answersReceived,
    authErrors: state.authErrors
  };
}

export default withRouter(connect(mapStateToProps, { logout, loadSearch, authUser, loadAnswers, removeErrorAuth })(Navbar));
