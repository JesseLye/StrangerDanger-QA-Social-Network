import { combineReducers } from "redux";
import errors from "./errors";
import authErrors from "./authErrors";
import currentUser from "./currentUser";
import question from "./question";
import dashboard from "./dashboard";
import feed from "./feed";
import answersReceived from "./answersReceived";
import searchResults from "./searchResult";
import randomProfiles from "./randomProfiles";

const rootReducer = combineReducers({
  currentUser,
  errors,
  authErrors, 
  question,
  dashboard,
  feed,
  answersReceived,
  searchResults,
  randomProfiles
});

export default rootReducer;
