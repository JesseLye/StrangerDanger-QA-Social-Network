import { apiCall } from "../../services/api";
import { addError, removeError } from "./errors";
import { LOAD_ANSWERS, APPEND_ANSWERS } from "../actionTypes";
// import { stopLoadDispatch } from "./canLoad";

export const loadAnswerDispatch = answers => ({
  type: LOAD_ANSWERS,
  answers
});

export const appendAnswerDispatch = answers => ({
  type: APPEND_ANSWERS,
  answers
});


export const loadAnswers = (pagination, init) => {
  return dispatch => {
    return apiCall("GET", `/api/answersReceived/${pagination}`)
      .then(res => {
        if(init) {
          if(res.length === 0) throw "Nuffin' here!";
          dispatch(removeError());
          dispatch(loadAnswerDispatch(res));
        } else {
          dispatch(appendAnswerDispatch(res));
        }
      })
      .catch(err => {
        dispatch(addError(err));
      });
  };
};
