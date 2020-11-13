import React from "react";
import { Modal, Input, Form } from "antd";
import { CreditCard } from "../../../../models/creditCard";
import moment from "moment";

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
                        let { cardNumber, expiryDate, securityCode } = values;

                        const record: Omit<CreditCard, "cardholder"> = {
                            cardNumber,
                            // cast MM/YYYY to jS datem
                            expiryDate: moment(expiryDate, "MM/YYYY").toDate(),
                            securityCode
                        };
                        onSubmit(record);
                    })
                    .catch((err) => console.log("Validation failed:", err));
            }}
        >
            <Form form={form}>
                <Form.Item label="Card Number" name="cardNumber" required>
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="Expiry Date (MM/YYYY)"
                    name="expiryDate"
                    required
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item label="Security Code" name="securityCode" required>
                    <Input></Input>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreditCardModalForm;
