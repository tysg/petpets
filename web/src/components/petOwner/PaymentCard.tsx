import React from "react";
import { Card, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CreditCard } from "../../../../models/creditCard";

type CreditCardProps = {
    creditCard: CreditCard;
    generateModal: (rec: Omit<CreditCard, "cardholder">) => void;
    onDelete: (rec: Omit<CreditCard, "cardholder">) => void;
};

const PaymentCard = (props: CreditCardProps) => {
    const { creditCard, generateModal, onDelete } = props;
    return (
        <Card
            actions={[
                <EditOutlined
                    key="edit"
                    onClick={() => {
                        generateModal(creditCard);
                    }}
                />,
                <DeleteOutlined
                    key="delete"
                    onClick={() => {
                        Modal.confirm({
                            title: "Do you really want to delete this credit card?",
                            onOk: () => {
                                onDelete(creditCard);
                            },
                            okText: "Confirm"
                        });
                    }}
                />
            ]}
            style={{ height: "100%", width: 500}}
        >
            <p> card number: {creditCard.cardNumber}</p>
            <p> expiry date: {creditCard.expiryDate}</p>
            <p> security code: {creditCard.securityCode}</p>
        </Card>
    );
};
export default PaymentCard;
