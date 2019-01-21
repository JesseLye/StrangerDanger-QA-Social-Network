import React, { Component } from "react";
import { connect } from "react-redux";
import { loadProfiles } from "../store/actions/randomProfiles";
import { loadAnswers } from "../store/actions/answersReceived";
import { followUser, unfollowUser, handleLike } from "../store/actions/questions";
import QuestionItem from "../components/QuestionItem";
import SubmitForm from "../components/SubmitForm";
// import LoadingIcon from "../components/LoadingIcon";
import DisplayItem from "../components/DisplayItem";
import RandomProfileItem from "../components/RandomProfileItem";
import FollowModule from "../components/FollowModule";

class AnswerItems extends Component {
  constructor(props){
    super(props);

    this.state = {
      pagination: 0,
      notifications: [],
      likesModule: false,
      questionLikes: []
    };

    this.getQuestions = this.getQuestions.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.buildQuestionLikes = this.buildQuestionLikes.bind(this);
    this.modalClick = this.modalClick.bind(this);
    this.handleItemState = this.handleItemState.bind(this);
  };

  componentDidMount() {
    this.props.loadAnswers(this.state.pagination, true);
    this.props.loadProfiles();
    this.setState((prevState, props) => {
      return {
        pagination: prevState.pagination + 6
      }
    });
  };

  shouldComponentUpdate(nextProps, nextState){
    if(Object.keys(nextProps.answersReceived).length !== 0){
      if(nextProps.answersReceived.answers.length > this.state.notifications.length) {
        let getQuestions = this.state.notifications.slice(0);
        let newQuestions = nextProps.answersReceived.answers.slice(0);

        newQuestions.splice(0, this.state.notifications.length);

        const newArr = newQuestions.map(q => ({
          ...q,
          isLiked: q.question.answer.likesReceivedPost.filter(function(l){ return l.likedBy._id === nextProps.currentUser.user.id }).length > 0
        }));

        getQuestions.push(...newArr);

        getQuestions.forEach(d => {
          if(!d.isLiked || "likesReceived" in d === false) {
            d["likesReceived"] = d.likesReceivedPost.length;
          }
        });

        this.setState({...this.state, notifications: getQuestions});
      };
    };
    return true;
  };

  handleItemState(id, index, boolean){
    let action = boolean ? "followUser" : "unfollowUser";
    this.props[action](id);
  }

  handleLike(id, index) {
    this.props.handleLike(id);
    this.setState((prevState, props) => {
      let newState = {...this.state};
      newState.notifications[index].isLiked = !newState.notifications[index].isLiked;

      if(newState.notifications[index].isLiked) {
        newState.notifications[index].likesReceived++;
      } else {
        newState.notifications[index].likesReceived--;
      }

      return newState;
    });
  };

  buildQuestionLikes(arr){
    let newArr = arr.map(d => d.likedBy);
    this.updateState("LIKES_MODULE", newArr);
  };

  updateState(condition, newArr) {
    switch(condition) {
      case "LIKES_MODULE":
        return this.setState({...this.state, likesModule: true, questionLikes: newArr});
      default:
        return this.setState({...this.state, likesModule: false});
    };
  };

  modalClick(e) {
    if(e.target.className === "modal") {
      this.updateState();
    };
  };

  getQuestions() {
    this.props.loadAnswers(this.state.pagination, false);
    this.setState((prevState, props) => {
      return {
        ...this.state,
        pagination: prevState.pagination + 6
      }
    });
  }

  render() {
    const { currentUser, randomProfiles, answersReceived } = this.props;
    let answersList = "Nuffin' yet";
    let likesList = "Nothing here!";
    let randomProfilesList = "Either something went wrong or you're following everybody. You mad lad!";

    if(this.state.notifications.length > 0) {
      answersList = this.state.notifications.map((f, i) => (
          <DisplayItem
            key={f._id}
            postedToID={f.postedTo ? f.postedTo._id : null}
            postedByID={f.postedBy ? f.postedBy._id : null}
            text={f.question.text}
            answer={f.question.answer.text}
            date={f.createdAt}
            postedTo={f.postedTo.username}
            postedBy={f.postedBy ? f.postedBy.username : "Anonymous"}
            isEligible={answersReceived.status && i === answersReceived.answers.length - 1}
            getQuestions={this.getQuestions.bind(this)}
            likeAmount={f.likesReceived}
            handleLike={this.handleLike.bind(this, f.question.answer._id, i)}
            buildLikes={this.buildQuestionLikes.bind(this, f.question.answer.likesReceivedPost)}
            isLiked={f.isLiked}
          />
      ));
    }

    if(randomProfiles.length > 0 && randomProfiles[0] !== null){
      randomProfilesList = randomProfiles.map((r, i) => (
          <RandomProfileItem
            key={r._id}
            id={r._id}
            username={r.username}
            answersGiven={r.answersGiven.length}
            isFirstItem={i === 0}
            isApplicable={currentUser.user.id && currentUser.user.id !== r._id}
            isFollowing={currentUser.user.profileFollowing.filter(p => p === r._id).length > 0}
            handleItemStateAdd={this.props.followUser.bind(this, r._id)}
            handleItemStateRemove={this.props.unfollowUser.bind(this, r._id)}
          />
      ));
    };

    if(this.state.questionLikes.length > 0){
      likesList = this.state.questionLikes.map((q, index) => (
        <FollowModule
          key={q._id}
          id={q._id}
          isFollowing={this.props.currentUser.user.profileFollowing.filter(d => d === q._id).length > 0}
          isApplicable={currentUser.user.id !== q._id}
          addItemToStates={this.handleItemState.bind(this, q._id, "followersArray", index, true)}
          removeItemFromStates={this.handleItemState.bind(this, q._id, "followersArray", index, false)}
          username={q.username}
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

          {this.state.likesModule && (
            <div className="modal" onClick={this.modalClick}>
              <div className="follow-pannel">
                {likesList}
              </div>
            </div>
          )}
        <div className="container">
          <div className="u-margin-top-beefy">
            <div className="row row--gutters">
              <div className="row__medium-4" style={{marginBottom: "3.5rem"}}>
                {randomProfilesList}
              </div>
              <div className="row__medium-8">
                {answersList}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    answersReceived: state.answersReceived,
    error: state.errors,
    randomProfiles: state.randomProfiles
  };
}

export default connect(mapStateToProps, { loadAnswers, loadProfiles, followUser, unfollowUser, handleLike })(AnswerItems);
