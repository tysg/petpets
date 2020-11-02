import React, { Dispatch, useEffect, useState } from "react";
import { pets as PetsApi } from "../../common/api";
import { Select, DatePicker, Col, Row, Empty, Spin, Input, Space } from "antd";
import moment from "moment";
import { Pet } from "../../../../models/pet";
import { CareTakerDetails } from "../../../../models/careTaker";
import CareTakerCard from "./CareTakerCard";
import { Action, NewRequestState } from "./NewRequest";

type CreateOrderProps = {
    state: NewRequestState;
    dispatch: Dispatch<Action>;
};
const CreateOrder = (props: CreateOrderProps) => {
    const { state, dispatch } = props;
    const { selectedCareTaker, selectedDates, selectedPet } = state;

    return (
        <>
            <Row gutter={8}>
                <Col span={6} />
                <Col span={12}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Input placeholder="Transfer Mode" />
                        <Input.TextArea
                            placeholder="Note to Care Taker..."
                            autoSize={{ minRows: 4 }}
                        />
                    </Space>
                </Col>
                <Col span={6} />
            </Row>
        </>
    );
};

export default CreateOrder;
