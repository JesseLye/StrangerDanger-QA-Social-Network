import { apiCall } from "../../services/api";
import { addError } from "./errors";
import { LOAD_SEARCH, APPEND_SEARCH, NEW_SEARCH_FALSE } from "../actionTypes";

export const loadSearchDispatch = (results, locationPlus) => ({
  type: LOAD_SEARCH,
  newSearch: true,
  results,
  locationPlus
});

export const loadSearchAppendDispatch = results => ({
  type: APPEND_SEARCH,
  results
});

export const newSearchFalseDispatch = () => ({
  type: NEW_SEARCH_FALSE
});

// export const removeS = () => ({
//   type: REMOVE_SEARCH
// });
//
// export function removeSearch(){
//   return dispatch => {
//     dispatch(removeS);
//   };
// };

export const loadSearch = (text, pagination) => (dispatch, getState) => {
  var locationPlus = text.replace(/\s/g, '+');
  return apiCall("GET", `/api/search/${locationPlus}/${pagination}`)
    .then(res => {
      dispatch(loadSearchDispatch(res, locationPlus));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
};

export const loadSearchAppend = (search, pagination) => (dispatch, getState) => {
  return apiCall("GET", `/api/search/${search}/${pagination}`)
    .then(res => {
      dispatch(loadSearchAppendDispatch(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
};
