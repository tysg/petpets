import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { clearToken } from "./common/token";

const Dashboard = (props: RouteComponentProps) => {
  const logout = () => {
    clearToken();
    props.history.push("/");
  };
  useEffect(() => {
    axios
      .get("/api/ping")
      .then((res) => setState("pinged success"))
      .catch((err) => setState(err));
  });
  const [ping, setState] = useState("pinging");
  return (
    <div>
      {ping}
      <a onClick={logout}>Log Out</a>
    </div>
  );
};

export default Dashboard;
