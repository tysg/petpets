import React from "react";
import { Avatar, Space, Card, Rate } from "antd";
import { CareTakerDetails } from "../../../../models/careTaker";

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

const NameAndRating = (props: CareTakerDetails) => {
    return (
        <Space>
            <>{props.fullname}</>
            <Rate disabled defaultValue={4} />
        </Space>
    );
};

const CareTakerCard = (props: CareTakerDetails) => {
    return (
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
                title={<NameAndRating {...props} />}
                description={getCareTakerStatus(props.caretaker_status)}
            />
        </Card>
    );
};
export default CareTakerCard;
