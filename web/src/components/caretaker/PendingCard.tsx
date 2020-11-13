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
    Divider,
    Popconfirm
} from "antd";
import moment from "moment";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { BidJoinOwnerPet, TransportMethod } from "../../../../models/bid";
import DescriptionsItem from "antd/lib/descriptions/Item";

interface IconTextProps {
    icon: React.FC<{}>;
    text: string;
}

const Accept = () => {
    return (
        <Button type="primary">
            <Space>
                Accept
                <CheckCircleOutlined />
            </Space>
        </Button>
    );
};

const RejectButton = (props: IconTextProps) => {
    const { icon, text } = props;
    return (
        <Popconfirm title="Are you sure?" okText="Yes" cancelText="No">
            <Button danger>
                <Space>
                    {text}
                    {React.createElement(icon)}
                </Space>
            </Button>
        </Popconfirm>
    );
};

const convertTransportMethod = (key: TransportMethod) => {
    const mapping = {
        pickup: "Pick up",
        delivery: "Deliver",
        pcs: "Transfer through PCS Buidling"
    };
    return mapping[key];
};

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
        ct_price,
        transport_method
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
                                value={ct_price}
                            />
                        </Row>
                        <Divider />
                        <Row>
                            <Statistic
                                title="Transfer Method"
                                value={convertTransportMethod(transport_method)}
                            />
                        </Row>
                    </Col>
                </Row>
            </PageHeader>
        </Card>
    );
};
