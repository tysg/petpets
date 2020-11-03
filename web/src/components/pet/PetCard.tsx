import React from "react";
import { Avatar, Space, Card, Rate } from "antd";
import { CareTakerDetails } from "../../../../models/careTaker";
import { Pet } from "../../../../models/pet";

const { Meta } = Card;

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

const PetCard = (props: Pet) => {
    return (
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
                        {props.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                description={props.description}
            />
        </Card>
    );
};
export default PetCard;
