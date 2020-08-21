import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Layout } from "antd";
import logo from "./logo.svg";
import Login from "./login/Login";
import "./App.css";
import axios from "axios";

async function ping(): Promise<string> {
  return (await axios.get("api/ping")).data;
}

function Landing() {
  const [isReceived, setIsReceived] = useState(false);
  useEffect(() => {
    (async () => {
      const res = await ping();
      if (res === "pong") {
        setIsReceived(true);
      }
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
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React.
          {isReceived ? "Backend doesn't work" : "backend works!!"}
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
        <Route exact path="/login" component={Login}></Route>
      </Switch>
    </Router>
  );
};

export default App;
