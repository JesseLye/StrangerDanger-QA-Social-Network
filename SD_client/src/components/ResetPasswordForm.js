import React, { Component } from "react";
import Navbar from "../containers/Navbar";
import { apiCall } from "../services/api";

class ResetPasswordForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: "",
      error: "",
      password: "",
      confirm: "",
      message: "",
      showForm: true,
      buttonDisabled: false
    };
  };

  componentDidMount(){
    let profileID = this.props.location.pathname.replace("/reset/", "");
    apiCall("GET", `/api/reset/${profileID}`)
      .then(res => this.setState({data: res}))
      .catch(err => {
        this.setState({...this.state, error: err.message})
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { password, confirm } = this.state;
    this.setState({...this.state, buttonDisabled: true});
    let profileID = this.props.location.pathname.replace("/reset/", "");
    apiCall("POST", `/api/reset/${profileID}`, { password, confirm })
      .then(res => this.setState({data: "",  errors: "", password: "",
                                  confirm: "", message: "Password Reset Successfully!",
                                  showForm: false}))
      .catch(err => {
        this.setState({...this.state, showForm: true, errors: err.message, buttonDisabled: false})
      });
  };

  render(){

    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="u-margin-top-beefy">
            {this.state.errors && <h1>{this.state.errors}</h1>}
            {this.state.data && this.state.showForm ? (
              <form className="form question-item" onSubmit={this.handleSubmit}>
                <h1 className="form__header">Reset Password</h1>
                <input
                  className="form__forgot-password-input"
                  id="password"
                  key="password"
                  name="password"
                  type="password"
                  size={45}
                  autoComplete="off"
                  placeholder="new password"
                  onChange={this.handleChange} />
                  <input
                    className="form__forgot-password-input"
                    id="confirm"
                    key="confirm"
                    name="confirm"
                    type="password"
                    size={45}
                    autoComplete="off"
                    placeholder="confirm password"
                    onChange={this.handleChange} />
                <button className="btn btn__forgot-password-submit" disabled={this.state.buttonDisabled} type="submit">Submit</button>
              </form>
            ) : (
              <div>
                {this.state.message ? (
                  <p>{this.state.message}</p>
                ) : (
                  <p>{this.state.errors}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
};

export default ResetPasswordForm;
