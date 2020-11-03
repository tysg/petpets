import React from "react";
import { Avatar, Space, Card, Rate, Switch } from "antd";
import { CareTakerDetails } from "../../../../models/careTaker";
import { NewRequestState, Action } from "./NewRequest";

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

type CareTakerCardProps = {
    ct: CareTakerDetails;
    state: NewRequestState;
    dispatch: React.Dispatch<Action>;
};

const CareTakerCard = (props: CareTakerCardProps) => {
    const { ct, state, dispatch } = props;
    return (
        <Card
            hoverable
            onClick={() => {
                dispatch({ type: "setCareTaker", param: ct });
                dispatch({ type: "next" });
            }}
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
                        {ct.fullname.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={<NameAndRating {...ct} />}
                description={getCareTakerStatus(ct.caretakerStatus)}
            />
            {`$${ct.ctPriceDaily}/day`}
        </Card>
    );
};
export default CareTakerCard;
