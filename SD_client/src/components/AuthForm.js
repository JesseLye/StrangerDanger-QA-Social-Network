import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const authType = this.props.signUp ? "signup" : "signin";
    this.props
    .onAuth(authType, this.state)
    .then(() => {
        this.props.history.push("/");
    })
    .catch(() => {
      return;
    });
  };

  modalClick = e => {
    if(e.target.className === "modal" || e.target.className === "form__close") {
      this.props.resetFunc();
    }
  }

  render() {
    const { email, username, password } = this.state;
    const { heading, buttonText, signUp, errors, history, removeError } = this.props;

    history.listen(() => {
      removeError();
    });

    return (
      <div className="modal" onClick={this.modalClick}>
        <form className="form form__opacity" onSubmit={this.handleSubmit}>
          <div className="form__content">
            <div className="form-header u-center-text">
              <h4>{heading}</h4>
            </div>
            <div className="form__close">X</div>
            {errors.message && ( <div>{errors.message}</div> )}
            <input
              id="email"
              name="email"
              onChange={this.handleChange}
              value={email}
              type="email"
              placeholder="Email"
            />
            {signUp && (
              <div>
                <input
                  id="username"
                  name="username"
                  onChange={this.handleChange}
                  value={username}
                  type="text"
                  placeholder="Username"
                />
              </div>
            )
          }
            <input
              id="password"
              name="password"
              onChange={this.handleChange}
              value={password}
              type="password"
              placeholder="Password"
            />
        </div>
        <div className="form-header u-center-text">
          <button type="submit" className="btn btn--authForm">
            {buttonText}
          </button>
          <Link to={`/reset/forgotPassword`} className="btn btn__forgot-password" style={{display: "block", marginTop: "1rem"}} onClick={() => this.props.onClose()}>
            Forgot Password?
          </Link>
        </div>
        </form>
      </div>
    );
  }
}
