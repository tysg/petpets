import React from "react";
import {
    Space,
    Descriptions,
    Card,
    Row,
    Col,
    PageHeader,
    Tag,
    Rate
} from "antd";
import moment from "moment";
import { BidJoinCareTaker } from "../../../../../models/bid";
import DescriptionsItem from "antd/lib/descriptions/Item";

export default (props: BidJoinCareTaker) => {
    const {
        fullname,
        avatar_url,
        address,
        feedback,
        pet_name,
        start_date,
        end_date,
        rating,
        ct_price,
        avg_rating,
        caretaker_status
    } = props;

    return (
        <Card>
            <PageHeader
                title={fullname}
                avatar={{
                    size: 80,
                    src: avatar_url
                }}
                subTitle={address}
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
                            <DescriptionsItem label="Rating">
                                <Rate
                                    disabled
                                    allowHalf
                                    defaultValue={rating}
                                />
                            </DescriptionsItem>
                            <DescriptionsItem label="Review" span={3}>
                                {feedback}
                            </DescriptionsItem>
                        </Descriptions>
                    </Col>
                </Row>
            </PageHeader>
        </Card>
    );
};
