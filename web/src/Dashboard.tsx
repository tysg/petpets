import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { clearToken } from "./common/token";
import SiteLayout from "./common/SiteLayout";
import { Button } from "antd";
import { user as userApi } from "./common/api";

const Dashboard = (props: RouteComponentProps) => {
  const logout = () => {
    clearToken();
    props.history.push("/");
  };
  useEffect(() => {
    userApi
      .get("/api/ping")
      .then((res) => setState("pinged success"))
      .catch((err) => console.log(err));
  });
  const [ping, setState] = useState("pinging");
  return (
    <>
      <SiteLayout></SiteLayout>
      <Button onClick={logout}>{ping}</Button>
    </>
  );
};

export default Dashboard;
