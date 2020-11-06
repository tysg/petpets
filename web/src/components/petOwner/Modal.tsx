import React from "react";
import { Modal, Input, Form } from "antd";
import { CreditCard } from "../../../../models/creditCard";

export interface CreditCardModalFormProps {
    title: string;
    visible: boolean;
    onSubmit: (value: Omit<CreditCard, "cardholder">) => void;
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
                            cardNumber,
                            expiryDate,
                            securityCode
                        } = values;
                        const record: Omit<CreditCard, "cardholder"> = {
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
                    label="card number"
                    name="card number"
                    required
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="expiry date"
                    name="expiry date"
                    required
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="security code"
                    name="security code"
                    required
                >
                    <Input></Input>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreditCardModalForm;
