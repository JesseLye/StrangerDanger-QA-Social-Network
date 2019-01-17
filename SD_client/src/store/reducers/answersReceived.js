import { LOAD_ANSWERS, APPEND_ANSWERS } from "../actionTypes";

const defaultState = [];

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_ANSWERS:
      let initState = {
        answers: action.answers[0].answersReceived,
        status: action.answers[1].status
      };
      return initState;
    case APPEND_ANSWERS:
      let newState = {
        answers: [...state.answers],
        status: action.answers[1].status
      };
      if(action.answers[0].answersReceived.length > 0) newState.answers.push(...action.answers[0].answersReceived);
      return newState;
    default:
      return defaultState;
  }
};
