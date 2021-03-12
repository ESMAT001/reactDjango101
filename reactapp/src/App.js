import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ProvideAuth from './ProvideAuth';
import PrivateRoute from './PrivateRoute';
import LoginPage from './LoginPage';
import Home from './Home';



export default function App() {
  return (
    <ProvideAuth>
      <Router>


        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <PrivateRoute path="/">
            <Home />
          </PrivateRoute>
        </Switch>


      </Router>
    </ProvideAuth>
  );
}



