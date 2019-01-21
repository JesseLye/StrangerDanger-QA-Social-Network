import React, { Component } from "react";
import { connect } from "react-redux";
import { getDashboardQuestions, DashboardQuestionAction } from "../store/actions/dashboardQuestions";
import QuestionItem from "../components/QuestionItem";
import SubmitForm from "../components/SubmitForm";
// import LoadingIcon from "../components/LoadingIcon";


class DashboardQuestions extends Component {
  constructor(props){
    super(props);
    this.state = {dashID: null, pagination: 0};

    this.selectQuestion = this.selectQuestion.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
  }

  componentDidMount() {
    this.props.getDashboardQuestions(this.state.pagination, true);
    this.setState((prevState, props) => {
      return {
        ...this.state,
        pagination: prevState.pagination + 6
      }
    });
  }

  getQuestions() {
    this.props.getDashboardQuestions(this.state.pagination, false);
    this.setState((prevState, props) => {
      return {
        ...this.state,
        pagination: prevState.pagination + 6
      }
    });
  }

  selectQuestion(e) {
    if(e.target.id) {
      this.setState({"dashID": e.target.id})
    };
  };

  render() {
    const { dashboardQuestions, DashboardQuestionAction, currentUser } = this.props;
    let questionList = "Nuffin' here!";

    if('dashboardQuestions' in dashboardQuestions && dashboardQuestions["dashboardQuestions"].length > 0){
      questionList = dashboardQuestions["dashboardQuestions"].map((q, i) => (
          <QuestionItem
            key={q._id}
            dashID={q._id}
            id={q.postedBy ? q.postedBy._id : null}
            headerClass={this.state.dashID === q._id && "question-item question-item--selected"}
            date={q.createdAt}
            postedBy={q.postedBy ? q.postedBy.username : "Anonymous"}
            text={q.text}
            removeQuestion={DashboardQuestionAction.bind(this, q._id)}
            isCorrectUser={currentUser === q.postedTo._id}
            submitForm={<SubmitForm key={q._id + ":" + i} handleSubmit={DashboardQuestionAction.bind(this, q._id)} style="PROFILE_SUBMIT"/>}
            isEligible={dashboardQuestions.status && i === dashboardQuestions["dashboardQuestions"].length - 1}
            getQuestions={this.getQuestions.bind(this)}
            boxClass={"question-item question-item__pointer"}
          />
      ));
    };

    return (
      <div>
        {this.props.error.message &&
          <div className="error-container">
            <p className="error">{this.props.error.message}</p>
          </div>
        }

        <div className="container">
          <div className="u-margin-top-beefy">
            <div onClick={this.selectQuestion}>
              {questionList}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    dashboardQuestions: state.dashboard,
    currentUser: state.currentUser.user.id,
    error: state.errors
  };
}

export default connect(mapStateToProps, { getDashboardQuestions, DashboardQuestionAction })(DashboardQuestions);
