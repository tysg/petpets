import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import logo from "./logo.svg";
import Login from "./login/Login";
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
      <Link to="/login">Login</Link>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className={isReceived ? "App-link-green" : "App-link-red"}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Backend is {isReceived ? "online!" : "offline!"}
        </a>
      </header>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/dashboard" component={Landing}></Route>
      </Switch>
    </Router>
  );
};

export default App;
