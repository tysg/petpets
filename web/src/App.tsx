import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import puppies from "./assets/puppies.jpg";
import LoginOrSignUp from "./auth/Login";
import Dashboard from "./Dashboard";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import PublicRoute from "./auth/PublicRoute";
import "./App.css";
import axios from "axios";
import { getToken } from "./common/token";

async function ping(): Promise<boolean> {
  const reply = (await axios.get("api/ping")).data;
  return reply === "PONG";
}

function Landing() {
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
    //verify token on page refresh
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
