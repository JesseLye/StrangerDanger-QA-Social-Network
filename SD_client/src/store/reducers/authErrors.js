import { ADD_ERROR_AUTH, REMOVE_ERROR_AUTH } from "../actionTypes";

export default (state = {message: null}, action) => {
  switch(action.type) {
    case ADD_ERROR_AUTH:
      return {...state, message: action.error};
    case REMOVE_ERROR_AUTH:
      return {...state, message: null};
    default:
      return state;
  }
};
