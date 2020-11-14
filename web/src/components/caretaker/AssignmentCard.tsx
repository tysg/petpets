import React, { useEffect } from "react";
import {
    Button,
    Space,
    Descriptions,
    Card,
    Row,
    Col,
    PageHeader,
    Statistic,
    Tag,
    Divider
} from "antd";
import moment from "moment";
import { BidJoinOwnerPet } from "../../../../models/bid";
import DescriptionsItem from "antd/lib/descriptions/Item";

export default (props: BidJoinOwnerPet) => {
    const {
        fullname,
        avatar_url,
        address,
        phone,
        pet_name,
        start_date,
        end_date,
        requirements,
        category,
        ct_price
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
                    <Col span={20}>
                        <Descriptions bordered layout="vertical">
                            <DescriptionsItem label="Contact">
                                {phone}
                            </DescriptionsItem>
                            <DescriptionsItem label="Pet">
                                <Space align="center">
                                    {pet_name}
                                    <Tag>{category}</Tag>
                                </Space>
                            </DescriptionsItem>
                            <DescriptionsItem label="Duration">
                                {`${moment(start_date).format(
                                    "DD/MM/YYYY"
                                )} - ${moment(end_date).format("DD/MM/YYYY")}`}
                            </DescriptionsItem>
                            <DescriptionsItem
                                label="Instructions from Owner"
                                span={3}
                            >
                                {requirements}
                            </DescriptionsItem>
                        </Descriptions>
                    </Col>
                    <Col span={4}>
                        <Row>
                            <Statistic
                                title="Payout"
                                prefix="$"
                                precision={2}
                                value={
                                    ct_price *
                                    moment(start_date).diff(
                                        moment(end_date),
                                        "days"
                                    )
                                }
                            />
                        </Row>
                    </Col>
                </Row>
            </PageHeader>
        </Card>
    );
};
