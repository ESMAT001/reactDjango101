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



