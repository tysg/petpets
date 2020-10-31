import React, { useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { Store } from "antd/lib/form/interface";
import axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { NewUser, SignUpResponse } from "../../../models/user";

const SignUp = (props: RouteComponentProps) => {
    const onFinish = (values: Store) => {
        const { fullname, password, address, phone, email } = values;
        const newUserData: NewUser = {
            fullname,
            password,
            address,
            phone,
            email
        };
        axios
            .post("/api/signup", newUserData)
            .then((res) => props.history.push("/dashboard"))
            .catch((err) => {
                setAuthfail(true);
                const errBody: SignUpResponse = err.response.data;
                setErrMsg(errBody.error);
            });
    };
    const onFail = (values: Store) => console.log(values);
    const [authfail, setAuthfail] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    return (
        <Form onFinish={onFinish} onFinishFailed={onFail}>
            <Form.Item
                label="Full Name"
                name="fullname"
                rules={[
                    { required: true, message: "Please input your full name!" }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="New Password"
                name="password"
                hasFeedback
                rules={[
                    { required: true, message: "Please input your password!" }
                ]}
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
                        }
                    })
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
                        message: "The input is not valid E-mail!"
                    },
                    {
                        required: true,
                        message: "Please input your E-mail!"
                    }
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
                        message: "Please input your phone number!"
                    },
                    (_) => ({
                        validator: async (rule, value) => {
                            const regex = /(6|8|9)\d{7}/g;
                            if (!value || value.match(regex)) {
                                return Promise.resolve();
                            }
                            return Promise.reject("Not a valid phone number");
                        }
                    })
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="address"
                label="Home Address"
                rules={[
                    {
                        required: true,
                        message: "Please input your home address!"
                    }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="avatarUrl"
                label="Gravatar Link"
                // rules={[
                //   { required: true, message: "Please give a link to your avatar!" },
                // ]}
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

export default SignUp;
