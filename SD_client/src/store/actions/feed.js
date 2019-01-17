import { apiCall } from "../../services/api";
import { addError, removeError } from "./errors";
import { LOAD_FEED, APPEND_FEED } from "../actionTypes";

export const loadFeedDispatch = feed => ({
  type: LOAD_FEED,
  feed
});

export const appendFeedDispatch = feed => ({
  type: APPEND_FEED,
  feed
});

export const loadFeed = (pagination, init) => {
  return dispatch => {
    return apiCall("GET", `/api/feed/${pagination}`)
      .then(res => {
        if(init) {
          if(res.length === 0) throw "Nuffin' here!";
          dispatch(removeError());
          dispatch(loadFeedDispatch(res));
        } else {
          dispatch(appendFeedDispatch(res));
        }
      })
      .catch(err => {
        dispatch(addError(err));
      });
  };
};
