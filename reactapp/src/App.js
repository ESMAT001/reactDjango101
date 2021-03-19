import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";

import ProvideAuth from './components/ProvideAuth';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import Register from './components/Register';


export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/register">
            <Register/>
          </Route>
          <PrivateRoute path="/">
            <Home />
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}



