import React, { Component } from "react";
import { connect } from "react-redux";
import { loadFeed } from "../store/actions/feed";
import { loadProfiles } from "../store/actions/randomProfiles";
import { followUser, unfollowUser, handleLike } from "../store/actions/questions";
// import QuestionItem from "../components/QuestionItem";
// import SubmitForm from "../components/SubmitForm";
// import LoadingIcon from "../components/LoadingIcon";
import DisplayItem from "../components/DisplayItem";
import RandomProfileItem from "../components/RandomProfileItem";
import FollowModule from "../components/FollowModule";

class FeedItems extends Component {
  constructor(props){
    super(props);

    this.state = {
      pagination: 0,
      feed: [],
      likesModule: false,
      questionLikes: []
    };

    this.getQuestions = this.getQuestions.bind(this);
    this.handleItemState = this.handleItemState.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.buildQuestionLikes = this.buildQuestionLikes.bind(this);
    this.modalClick = this.modalClick.bind(this);
    this.handleItemState = this.handleItemState.bind(this);
  }

  componentDidMount() {
    this.props.loadFeed(this.state.pagination, true);
    this.props.loadProfiles();
    this.setState((prevState, props) => {
      return {
        pagination: prevState.pagination + 6
      }
    });
  };

  shouldComponentUpdate(nextProps, nextState){
    if(Object.keys(nextProps.feed).length !== 0){
      if(nextProps.feed.feedQuestions.length > this.state.feed.length) {
        let getQuestions = this.state.feed.slice(0);
        let newQuestions = nextProps.feed.feedQuestions.slice(0);

        newQuestions.splice(0, this.state.feed.length);

        const newArr = newQuestions.map(q => ({
          ...q,
          isLiked: q.answer.likesReceivedPost.filter(function(l){ return l.likedBy._id === nextProps.currentUser.user.id }).length > 0
        }));

        getQuestions.push(...newArr);

        getQuestions.forEach(d => {
          if(!d.isLiked || "likesReceived" in d === false) {
            d["likesReceived"] = d.answer.likesReceivedPost.length;
          }
        });

        this.setState({...this.state, feed: getQuestions});
      };
    };
    return true;
  };

  getQuestions() {
    this.props.loadFeed(this.state.pagination, false);
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

      newState.feed[index].isLiked = !newState.feed[index].isLiked;
      newState.feed[index].answer.likesReceivedPost.length;

      if(newState.feed[index].isLiked) {
        newState.feed[index].likesReceived++;
      } else {
        newState.feed[index].likesReceived--;
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

  handleItemState(id, primaryKey, index, boolean){
    let action = boolean ? "followUser" : "unfollowUser";
    this.props[action](id);
  };

  modalClick(e) {
    if(e.target.className === "modal") {
      this.updateState();
    };
  };

  render() {
    const { feed, randomProfiles, currentUser } = this.props;
    let feedList = "Huh?";
    let likesList = "Nuffin' yet";
    let randomProfilesList = "Either something went wrong or you're following everybody. You mad lad!";

    if(this.state.feed.length > 0){
      feedList = this.state.feed.map((f, i) => (
          <DisplayItem
            key={f._id}
            postedToID={f.postedTo ? f.postedTo._id : null}
            postedByID={f.postedBy ? f.postedBy._id : null}
            text={f.text}
            answer={f.answer.text}
            date={f.createdAt}
            postedTo={f.postedTo.username}
            postedBy={f.postedBy ? f.postedBy.username : "Anonymous"}
            isEligible={feed.status && i === feed["feedQuestions"].length - 1}
            getQuestions={this.getQuestions.bind(this)}
            likeAmount={f.likesReceived}
            handleLike={this.handleLike.bind(this, f.answer._id, i)}
            buildLikes={this.buildQuestionLikes.bind(this, f.answer.likesReceivedPost)}
            isLiked={f.isLiked}
          />
      ));
    };

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
                {feedList}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    feed: state.feed,
    error: state.errors,
    randomProfiles: state.randomProfiles
  };
}

export default connect(mapStateToProps, { loadFeed, loadProfiles, followUser, unfollowUser, handleLike })(FeedItems);
