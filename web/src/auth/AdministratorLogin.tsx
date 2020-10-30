import React, { useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { Store } from "antd/lib/form/interface";
import axios, { AxiosResponse } from "axios";
import { RouteComponentProps } from "react-router-dom";
import { SignInRequest, SignInResponse } from "./../../../models/administrator";
import { setToken } from "./../common/token";

const Login = (props: RouteComponentProps) => {
  const onFinish = (values: Store) => {
    const { email, password } = values;
    const loginDetails: SignInRequest = { email, password };
    axios
      .post("api/administratorlogin", loginDetails)
      .then((res: AxiosResponse<SignInResponse>) => {
        const token: string = res.data.data.accessToken;
        setToken(token);
        props.history.push("/administrator");
      })
      .catch((err) => {
        console.log(err.response);
        setErrMsg(err.response.data.errorMessage);
        setAuthfail(true);
      });
  };
  const onFail = (values: Store) => console.log(values);
  const [authfail, setAuthfail] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  return (
    <Form name="basic" onFinish={onFinish} onFinishFailed={onFail}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      {authfail && <Alert type="error" message={errMsg}></Alert>}
    </Form>
  );
};

const tabList = [
  {
    key: "login",
    tab: "Login",
  },
];

interface ContentInterface {
  [name: string]: Function;
}

const contentList: ContentInterface = {
  login: Login,
};

const AdministratorLogin = (props: RouteComponentProps) => {
  const [key, setKey] = useState("login");
  const onTabChange = (key: string) => setKey(key);
  return (
    <Card tabList={tabList} activeTabKey={key} onTabChange={onTabChange}>
      {contentList[key](props)}
    </Card>
  );
};

export default AdministratorLogin;
