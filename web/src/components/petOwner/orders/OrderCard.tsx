import React from "react";
import {
    Space,
    Descriptions,
    Card,
    Row,
    Col,
    PageHeader,
    Button,
    Rate
} from "antd";
import moment from "moment";
import { BidJoinCareTaker } from "../../../../../models/bid";
import DescriptionsItem from "antd/lib/descriptions/Item";

interface OrderCardProps {
    order: BidJoinCareTaker;
    index: number;
    canReview: boolean;
    openModal: (value: BidJoinCareTaker) => void;
}

const OrderCard = (props: OrderCardProps) => {
    const { order, index, canReview, openModal } = props;
    const {
        fullname,
        avatar_url,
        address,
        feedback,
        pet_name,
        start_date,
        end_date,
        avg_rating,
        rating
    } = order;

    const buttons = canReview
        ? [
              <Button key="1" onClick={() => openModal(order)}>
                  Rate
              </Button>
          ]
        : null;

    return (
        <Card>
            <PageHeader
                title={fullname}
                avatar={{
                    size: 80,
                    src: avatar_url
                }}
                subTitle={address}
                extra={buttons}
            >
                <Row gutter={[48, 16]}>
                    <Col span={24}>
                        <Descriptions bordered layout="vertical">
                            <DescriptionsItem label="Pet">
                                <Space align="center">
                                    {pet_name}
                                    {/* <Tag>{category}</Tag> */}
                                </Space>
                            </DescriptionsItem>
                            <DescriptionsItem label="Duration">
                                {`${moment(start_date).format(
                                    "DD/MM/YYYY"
                                )} - ${moment(end_date).format("DD/MM/YYYY")}`}
                            </DescriptionsItem>
                            <DescriptionsItem
                                label={canReview ? "Rating" : "Average Rating"}
                            >
                                <Rate
                                    disabled
                                    allowHalf
                                    value={canReview ? rating : avg_rating}
                                />
                            </DescriptionsItem>
                            <DescriptionsItem label="Review" span={3}>
                                {feedback ? feedback : "-"}
                            </DescriptionsItem>
                        </Descriptions>
                    </Col>
                </Row>
            </PageHeader>
        </Card>
    );
};

export default OrderCard;
