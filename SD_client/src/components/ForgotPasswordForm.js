import React, { Component } from "react";
import Navbar from "../containers/Navbar";
import { apiCall } from "../services/api";

export default class ForgotPasswordForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      errors: "",
      showForm: true,
      buttonDisabled: false
    };
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({...this.state, buttonDisabled: true});
    const email = this.state.email;
    apiCall("POST", "/api/reset/forgotRequest", { email })
      .then(res => this.setState({...this.state, showForm: false, errors: ""}))
      .catch(err => {
        this.setState({...this.state, showForm: true, errors: err.message, buttonDisabled: false})
      });
  };

  render() {
    return (
      <div>
      <Navbar />
        <div className="container">
          <div className="u-margin-top-beefy">
            {this.state.errors && <h1>{this.state.errors}</h1>}
            {this.state.showForm ? (
              <form className="form question-item" onSubmit={this.handleSubmit}>
                <h1 className="form__header">Forgot Passsword</h1>
                <input
                  className="form__forgot-password-input"
                  id="create-poll-form-title-input"
                  key="email"
                  name="email"
                  type="text"
                  size={45}
                  autoComplete="off"
                  placeholder="example@email.com"
                  onChange={this.handleChange} />
                <button className="btn btn__forgot-password-submit" disabled={this.state.buttonDisabled} type="submit">Submit</button>
              </form>
            ) : (
              <p>Request Sent!</p>
            )}
          </div>
        </div>
      </div>
    );
  };
};
