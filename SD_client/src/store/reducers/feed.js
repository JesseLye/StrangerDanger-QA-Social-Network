import { LOAD_FEED, APPEND_FEED } from "../actionTypes";

const defaultState = [];

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_FEED:
    let initState = {
      feedQuestions: [...action.feed[0]],
      status: action.feed[1].status
    };
    return initState;
    case APPEND_FEED:
      let newState = {
        feedQuestions: [...state.feedQuestions],
        status: action.feed[1].status
      };
      if(action.feed[0].length > 0) newState.feedQuestions.push(...action.feed[0]);
      return newState;
    default:
      return defaultState;
  }
};
