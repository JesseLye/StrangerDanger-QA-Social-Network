import React, { Component } from "react";
import { connect } from "react-redux";
import { loadSearchAppend, newSearchFalseDispatch } from "../store/actions/searchResults";
import { followUser, unfollowUser } from "../store/actions/questions";
import SearchItem from "../components/SearchItem";
import NavBar from "./Navbar";

class SearchTemplate extends Component {
  constructor(){
    super();
    this.state = {
      initState: true,
      pagination: 12,
      searchResults: []
    };

    this.getResults = this.getResults.bind(this);
    this.handleState = this.handleItemState.bind(this);
  };

  getResults(){
    this.props.loadSearchAppend(this.props.results.locationPlus, this.state.pagination);
    this.setState((prevState, props) => {
      return {
        ...this.state,
        pagination: prevState.pagination + 12
      }
    });
  }

  handleItemState(id, index, boolean){
    this.setState((prevState, props) => {
      let newState = {...this.state};

      newState["searchResults"][index].isFollowing = boolean;

      let action = boolean ? "followUser" : "unfollowUser";
      this.props[action](id);

      return newState;
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    // initState is set to true everytime a new request is made.
    // Upon completion, subsequent requests (made via pagination)
    // are handled with the logic stored within shouldComponentUpdate.

    // initState is set to false upon displaying the first round
    // of data.

    if(nextProps.currentUser.isAuthenticated){

      if(this.state.initState && Object.keys(nextProps.results).length > 0){
        const newArr = nextProps.results["results"].map(function(r, i){
          return {
            answersGiven: r.answersGiven,
            username: r.username,
            _id: r._id,
            isFollowing: nextProps.currentUser.user.profileFollowing.filter(function(p){ return p === r._id }).length > 0
          }
        });
        this.props.newSearchFalseDispatch();
        this.setState({...this.state, searchResults: newArr, initState: false});
      }

      if(!this.state.initState && Object.keys(nextProps.results).length > 0){
        if(nextProps.results["results"].length > this.state.searchResults.length){

          let searchResults = this.state.searchResults.slice(0);

          const newArr = nextProps.results["results"].map(function(r, i){
            return {
              answersGiven: r.answersGiven,
              username: r.username,
              _id: r._id,
              isFollowing: nextProps.currentUser.user.profileFollowing.filter(function(p){ return p === r._id }).length > 0
            }
          });

          searchResults.push(newArr);
          this.setState({...this.state, searchResults: newArr});
        }
      }

      if(nextProps.results.newSearch){
        this.setState({
          initState: true,
          pagination: 12,
          searchResults: []
        });
      }

    }
    return true;
  }

  render() {
    const { currentUser } = this.props;

    let searchResults = [];

    if("results" in this.props.results){
      if(this.props.currentUser.isAuthenticated){
        searchResults = this.state.searchResults.map((r, i) =>
          <SearchItem
            key={r._id}
            id={`/user/${r._id}`}
            username={r.username}
            numAnswers={r.answersGiven.length}
            isApplicable={currentUser.user.id && currentUser.user.id !== r._id}
            isFollowing={r.isFollowing}
            isEligible={this.props.results.status && i === this.props.results["results"].length - 1}
            getResults={this.getResults.bind(this)}
            handleItemStateAdd={this.handleItemState.bind(this, r._id, i, true)}
            handleItemStateRemove={this.handleItemState.bind(this, r._id, i, false)}
          />
        );
      } else {
        searchResults = this.props.results["results"].map((r, i) =>
          <SearchItem
            key={r._id}
            id={`/user/${r._id}`}
            username={r.username}
            numAnswers={r.answersGiven.length}
            isEligible={this.props.results.status && i === this.props.results["results"].length - 1}
            getResults={this.getResults.bind(this)}
          />
        );
      }
    };

    if(searchResults.length === 0){
      searchResults = "Nuffin' yet";
    }

    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="u-margin-top-beefy">
          {searchResults}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    results: state.searchResults,
    error: state.errors
  };
}

export default connect(mapStateToProps, { loadSearchAppend, followUser, unfollowUser, newSearchFalseDispatch })(SearchTemplate);
