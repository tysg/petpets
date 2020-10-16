import React, { useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { Store } from "antd/lib/form/interface";
import axios from "axios";
import { RouteComponentProps } from "react-router-dom";

const SignUp = (props: RouteComponentProps) => {
  const onFinish = (values: Store) => {
    axios
      .post("/api/signup", values)
      .then((res) => props.history.push("/dashboard"))
      .catch((err) => {
        console.log(err);
        // setAuthfail(true);
      });
  };
  const onFail = (values: Store) => console.log(values);
  const [authfail, setAuthfail] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  return (
    <Form onFinish={onFinish} onFinishFailed={onFail}>
      <Form.Item
        label="New Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="New Password"
        name="password"
        hasFeedback
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="password2"
        hasFeedback
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please input your password!" },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const Login = (props: RouteComponentProps) => {
  const onFinish = (values: Store) => {
    console.log("Received values of form: ", values);
    axios
      .post("api/login", values)
      .then((res) => props.history.push("/dashboard"))
      .catch((err) => {
        console.log(err.response);
        setErrMsg(err.response.data.errorMessage);
        setAuthfail(true);
      });
  };
  const onFail = (values: Store) => console.log(values);
  const [authfail, setAuthfail] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // const a = 4;

  return (
    <Form name="basic" onFinish={onFinish} onFinishFailed={onFail}>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
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
  {
    key: "signup",
    tab: "Sign Up",
  },
];

interface ContentInterface {
  [name: string]: Function;
}

const contentList: ContentInterface = {
  login: Login,
  signup: SignUp,
};

const LoginOrSignUp = (props: RouteComponentProps) => {
  const [key, setKey] = useState("login");
  const onTabChange = (key: string) => setKey(key);
  return (
    <Card tabList={tabList} activeTabKey={key} onTabChange={onTabChange}>
      {contentList[key](props)}
    </Card>
  );
};

export default LoginOrSignUp;
