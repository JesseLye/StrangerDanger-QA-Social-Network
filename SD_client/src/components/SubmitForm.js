import React, { Component } from "react";

class SubmitForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      input: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClassName = this.handleClassName.bind(this);
  }

  handleChange(e) {
    this.setState({input: e.target.value});
  }

  handleSubmit(e)  {
    e.preventDefault();
    this.props.handleSubmit(this.state.input);
    this.setState({input: ""});
  }

  handleClassName() {
    switch(this.props.style) {
      case "SEARCH":
        return {form: "form form__search", button: "btn btn--search-form", icon: "icon-basic-magnifier", type: true}
      case "PROFILE_SUBMIT":
        return {form: "form form__profile-submit", button: "btn btn--profile-submit", icon: "icon-basic-paperplane", type: false}
      default:
        return {form: "form", button: "btn", icon: "icon-basic-paperplane"}
    }
  }

  render() {
    let classNames = this.handleClassName();
    return (
      <form onSubmit={this.handleSubmit} className={classNames.form} >
        {classNames.type ?
          <input
            name="submitQA"
            type="text"
            onChange={this.handleChange}
            autoComplete="off"
            placeholder="Username"
            value={this.state.input}
          />
          :
          <textarea
            name="submitQA"
            type="text"
            onChange={this.handleChange}
            autoComplete="off"
            placeholder="Ask something!"
            value={this.state.input}
            rows="4"
          /> }

        <button className={classNames.button}><i className={classNames.icon}>&nbsp;</i></button>
      </form>
    );
  }
}

export default SubmitForm;
