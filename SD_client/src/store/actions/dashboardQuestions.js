import { apiCall } from "../../services/api";
import { addError, removeError } from "./errors";
import { LOAD_QUESTIONS_DASHBOARD, APPEND_QUESTIONS_DASHBOARD, REMOVE_QUESTIONS_DASHBOARD } from "../actionTypes";

export const loadDashboardQuestions = questions => ({
  type: LOAD_QUESTIONS_DASHBOARD,
  questions
});

export const rDashboardQuestion = question => ({
  type: REMOVE_QUESTIONS_DASHBOARD,
  id: question
});

export const appendDashboardQuestions = questions => ({
  type: APPEND_QUESTIONS_DASHBOARD,
  questions
});

export const getDashboardQuestions = (pagination, init) => {
  return dispatch => {
    return apiCall("GET", `/api/dashboard/${pagination}`)
      .then(res => {
        if(init) {
          if(res.length === 0) throw "Nuffin' here!";
          dispatch(removeError());
          dispatch(loadDashboardQuestions(res));
        } else {
          dispatch(appendDashboardQuestions(res));
        }
      })
      .catch(err => {
        dispatch(addError(err.message));
      });
  };
};

export const DashboardQuestionAction = (question_id, text) => (dispatch, getState) => {
  let { currentUser } = getState();
  var apiArgs = [];

  if(typeof text === "string") {
   apiArgs = ["POST", `/api/user/${currentUser.user.id}/submitAnswer/${question_id}`, { text }];
 } else {
   apiArgs = ["DELETE", `/api/user/${currentUser.user.id}/deleteQuestion/${question_id}`];
 }

  return apiCall(...apiArgs)
    .then(res => {
      dispatch(rDashboardQuestion(question_id))
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
  };

// export const postNewDashboardAnswer = (id, text) => (dispatch, getState) => {
//   let { currentUser } = getState();
//     return apiCall("POST", `/api/user/${currentUser.user.id}/submitAnswer/${id}`, { text })
//       .then(res => {
//         dispatch(rDashboardQuestion(id))
//       })
//       .catch(err => {
//         dispatch(addError(err))
//       });
// };
