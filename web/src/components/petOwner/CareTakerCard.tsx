import React from "react";
import { Avatar, Card } from "antd";
import {
    CareTakerDetails,
    CaretakerStatus
} from "../../../../models/careTaker";

const { Meta } = Card;

const getCareTakerStatus = (s: number) => {
    // NOTE: cannot import enum here cos import restrictions
    switch (s) {
        case 0:
            return "Not a Care Taker";
        case 1:
            return "Part Time Care Taker";
        case 2:
            return "Full Time Care Taker";
        default:
            return "Oops, something is wrong.";
    }
};

const CareTakerCard = (props: CareTakerDetails) => {
    return (
        // <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
        <Card>
            <Meta
                avatar={
                    <Avatar
                        style={{
                            backgroundColor: "#f56a00",
                            verticalAlign: "middle"
                        }}
                        size="large"
                    >
                        {props.fullname.charAt(0)}
                    </Avatar>
                }
                title={props.fullname}
                description={getCareTakerStatus(props.caretaker_status)}
            />
        </Card>
    );
};
export default CareTakerCard;
