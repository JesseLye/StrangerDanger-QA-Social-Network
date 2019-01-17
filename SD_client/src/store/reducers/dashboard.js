import { LOAD_QUESTIONS_DASHBOARD, APPEND_QUESTIONS_DASHBOARD, REMOVE_QUESTIONS_DASHBOARD } from "../actionTypes";

export default (state = [], action) => {
  switch (action.type) {
    case LOAD_QUESTIONS_DASHBOARD:
      let initState = {
        dashboardQuestions: action.questions[0].questionsReceived,
        status: action.questions[1].status
      };
      return initState;
    case APPEND_QUESTIONS_DASHBOARD:
      let newState = {
        dashboardQuestions: [...state.dashboardQuestions],
        status: action.questions[1].status
      };

      if(action.questions[0].questionsReceived.length > 0) newState.dashboardQuestions.push(...action.questions[0].questionsReceived);

      return newState;
    case REMOVE_QUESTIONS_DASHBOARD:
      let removeState = {...state};
      removeState.dashboardQuestions = removeState.dashboardQuestions.filter(q => q._id !== action.id);
      return removeState;
    default:
      return state;
  }
};
