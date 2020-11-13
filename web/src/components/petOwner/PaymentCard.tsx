import React from "react";
import { Card, Descriptions, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CreditCard } from "../../../../models/creditCard";
import moment from "moment";

type CreditCardProps = {
    creditCard: CreditCard;
    generateModal: (rec: Omit<CreditCard, "cardholder">) => void;
    onDelete: (rec: Omit<CreditCard, "cardholder">) => void;
};

const formatCreditCardNumber = (num: number) => {
    const str = num.toString();
    const chunks: string[] = new Array(4);

    for (let i = 0, o = 0; i < 4; ++i, o += 4) {
        chunks[i] = str.substr(o, 4);
    }

    return chunks.reduce((a, b) => a + " " + b);
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
                            title:
                                "Do you really want to delete this credit card?",
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
            <>
                <p>
                    {"Card Number: "}{" "}
                    {formatCreditCardNumber(creditCard.cardNumber)}{" "}
                </p>
                <p>
                    {" "}
                    {"Expiry Date: " +
                        moment(creditCard.expiryDate).format("MM/YYYY")}
                </p>
                <p> {"Security Code: ***"}</p>
            </>
        </Card>
    );
};
export default PaymentCard;
