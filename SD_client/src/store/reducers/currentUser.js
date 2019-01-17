import { SET_CURRENT_USER, ADD_PROFILE_FOLLOWING, REMOVE_PROFILE_FOLLOWING } from "../actionTypes";

const defaultState = {
  isAuthenticated: false,
  user: {}
};

export default (state = defaultState, action) => {
  switch(action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: Object.keys(action.user).length > 0,
        user: action.user
      };
    case ADD_PROFILE_FOLLOWING:
      let newState = Object.assign({}, state);
      newState.user.profileFollowing.push(action.id);
      return newState;
    case REMOVE_PROFILE_FOLLOWING:
      let duplicateState = Object.assign({}, state);
      duplicateState.user.profileFollowing = duplicateState.user.profileFollowing.filter(p => p !== action.id);
      return duplicateState;
    default:
      return state;
  }
};
