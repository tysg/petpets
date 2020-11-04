import React from "react";
import { Modal, Input, Form } from "antd";
import { CreditCard } from "../../../../models/creditCard";

export interface CreditCardModalFormProps {
    title: string;
    visible: boolean;
    onSubmit: (value: Omit<CreditCard, "">) => void;
    onCancel: () => void;
}

const CreditCardModalForm = (props: CreditCardModalFormProps) => {
    const { visible, onSubmit, onCancel, title } = props;
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title={title}
            okText="Submit"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        const {
                            cardholder,
                            cardNumber,
                            expiryDate,
                            securityCode
                        } = values;
                        const record = {
                            cardholder,
                            cardNumber,
                            expiryDate,
                            securityCode
                        };
                        onSubmit(record);
                    })
                    .catch((err) => console.log("Validation failed:", err));
            }}
        >
            <Form form={form}>
                <Form.Item
                    label="card holder"
                    name="card holder"
                    required
                    rules={[
                        () => ({
                            validator(rule, value) {
                                if (value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "card holder cannot be empty"
                                );
                            }
                        })
                    ]}
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="card number"
                    name="card number"
                    required
                    rules={[
                        () => ({
                            validator(rule, value) {
                                if (value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "card number cannot be empty"
                                );
                            }
                        })
                    ]}
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="expiry date"
                    name="expiry date"
                    required
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (value?.length > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "expiry date cannot be empty!"
                                );
                            }
                        })
                    ]}
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="security code"
                    name="security code"
                    required
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (value?.length > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "security code cannot be empty!"
                                );
                            }
                        })
                    ]}
                >
                    <Input></Input>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreditCardModalForm;
