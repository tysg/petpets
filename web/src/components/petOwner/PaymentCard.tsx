import React from "react";
import { Card, Descriptions, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CreditCard } from "../../../../models/creditCard";
import Meta from "antd/lib/card/Meta";

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
                    <>
                        <p>{"Card Number: "} {creditCard.cardNumber} </p>
                        <p> {"Expiry Date: "} {creditCard.expiryDate} </p>
                        <p> {"Security Code: "} {creditCard.securityCode} </p>
                    </>
        </Card>
    );
};
export default PaymentCard;
