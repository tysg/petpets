import React from "react";
import { Avatar, Space, Card, Rate, Statistic, Row, Col } from "antd";
import { CareTakerSpecializesInCategory } from "../../../../models/careTaker";
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

const NameAndRating = (props: CareTakerSpecializesInCategory) => {
    // rating rounded the lower 0.5
    return (
        <Space size="small" direction="vertical">
            {props.fullname}
            <Rate
                disabled
                allowHalf
                defaultValue={Math.floor(props.rating * 2) / 2}
                // defaultValue={4.5}
            />
        </Space>
    );
};

type CareTakerCardProps = {
    ct: CareTakerSpecializesInCategory;
    state: NewRequestState;
    dispatch: React.Dispatch<Action>;
};

const CareTakerCard = (props: CareTakerCardProps) => {
    const { ct, dispatch } = props;
    return (
        <Card
            hoverable
            onClick={() => {
                dispatch({ type: "setCareTaker", param: ct });
                dispatch({ type: "next" });
            }}
        >
            <Row align="middle">
                <Col span={18}>
                    <Meta
                        style={{ display: "flex", alignItems: "center" }}
                        avatar={
                            <Avatar src={ct.avatarUrl} size={130}>
                                {ct.fullname.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                        title={<NameAndRating {...ct} />}
                        description={getCareTakerStatus(ct.caretakerStatus)}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Daily Price"
                        value={ct.ctPriceDaily}
                        prefix="$"
                        precision={2}
                    />
                </Col>
            </Row>
        </Card>
    );
};
export default CareTakerCard;
