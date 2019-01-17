import { LOAD_QUESTIONS, REMOVE_QUESTION, EMPTY_QUESTIONS, APPEND_QUESTIONS } from "../actionTypes";

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_QUESTIONS:

      let initState = Object.assign({}, action.questions[0]);
      initState["status"] = action.questions[1].status;

      return initState;
    case REMOVE_QUESTION:
      let duplicateArray = Object.assign({}, state);
      duplicateArray.questionsReceived = state.questionsReceived.filter(q => q._id !== action.id);
      return duplicateArray;
    case APPEND_QUESTIONS:
      let newState = {...state, status: action.questions[1].status};

      if(action.questions.length > 0) newState["questionsReceived"].push(...action.questions[0].questionsReceived);

      return newState;
    case EMPTY_QUESTIONS:
      return defaultState;
    default:
      return state;
  }
};
