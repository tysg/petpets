import React, { useEffect, useState } from "react";
import { creditCards as CreditCardsApi } from "./../../common/api";
import { Col, Row, Empty, Button, PageHeader, message } from "antd";
import { CreditCard } from "../../../../models/creditCard";
import PaymentCard from "./PaymentCard";
import CreditCardModalForm from "./Modal";

const CreditCards = () => {
    const [userCreditCards, setUserCreditCards] = useState<CreditCard[]>([]);
    const fetchUserCreditCards = async () => {
        try {
            const fetchedCreditCards = (await CreditCardsApi.getUserCreditCards()).data.data;
            setUserCreditCards(fetchedCreditCards);
        } catch (err) {
            console.log("fetchCreditCards err", err);
        }
    };
    // fetch only once
    useEffect(() => {
        fetchUserCreditCards();
    }, []);

    // modal settings
    const [visibleModal, setVisibleModal] = useState(false);
    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const [record, setRecord] = useState<Omit<CreditCard, "cardholder">>({
        cardNumber: 0,
        expiryDate: new Date(),
        securityCode: 505
    });
    const [title, setTitle] = useState("");

    const onSubmit = async (values: Omit<CreditCard, "cardholder">) => {
        try {
            if (userCreditCards.find((c) => c.cardNumber === values.cardNumber)) {
                await CreditCardsApi.putCreditCard(values);
                message.success("Successfully edited credit card!");
            } else {
                await CreditCardsApi.postCreditCard(values);
                message.success("Successfully created credit card!");
            }
        } catch (err) {
            message.error("Something is wrong: " + err);
            console.log(err);
        } finally {
            fetchUserCreditCards();
            hideModal();
        }
    };
    const onDelete = (values: Omit<CreditCard, "cardholder">) => {
        CreditCardsApi.deleteCreditCard(values)
            .then((res) => {
                message.success("Successfully deleted credit card!");
                console.log(res);
            })
            .catch((err) => {
                message.error("There was an error deleting your credit card.");
                console.log(err);
            })
            .finally(() => {
                fetchUserCreditCards();
                hideModal();
            });
    };
    const newModal = () => {
        setTitle("New Credit Card");
        setRecord({
            cardNumber: 0,
            expiryDate: new Date(),
            securityCode: 505
        });
        showModal();
    };
    const generateModal = (record: Omit<CreditCard, "cardholder">) => {
        setTitle("Edit CreditCard");
        setRecord(record);
        showModal();
    };

    return (
        <PageHeader
            title="Manage CreditCards"
            extra={
                <Button type="primary" onClick={newModal}>
                    Add CreditCard
                </Button>
            }
        >
            {visibleModal && (
                <CreditCardModalForm
                    visible={visibleModal}
                    title={title}
                    onCancel={hideModal}
                    onSubmit={onSubmit}
                ></CreditCardModalForm>
            )}
            {userCreditCards.length === 0 ? (
                <Empty />
            ) : (
                <Row gutter={8}>
                    {userCreditCards.map((c) => (
                        <Col span={12}>
                            <PaymentCard
                                creditCard={c}
                                generateModal={generateModal}
                                onDelete={onDelete}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </PageHeader>
    );
};
export default CreditCards;