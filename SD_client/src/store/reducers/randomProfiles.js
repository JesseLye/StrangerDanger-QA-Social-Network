import { LOAD_PROFILES } from "../actionTypes";

export default (state = [], action) => {
  switch (action.type) {
    case LOAD_PROFILES:
      return [...action.profiles];
    default:
      return state;
  }
};
