import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import puppies from "./assets/puppies.jpg";
import LoginOrSignUp from "./auth/Login";
import Dashboard from "./Dashboard";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import "./App.css";
import axios from "axios";

async function ping(): Promise<boolean> {
  const reply = (await axios.get("api/ping")).data;
  return reply === "PONG";
}

function Landing() {
  const [isReceived, setIsReceived] = useState(false);
  useEffect(() => {
    (async () => {
      const res = await ping();
      setIsReceived(res);
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={puppies} className="App-background" alt="" />
        <p>Welcome to Petpets!</p>
        <a
          className={isReceived ? "App-link-green" : "App-link-blue"}
          href="/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          Getting Started
        </a>
        <Link to="/login">Login</Link>
      </header>
    </div>
  );
}

const App = () => {
  const [user, setUser] = useState();
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={LoginOrSignUp} setUser={setUser} />
        <AuthenticatedRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
};

export default App;
