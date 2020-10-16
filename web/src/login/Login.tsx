import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, InputNumber } from "antd";
import { Store } from "antd/lib/form/interface";
import axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { NewUser } from "../../../models/userModel";

const SignUp = (props: RouteComponentProps) => {
  const onFinish = (values: Store) => {
    axios
      .post("/api/signup", values)
      .then((res) => props.history.push("/dashboard"))
      .catch((err) => {
        console.log(err);
        setAuthfail(true);
        setErrMsg(err.response.data.errorMessage);
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
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: "Please input your phone number!",
          },
          (_) => ({
            validator: async (rule, value) => {
              const regex = /(6|8|9)\d{7}/g;
              if (!value || value.match(regex)) {
                return Promise.resolve();
              }
              return Promise.reject("Not a valid phone number");
            },
          }),
        ]}
      >
        {/* <InputNumber min={0} max={99999999} /> */}
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Home Address"
        rules={[{ required: true, message: "Please input your home address!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
      {authfail && <Alert type="error" message={errMsg}></Alert>}
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
