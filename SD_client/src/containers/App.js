import React from 'react';
import { Provider } from "react-redux";
import { configureStore } from "../store";
import { BrowserRouter as Router } from "react-router-dom";
// import Navbar from "./Navbar";
import Main from "./Main";
import { setAuthorizationToken, setCurrentUser } from "../store/actions/auth";
import jwtDecode from "jwt-decode";
import { apiCall } from "../services/api";

const store = configureStore();

if(localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  // prevent someone from manually tampering with the key of jwtToken in localStore
  try {
    (async function(){
      let decoded = jwtDecode(localStorage.jwtToken);
      let getFollowData = await apiCall("GET", "/api/auth/followData");
      decoded["profileFollowing"] = getFollowData[0].profileFollowing.slice();
      store.dispatch(setCurrentUser(decoded));
    })();
  } catch(e) {
    store.dispatch(setCurrentUser({}));
  }
}

const App = () => (
  <Provider store={store}>
    <Router>
      <main>
        <Main />
      </main>
    </Router>
  </Provider>
);

export default App;
