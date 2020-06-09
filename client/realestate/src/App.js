import React , { Component }from 'react';
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import store from './store';
import './App.css';

//importing navbar and landing
import Navbar  from './components/layout/Navbar';
import Landing from './components/layout/Landing';
//importing login and regsiter
import Register from './components/auth/Register';
import Login from './components/auth/Login';
//
import PrivateRoute from "./PrivateRoute/private-route";
import Dashboard from "./components/dashboard/dashboard";


if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login"; //agar user login nhi hoga aur bina login ke dashboard me jane kikosish krega to login pe a jayega
  }
}

class App extends Component {
  render() {
  return (
    <Provider store={store}>
    <Router>
    <div className="App">
      <Navbar />
      <Route exact path='/' component={Landing} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
      <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
    </Router>
    </Provider>
  );
  }
}

export default App;
