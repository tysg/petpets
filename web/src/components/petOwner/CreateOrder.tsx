import React, { Dispatch, useEffect, useState } from "react";
import { Select, Col, Row, Radio, Input, Space } from "antd";
import moment from "moment";
import { Action, NewRequestState } from "./NewRequest";
import { CreditCard } from "../../../../models/creditCard";
import { user as UserApi } from "./../../common/api";

type CreateOrderProps = {
    state: NewRequestState;
    dispatch: Dispatch<Action>;
};
const CreateOrder = (props: CreateOrderProps) => {
    const { dispatch } = props;
    const [payment, setPayment] = useState<string>();
    const [creditCards, setCreditCards] = useState<CreditCard[]>();

    // fetch upon pet and date update
    useEffect(() => {
        const fetchCreditCards = async () => {
            try {
                const fetchedCreditCards = (await UserApi.getCreditCards()).data
                    .data;
                setCreditCards(fetchedCreditCards);
            } catch (err) {
                console.log("fetching credit card error", err);
            }
        };
        fetchCreditCards();
    }, []);
    return (
        <>
            <Row gutter={8}>
                <Col span={6} />
                <Col span={12}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Select
                            placeholder="Select Transfer Mode"
                            style={{ width: 200 }}
                            onChange={(value) =>
                                dispatch({
                                    type: "setTransportMethod",
                                    param: value
                                })
                            }
                        >
                            <Select.Option value="pickup">
                                Pick Up
                            </Select.Option>
                            <Select.Option value="deliver">
                                Deliver
                            </Select.Option>
                            <Select.Option value="pcs">
                                Transit through PCS
                            </Select.Option>
                        </Select>
                        <Input.TextArea
                            placeholder="Note to Care Taker..."
                            autoSize={{ minRows: 4 }}
                            onChange={(value) => {
                                dispatch({ type: "setNotes", param: value });
                            }}
                        />
                        <Radio.Group
                            onChange={(value) => setPayment(value.target.value)}
                        >
                            <Radio.Button
                                value="cash"
                                onChange={(value) =>
                                    dispatch({ type: "setCash" })
                                }
                            >
                                Cash
                            </Radio.Button>
                            <Radio.Button
                                value="credit-card"
                                onChange={(_) =>
                                    dispatch({ type: "setCreditCard" })
                                }
                            >
                                Credit Card
                            </Radio.Button>
                        </Radio.Group>

                        {payment === "credit-card" && (
                            <Select
                                placeholder="Choose your credit card"
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                    dispatch({
                                        type: "setCreditCard",
                                        param: value
                                    })
                                }
                            >
                                {creditCards?.map((c) => (
                                    <Select.Option value={c.cardNumber}>
                                        {c.cardNumber +
                                            "  EXP:" +
                                            moment(c.expiryDate).format(
                                                "MM/YYYY"
                                            )}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </Space>
                </Col>
                <Col span={6} />
            </Row>
        </>
    );
};

export default CreateOrder;
