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
    // rating rounded the lower 0.5
    return (
        <Space size="middle">
            <>{props.fullname}</>
            <Rate
                disabled
                allowHalf
                defaultValue={Math.floor(props.rating * 2) / 2}
            />
        </Space>
    );
};

const CareTakerCard = (props: CareTakerDetails) => {
    return (
        // TODO: bind onClick to the next stage
        <Card hoverable onClick={console.log}>
            <Meta
                avatar={
                    <Avatar
                        style={{
                            backgroundColor: "#f56a00",
                            verticalAlign: "middle"
                        }}
                        size="large"
                    >
                        {props.fullname.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={<NameAndRating {...props} />}
                description={getCareTakerStatus(props.caretakerStatus)}
            />
        </Card>
    );
};
export default CareTakerCard;
