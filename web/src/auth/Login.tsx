import React, { useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { Store } from "antd/lib/form/interface";
import axios, { AxiosResponse } from "axios";
import { RouteComponentProps } from "react-router-dom";
import SignUp from "./SignUp";
import { SignInRequest, SignInResponse } from "./../../../models/user";
import { setTokenAndUser } from "./../common/token";

const Login = (props: RouteComponentProps) => {
    const onFinish = (values: Store) => {
        const { email, password } = values;
        const loginDetails: SignInRequest = { email, password };
        axios
            .post("api/login", loginDetails)
            .then((res: AxiosResponse<SignInResponse>) => {
                const { accessToken, user } = res.data.data;
                setTokenAndUser(accessToken, user);
                props.history.push("/dashboard");
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
                rules={[
                    { required: true, message: "Please input your email!" }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: "Please input your password!" }
                ]}
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
        tab: "Login"
    },
    {
        key: "signup",
        tab: "Sign Up"
    }
];

interface ContentInterface {
    [name: string]: Function;
}

const contentList: ContentInterface = {
    login: Login,
    signup: SignUp
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
