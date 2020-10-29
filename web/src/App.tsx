import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import puppies from "./assets/puppies.jpg";
import LoginOrSignUp from "./auth/Login";
import Dashboard from "./Dashboard";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import PublicRoute from "./auth/PublicRoute";
import "./App.css";
import { user as userApi } from "./common/api";
import { getToken, clearToken } from "./common/token";
import axios from "axios";

function Landing() {
  // unauthenticated request
  useEffect(() => {
    axios
      .get("/api/ping")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={puppies} className="App-background" alt="" />
        <p>Welcome to Petpets!</p>
        <Link to="/login">Login</Link>
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
    // axios
    //   .post("/api/verifyToken", token, {
    //     headers: {
    //       "x-access-token": token,
    //     },
    //   })
    //   .catch((err) => {
    //     clearToken();
    //     console.log(err);
    //   });
  });
  return (
    <Router>
      <Switch>
        <PublicRoute exact path="/" component={Landing} />
        <PublicRoute path="/login" component={LoginOrSignUp} />
        <AuthenticatedRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
};

export default App;
