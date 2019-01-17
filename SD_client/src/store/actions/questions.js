import { apiCall } from "../../services/api";
import { addError, removeError } from "./errors";
import { LOAD_QUESTIONS,
         REMOVE_QUESTION,
         ADD_PROFILE_FOLLOWING,
         REMOVE_PROFILE_FOLLOWING,
         EMPTY_QUESTIONS,
         APPEND_QUESTIONS } from "../actionTypes";

export const addFollowing = following => ({
  type: ADD_PROFILE_FOLLOWING,
  id: following
});

export const removeFollowing = following => ({
  type: REMOVE_PROFILE_FOLLOWING,
  id: following
});

export const loadQuestions = questions => ({
  type: LOAD_QUESTIONS,
  questions
});

export const removeQ = id => ({
  type: REMOVE_QUESTION,
  id: id
});

export const appendQuestions = questions => ({
  type: APPEND_QUESTIONS,
  questions
});

export const emptyQuestions = () => ({
  type: EMPTY_QUESTIONS
});

export const removeQuestion = (question_id) => (dispatch, getState) => {
  let { currentUser } = getState();
  return apiCall("delete", `/api/user/${currentUser.user.id}/deleteQuestion/${question_id}`)
    .then(() => dispatch(removeQ(question_id)))
    .catch(err => {
      addError(err.message); // pp2_server handlers/error.js
    });
};

export const removeAnswer = (answer_id, question_id) => (dispatch, getState) => {
  let { currentUser } = getState();
  return apiCall("delete", `/api/user/${currentUser.user.id}/deleteAnswer/${answer_id}`)
    .then(res => dispatch(removeQ(question_id)))
    .catch(err => {
      addError(err.message);
    });
};

export const getQuestions = (user_id, pagination, init) => {
  return dispatch => {
    return apiCall("GET", `/api/user/${user_id}/${pagination}`)
      .then(res => {
        if(init) {
          if(res.length === 0) throw "Nuffin' here!";
          dispatch(removeError());
          dispatch(loadQuestions(res));
        } else {
          dispatch(appendQuestions(res));
        }
      })
      .catch(err => {
        dispatch(addError(err));
      });
  };
};

export const postNewQuestion = text => (dispatch, getState) => {
  let { question } = getState();
  return apiCall("POST", `/api/user/${question._id}/submitQuestion`, { text })
    .catch(err => addError(err.message));
};

export const emptyQuestionsFunc = () => {
  return dispatch => {
    dispatch(emptyQuestions());
  }
}

export const followUser = user => (dispatch, getState) => {
  return apiCall("POST", "/api/actions/followUser", { user })
      .then(res => { dispatch(addFollowing(user)) })
      .catch(err => addError(err.message));
};

export const unfollowUser = user => (dispatch, getState) => {
  return apiCall("POST", "/api/actions/unfollowUser", { user })
      .then(res => { dispatch(removeFollowing(user)) })
      .catch(err => addError(err.message));
};

export const handleLike = id => (dispatch, getState) => {
  return apiCall("POST", "/api/actions/likePost", { id })
      .catch(err => addError(err.message));
};
