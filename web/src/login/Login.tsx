import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { Store } from "antd/lib/form/interface";
import axios from "axios";

const Login = () => {
  const onFinish = (values: Store) => {
    axios
      .post("localhost:8000/login", values)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const onFail = (values: Store) => console.log(values);

  // const a = 4;

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFail}
    >
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
      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
