import React, { Component } from "react";
import { getQuestions, postNewQuestion, removeQuestion, removeAnswer, followUser, unfollowUser, emptyQuestionsFunc, handleLike } from "../store/actions/questions";
import { connect } from "react-redux";
import ProfileHeader from "../components/ProfileHeader";
import QuestionItem from "../components/QuestionItem";
import SubmitForm from "../components/SubmitForm";
// import LoadingIcon from "../components/LoadingIcon";
import FollowModule from "../components/FollowModule";
import Navbar from "./Navbar";

class ProfileTemplate extends Component {
  constructor(){
    super();
    this.state = {
                  followersModule: false,
                  followingModule: false,
                  likesModule: false,
                  initialComparison: false,
                  canSubmit: true,
                  pagination: 0,
                  followersArray: [],
                  followingArray: [],
                  profileQuestions: [],
                  questionLikes: [],
                  currentProfileButton: {}
                };

    this.updateState = this.updateState.bind(this);
    this.modalClick = this.modalClick.bind(this);
    this.currentProfileButtonAction = this.currentProfileButtonAction.bind(this);
    this.handleItemState = this.handleItemState.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.postNewQuestion = this.postNewQuestion.bind(this);
    this.removeQuestionState = this.removeQuestionState.bind(this);
  }

  updateState(condition, newArr) {
    switch(condition) {
      case "FOLLOWERS_MODULE":
        return this.setState({...this.state, followersModule: true, followingModule: false, likesModule: false});
      case "FOLLOWING_MODULE":
        return this.setState({...this.state, followersModule: false, followingModule: true, likesModule: false});
      case "LIKES_MODULE":
        return this.setState({...this.state, followersModule: false, followingModule: false, likesModule: true, questionLikes: newArr});
      default:
        return this.setState({...this.state, followersModule: false, followingModule: false, likesModule: false});
    }
  }

  postNewQuestion(input){
    this.props.postNewQuestion(input);
    this.setState({...this.state, canSubmit: false});
  }

  modalClick(e) {
    if(e.target.className === "modal") {
      this.updateState();
    };
  };

  getQuestions() {
    let profileID = this.props.location.pathname.replace("/user/", "");
    this.props.getQuestions(profileID, this.state.pagination, false);
    this.setState((prevState, props) => {
      return {
        ...this.state,
        pagination: prevState.pagination + 6
      }
    });
  };

  handleLike(id, index) {
    this.props.handleLike(id);
    this.setState((prevState, props) => {
      let newState = {...this.state};
      newState.profileQuestions[index].isLiked = !newState.profileQuestions[index].isLiked;

      if(newState.profileQuestions[index].isLiked) {
        newState.profileQuestions[index].likesReceived++;
      } else {
        newState.profileQuestions[index].likesReceived--;
      }

      return newState;
    });
  };

  buildQuestionLikes(arr){
    let newArr = arr.map(d => d.likedBy);
    this.updateState("LIKES_MODULE", newArr);
  };

  removeQuestionState(type, question_id, answer_id){
    let newState = {...this.state};
    newState.profileQuestions = newState.profileQuestions.filter(d => d._id !== question_id);

    if(type){
      this.props.removeAnswer(answer_id, question_id);
    } else {
      this.props.removeQuestion(question_id);
    };

    this.setState(newState);
  };

  componentDidMount() {
    let profileID = this.props.location.pathname.replace("/user/", "");
    if(Object.keys(this.props.questions).length > 0){
      this.props.emptyQuestionsFunc();
    }
    this.props.getQuestions(profileID, this.state.pagination, true);
    this.setState((prevState, props) => {
      return {
        ...this.state,
        pagination: prevState.pagination + 6
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    if(Object.keys(nextProps.questions).length !== 0 && Object.keys(nextProps.currentUser).length !== 0){
      if(!nextState.initialComparison && nextProps.questions.username !== this.props.questions.username) {

        const followersArray = nextProps.questions.profileFollowers.map(function(d, i){
          return {
            _id: d._id,
            username: d.username
          };
        });

        const followingArray = nextProps.questions.profileFollowing.map(function(d, i){
          return {
            _id: d._id,
            username: d.username
          };
        });

        const currentProfileButton = nextProps.currentUser.profileFollowing.filter(pf => pf === nextProps.questions._id).length > 0;

        const profileQuestions = nextProps.questions.questionsReceived.map(q => ({
          ...q,
          isLiked: q.answer.likesReceivedPost.filter(function(l){ return l.likedBy._id === nextProps.currentUser.id }).length > 0
        }));

        profileQuestions.forEach(d => d["likesReceived"] = d.answer.likesReceivedPost.length);

        this.setState({
                      ...this.state,
                      initialComparison: true,
                      followersArray: followersArray,
                      followingArray: followingArray,
                      profileQuestions: profileQuestions,
                      currentProfileButton: {id: nextProps.questions._id, isFollowing: currentProfileButton}
                    });

      }

      if(this.state.initialComparison && nextProps.questions.questionsReceived.length > this.state.profileQuestions.length) {
        let getQuestions = this.state.profileQuestions.slice(0);
        let newQuestions = nextProps.questions.questionsReceived.slice(0);

        newQuestions.splice(0, this.state.profileQuestions.length);

        const newArr = newQuestions.map(q => ({
          ...q,
          isLiked: q.answer.likesReceivedPost.filter(function(l){ return l.likedBy._id === nextProps.currentUser.id }).length > 0
        }));

        getQuestions.push(...newArr);
        getQuestions.forEach(d => {
          if(!d.isLiked || "likesReceived" in d === false) {
            d["likesReceived"] = d.answer.likesReceivedPost.length;
          }
        });

        this.setState({...this.state, profileQuestions: getQuestions});
      };
    };
    return true;
  };

  componentDidUpdate(prevProps, prevState){
    if(prevProps.location.pathname !== this.props.location.pathname){
      this.props.emptyQuestionsFunc();
      let profileID = this.props.location.pathname.replace("/user/", "");
      this.props.getQuestions(profileID, 0, true);
      return this.setState({
                    followersModule: false,
                    followingModule: false,
                    likesModule: false,
                    initialComparison: false,
                    canSubmit: true,
                    pagination: 6,
                    followersArray: [],
                    followingArray: [],
                    profileQuestions: [],
                    questionLikes: [],
                    currentProfileButton: {}
                  });
    }
  }

  currentProfileButtonAction(){
    this.setState((prevState, props) => {
      let newState = {...this.state};
      if(newState.currentProfileButton.isFollowing){
        newState.currentProfileButton.isFollowing = false;
        this.props.unfollowUser(newState.currentProfileButton.id);
      } else {
        newState.currentProfileButton.isFollowing = true;
        this.props.followUser(newState.currentProfileButton.id);
      };
      return newState;
    });
  };

  handleItemState(id, boolean){
    if(this.state.currentProfileButton.id === id){
      let newState = {...this.state};
      newState.currentProfileButton.isFollowing = boolean;
      this.setState(newState);
    };

    let action = boolean ? "followUser" : "unfollowUser";
    this.props[action](id);
  };

  render() {
    const { questions,
            postNewQuestion,
            currentUser,
            followUser,
            unfollowUser } = this.props;

    let questionList = "Nothing here!";
    let followerList = "Nothing here!";
    let followingList = "Nothing here!";
    let likesList = "Nothing here!";
    let questionCondition = Object.keys(questions).length !== 0;
    let currentUserCondition = Object.keys(currentUser).length !== 0;

    if(questionCondition) {
      if(currentUserCondition){
        if(this.state.profileQuestions.length > 0){
          questionList = this.state.profileQuestions.map((q, i) => (
            <QuestionItem
              key={q._id}
              dashID={q._id}
              id={q.postedBy ? q.postedBy._id : null}
              date={q.answer.createdAt}
              text={q.text}
              postedBy={q.postedBy ? q.postedBy.username : "Anonymous"}
              answer={q.answer.text}
              isCorrectUser={currentUser.id === q.postedTo._id}
              removeQuestion={this.removeQuestionState.bind(this, false, q._id)}
              removeAnswer={this.removeQuestionState.bind(this, true, q._id, q.answer._id)}
              isEligible={questions.status && i === questions["questionsReceived"].length - 1}
              getQuestions={this.getQuestions.bind(this)}
              isLiked={q.isLiked}
              handleLike={this.handleLike.bind(this, q.answer._id, i)}
              LoggedIn={currentUserCondition}
              likeAmount={q.likesReceived}
              buildLikes={this.buildQuestionLikes.bind(this, q.answer.likesReceivedPost)}
              boxClass={"question-item"}
            />
          ));
        }

        if(this.state.followersArray.length > 0){
            followerList = this.state.followersArray.map((q, index) => (
            <FollowModule
              key={q._id}
              id={q._id}
              index={index}
              isApplicable={currentUser.id !== q._id}
              isFollowing={this.props.currentUser.profileFollowing.filter(d => d === q._id).length > 0}
              addItemToStates={this.props.followUser.bind(this, q._id)}
              removeItemFromStates={this.props.unfollowUser.bind(this, q._id)}
              username={q.username}
            />
          ));
        }

        if(this.state.followingArray.length > 0){
            followingList = this.state.followingArray.map((q, index) => (
            <FollowModule
              key={q._id}
              id={q._id}
              index={index}
              isApplicable={currentUser.id !== q._id}
              isFollowing={this.props.currentUser.profileFollowing.filter(d => d === q._id).length > 0}
              addItemToStates={this.props.followUser.bind(this, q._id)}
              removeItemFromStates={this.props.unfollowUser.bind(this, q._id)}
              username={q.username}
            />
          ));
        }

        if(this.state.questionLikes.length > 0){
          likesList = this.state.questionLikes.map((q, index) => (
            <FollowModule
              key={q._id}
              id={q._id}
              isFollowing={this.props.currentUser.profileFollowing.filter(d => d === q._id).length > 0}
              isApplicable={currentUser.id !== q._id}
              addItemToStates={this.handleItemState.bind(this, q._id, true)}
              removeItemFromStates={this.handleItemState.bind(this, q._id, false)}
              username={q.username}
            />
          ));
        }

      } else {
        questionList = questions.questionsReceived.map((q, i) => (
          <QuestionItem
            key={q._id}
            id={q.postedBy ? q.postedBy._id : null}
            date={q.answer.createdAt}
            text={q.text}
            postedBy={q.postedBy ? q.postedBy.username : "Anonymous"}
            answer={q.answer.text}
            isApplicable={currentUserCondition}
            isEligible={questions.status && i === questions["questionsReceived"].length - 1}
            getQuestions={this.getQuestions.bind(this)}
            LoggedIn={currentUserCondition}
            boxClass={"question-item"}
          />
        ));
      };
    };

    return (
      <div>
        <Navbar />
        {this.props.error.message && (
          <div className="error-container">
            <p className="error">{this.props.error.message}</p>
          </div>
        )}

        {this.state.followersModule && (
          <div className="modal" onClick={this.modalClick}>
            <div className="follow-pannel">
              {followerList}
            </div>
          </div>
        )}

        {this.state.followingModule && (
          <div className="modal" onClick={this.modalClick}>
            <div className="follow-pannel">
              {followingList}
            </div>
          </div>
        )}

        {this.state.likesModule && (
          <div className="modal" onClick={this.modalClick}>
            <div className="follow-pannel">
              {likesList}
            </div>
          </div>
        )}

        {questionCondition && (
          <div className="container">
            <ProfileHeader
              username={questions.username}
              questionsAnswered={questions.questionsReceived.length}
              numFollowers={questions.profileFollowers.length}
              numFollowing={questions.profileFollowing.length}
              followersModule={this.updateState.bind(this, "FOLLOWERS_MODULE")}
              followingModule={this.updateState.bind(this, "FOLLOWING_MODULE")}
              isFollowing={this.state.currentProfileButton.isFollowing}
              isApplicable={currentUser.id && currentUser.id !== questions._id}
              buttonAction={this.currentProfileButtonAction.bind(this)}
              LoggedIn={currentUserCondition}
            />
            <div className="u-margin-top-regular row row--gutters">
              <div className="row__medium-4">
                <div className="profile-form">
                  {this.state.canSubmit ? (
                    <SubmitForm handleSubmit={this.postNewQuestion.bind(this)} style="PROFILE_SUBMIT" />
                  ) : (
                    <p>Question Submitted!</p>
                  )}
                </div>
              </div>
              <div className="row__medium-8">
                {questionList}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
};

function mapStateToProps(state) {
  return {
    questions: state.question,
    error: state.errors,
    currentUser: state.currentUser.user
  };
};

export default connect(mapStateToProps, { getQuestions, postNewQuestion, removeQuestion, removeAnswer, followUser, unfollowUser, emptyQuestionsFunc, handleLike })(ProfileTemplate);
