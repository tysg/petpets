import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import puppies from "./assets/puppies.jpg";
import LoginOrSignUp from "./auth/Login";
import AdministratorLogin from "./auth/AdministratorLogin";
import Dashboard from "./Dashboard";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import PublicRoute from "./auth/PublicRoute";
import "./App.css";
import { user as userApi } from "./common/api";
import { getToken, clearToken } from "./common/token";
import AdministratorSiteLayout from "./common/AdministratorSiteLayout";

function Landing() {
  // unauthenticated request
  return (
    <div className="App">
      <header className="App-header">
        <img src={puppies} className="App-background" alt="" />
        <p>Welcome to Petpets!</p>
        <Link to="/login">User</Link>
        <Link to="/administratorlogin">Administrator</Link>
      </header>
    </div>
  );
}

const App = () => {
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    // verify token on page refresh
    userApi.verify().catch((err) => {
      clearToken();
      console.log(err);
    });
  });
  return (
    <Router>
      <Switch>
        <PublicRoute exact path="/" component={Landing} />
        <PublicRoute path="/login" component={LoginOrSignUp} />
        <PublicRoute path="/administratorlogin" component={AdministratorLogin} />
        <AuthenticatedRoute path="/dashboard" component={Dashboard} />
        <AuthenticatedRoute path="/administrator" component={AdministratorSiteLayout} />
        <Route>Oops this page does not exist</Route>
      </Switch>
    </Router>
  );
};

export default App;
