import React from "react";
import { Avatar, Card, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CreditCard } from "../../../../models/creditCard";

const { Meta } = Card;

type CreditCardProps = {
    creditCard: CreditCard;
    generateModal: (rec: Omit<CreditCard, "">) => void;
    onDelete: (rec: Omit<CreditCard, "">) => void;
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
            style={{ height: "100%" }}
        >
            <Meta
                avatar={
                    <Avatar
                        style={{
                            backgroundColor: "#f56a00",
                            verticalAlign: "middle"
                        }}
                        size="large"
                    >
                        {creditCard.cardholder.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={creditCard.cardholder + " / " + creditCard.cardNumber}
                description={
                    <>
                        <p>
                            {"Expiry Date: "}
                            <br />
                            {creditCard.expiryDate}
                        </p>
                        <p>
                            {"Security Code: "}
                            <br />
                            {creditCard.securityCode}
                        </p>
                    </>
                }
            />
        </Card>
    );
};
export default PaymentCard;
