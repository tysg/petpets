import React, { Dispatch, useEffect, useState } from "react";
import { pets as PetsApi } from "../../common/api";
import { Select, DatePicker, Col, Row, Empty, Spin } from "antd";
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
            {/* <Row gutter={8}>
                <Col span={4}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Choose pet"
                        onChange={onSelectPet}
                    >
                        {petOptions(userPets)}
                    </Select>
                </Col>
                <Col span={8}>
                    <RangePicker onChange={onSelectDates} />
                </Col>
            </Row>
            <br />
            {isLoading ? (
                <Spin />
            ) : careTakers.length === 0 ? (
                <Empty />
            ) : (
                <Row gutter={8}>
                    {careTakers.map((c) => (
                        <Col span={8}>
                            <CareTakerCard
                                ct={c}
                                state={state}
                                dispatch={dispatch}
                            />
                        </Col>
                    ))}
                </Row>
            )} */}
        </>
    );
};

export default CreateOrder;
