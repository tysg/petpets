import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import axios from "axios";

const Dashboard = (props: RouteComponentProps) => {
  const logout = () => {
    axios
      .get("/api/logout")
      .then((res) => props.history.push("/"))
      .catch((err) => console.log(err));
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
