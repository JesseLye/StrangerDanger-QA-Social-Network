import { ADD_ERROR_AUTH, REMOVE_ERROR_AUTH } from "../actionTypes";

export const addErrorAuth = error => ({
  type: ADD_ERROR_AUTH,
  error
});

export const removeErrorAuth = () => ({
  type: REMOVE_ERROR_AUTH
});
