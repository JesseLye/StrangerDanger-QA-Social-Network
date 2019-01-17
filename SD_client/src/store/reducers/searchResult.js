import { LOAD_SEARCH, APPEND_SEARCH, NEW_SEARCH_FALSE } from "../actionTypes";

export default(state = [], action) => {
  switch (action.type) {
    case LOAD_SEARCH:
      let initState = {
        results: action.results[0],
        status: action.results[1].status,
        newSearch: action.newSearch,
        locationPlus: action.locationPlus
      };
      return initState;
    case APPEND_SEARCH:
      let newState = {...state, status: action.results[1].status};
      if(action.results.length > 0) newState["results"].push(...action.results[0]);
      return newState;
    case NEW_SEARCH_FALSE:
      let falseState = {...state, newSearch: false};
      return falseState;
    default:
      return state;
  }
};
