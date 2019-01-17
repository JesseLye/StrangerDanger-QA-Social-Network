import { LOAD_PROFILES } from "../actionTypes";
import { apiCall } from "../../services/api";
import { addError } from "./errors";

export const loadProfilesDispatch = profiles => ({
  type: LOAD_PROFILES,
  profiles
});

export const loadProfiles = () => {
  return dispatch => {
    return apiCall("GET", `/api/actions/randomProfile`)
      .then(res => {
        dispatch(loadProfilesDispatch(res));
      })
      .catch(err => {
        dispatch(addError(err.message));
      });
    };
};
